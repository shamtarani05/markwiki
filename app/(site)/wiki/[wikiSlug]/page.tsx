import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Wiki, Page as PageModel, Revision } from '@/src/lib/db/models';
import ReactionButton from '@/src/components/community/ReactionButton';
import CommentSection from '@/src/components/community/CommentSection';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';

export default async function Page({ params }: { params: Promise<{ wikiSlug: string }> }) {
  const { wikiSlug } = await params;
  await connectDB();
  
  const session = await getSessionUser();
  const isAdmin = session && isTrustedRole(session.role);
  
  const query = isAdmin 
    ? { slug: wikiSlug } 
    : { slug: wikiSlug, status: 'approved' as const };
    
  const wiki = await Wiki.findOne(query).populate('category', 'name slug').lean();
  
  if (!wiki) {
    return notFound();
  }

  // 1. Fetch Pages (Published or Admin-Viewable)
  const pageQuery = isAdmin 
    ? { wiki: wiki._id } 
    : { wiki: wiki._id, status: 'published' as const };
  const pages = await PageModel.find(pageQuery).lean();

  // 2. Metrics
  const totalArticles = pages.length;
  const totalViews = pages.reduce((acc: number, p: any) => acc + (p.viewCount || 0), 0);
  
  // 3. Group by Archetype for Nav Tabs
  // We'll create distinct tabs based on available page types
  const archetypes = [...new Set(pages.map((p: any) => p.pageType))].filter(t => t !== 'cover');
  const typeLabels: Record<string, string> = {
    overview: 'Overview',
    character: 'Characters & Hunters',
    location: 'Dungeons & Gates',
    episode: 'Webtoon Chapters',
    group: 'Shadow Monarchs',
    item: 'Artifacts & Weapons',
    concept: 'Lore & Concepts',
    site: 'General',
  };

  // 4. Trending & Featured
  const coverPage = pages.find((p: any) => p.slug === '_cover');
  const trendingPages = [...pages].sort((a: any, b: any) => (b.searchCount || 0) - (a.searchCount || 0)).slice(0, 4);

  // 5. Recent Activity
  const recentRevisions = await Revision.find({ contentType: 'page', contentId: { $in: pages.map((p: any) => p._id) } })
    .sort({ createdAt: -1 })
    .populate('editedBy', 'name')
    .limit(5)
    .lean();
    
  // 6. Canon Directory Grouped by Type
  const directory = archetypes.map(type => ({
    type,
    label: typeLabels[type] || type,
    pages: pages.filter((p: any) => p.pageType === type).slice(0, 5) // limit to 5 per section for sidebar
  }));

  return (
    <>
      <div className="flex flex-col w-full">
        {/* 1. WIKI HERO */}
        <section className="relative w-full -mt-[72px] pt-[72px] h-[580px] flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${wiki.coverImage || 'https://picsum.photos/id/1/200/300'}')`}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-surface-container-lowest/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/70 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_40%,rgba(160,120,255,0.18),transparent)] pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg pb-space-xl flex flex-col justify-end">
            <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-mono text-label-mono mb-space-sm">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" href="/search?q=">Wikis</Link>
              <span className="text-outline-variant">/</span>
              <span className="hover:text-primary transition-colors">{(wiki.category as any)?.name || 'Category'}</span>
              <span className="text-outline-variant">/</span>
              <span className="text-secondary font-semibold">{wiki.name}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-space-xs mb-space-md">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm">
                <span className="material-symbols-outlined text-xs">verified</span> Official Community Wiki
              </span>
              {wiki.isFeatured && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-secondary font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: '\'FILL\' 1'}}>local_fire_department</span> Trending
                </span>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
              <div className="space-y-space-xs max-w-3xl">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center shadow-xl overflow-hidden shrink-0">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 48 48">
                      <circle cx="24" cy="11" fill="currentColor" r="3.5" />
                      <path d="M10 37V19L24 28L38 19V37" />
                      <path d="M18 24.5L24 33L30 24.5" stroke="#a078ff" strokeWidth="3" />
                      <line x1="12" x2="36" y1="36" y2="36" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-label-mono text-label-mono uppercase tracking-widest text-outline">{wiki.description ? wiki.description.substring(0, 40) : 'Living Codex'}</p>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{wiki.name}</h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 pt-space-xs text-on-surface-variant font-label-mono text-label-mono">
                  <span className="flex items-center gap-1 text-on-surface font-semibold"><span className="material-symbols-outlined text-sm text-primary">menu_book</span> {totalArticles.toLocaleString()} <span className="font-normal text-on-surface-variant">Articles</span></span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1 text-on-surface font-semibold"><span className="material-symbols-outlined text-sm text-tertiary">visibility</span> {totalViews >= 1000 ? (totalViews/1000).toFixed(1) + 'K' : totalViews} <span className="font-normal text-on-surface-variant">Readers</span></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm shrink-0">
                <Link className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider shadow-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all" href="#featured-pillar">
                  <span className="material-symbols-outlined text-base">explore</span> Explore Wiki
                </Link>
                {pages.length > 0 && (
                  <Link href={`/wiki/${wikiSlug}/${pages[Math.floor(Math.random() * pages.length)].slug}`} className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-caps text-label-caps uppercase tracking-wider hover:bg-surface-bright transition-all">
                    <span className="material-symbols-outlined text-base">shuffle</span> Random Article
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. WIKI NAVIGATION TABS */}
        <div className="sticky top-[72px] z-40 w-full bg-surface-container-lowest/90 backdrop-blur-xl shadow-md py-2.5">
          <div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1">
              <button className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-wider shadow-sm shrink-0">Overview</button>
              {archetypes.map(type => (
                <button key={String(type)} className="px-space-md py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider shrink-0 transition-colors">
                  {typeLabels[String(type)] || String(type)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. THREE-COLUMN EDITORIAL HUB LAYOUT */}
        <main className="w-full max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg pt-space-xl pb-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            
            {/* LEFT COLUMN: Canon Directory */}
            <aside className="lg:col-span-3 space-y-space-lg">
              <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md">
                <div className="flex items-center justify-between pb-space-xs">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">account_tree</span>
                    Canon Directory
                  </h3>
                </div>
                
                <div className="space-y-space-md">
                  {directory.length === 0 && <p className="text-sm text-on-surface-variant">No pages found.</p>}
                  {directory.map(group => (
                    <div key={String(group.type)} className="space-y-space-xs">
                      <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider py-1">
                        <span>{group.label}</span>
                        <span className="text-tertiary">{group.pages.length} Pages</span>
                      </div>
                      <ul className="space-y-1 pl-2">
                        {group.pages.map((p: any) => (
                          <li key={p._id.toString()}>
                            <Link href={`/wiki/${wikiSlug}/${p.slug}`} className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-all">
                              <span className="text-body-sm font-body-sm text-on-surface group-hover:text-primary transition-colors truncate">{p.title}</span>
                              <span className="text-outline text-xs material-symbols-outlined group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* CENTER COLUMN */}
            <div className="lg:col-span-6 space-y-space-xl">
              
              {/* Featured Cover Page */}
              <section id="featured-pillar">
                <div className="flex items-center justify-between mb-space-md">
                  <h2 className="font-headline text-headline text-on-surface">Featured Overview</h2>
                </div>
                {coverPage ? (
                  <Link href={`/wiki/${wikiSlug}/_cover`} className="group block relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md bg-surface-container-low border border-outline-variant/30 transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `url('${coverPage.coverImage || wiki.coverImage || 'https://picsum.photos/id/1/200/300'}')`}}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_40%,rgba(139,92,246,0.1),transparent)] pointer-events-none"></div>
                    
                    <div className="absolute bottom-0 w-full p-space-lg flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-sm bg-primary/20 text-primary font-label-caps text-label-caps uppercase tracking-wider">Core Canon</span>
                      </div>
                      <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 group-hover:text-primary transition-colors">{coverPage.title}</h3>
                      <p className="text-on-surface-variant line-clamp-2 text-body max-w-2xl">
                        {coverPage.excerpt || 'Explore the comprehensive overview of the lore, history, and defining characteristics of this incredible universe.'}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="w-full h-32 rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined mb-2">article</span>
                    <p>No cover page created yet.</p>
                  </div>
                )}
              </section>

              {/* Trending Grimoires */}
              <section>
                <div className="flex items-center justify-between mb-space-md">
                  <h2 className="font-headline text-headline text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">local_fire_department</span> Trending Articles
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {trendingPages.map((page, i) => (
                    <Link key={page._id.toString()} href={`/wiki/${wikiSlug}/${page.slug}`} className="group flex flex-col h-[280px] bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-md">
                      <div className="relative h-[140px] w-full overflow-hidden bg-surface-container-high">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url('${page.coverImage || 'https://picsum.photos/400/200?random='+i}')`}}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                      </div>
                      <div className="flex-1 p-space-md flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-label-caps uppercase tracking-wider text-primary">{typeLabels[page.pageType] || page.pageType}</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1">{page.title}</h3>
                        <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 mt-auto">
                          {page.excerpt || 'Dive deep into the intricacies of this fascinating lore entry.'}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {trendingPages.length === 0 && <p className="text-sm text-on-surface-variant col-span-2">No articles published yet.</p>}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Recent Activity */}
            <aside className="lg:col-span-3 space-y-space-lg">
              <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md sticky top-32">
                <div className="flex items-center justify-between pb-space-xs">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-xl">history</span> Recent Activity
                  </h3>
                </div>
                
                <div className="space-y-space-sm relative before:absolute before:inset-y-2 before:left-3 before:w-px before:bg-outline-variant/30">
                  {recentRevisions.length === 0 && <p className="text-sm text-on-surface-variant pl-8">No recent edits.</p>}
                  {recentRevisions.map((rev, i) => (
                    <div key={rev._id.toString()} className="relative pl-8">
                      <div className="absolute left-[9px] top-1.5 w-1.5 h-1.5 rounded-full bg-tertiary outline outline-4 outline-surface-container-low shadow-[0_0_8px_rgba(160,120,255,0.6)]"></div>
                      <div className="bg-surface-container rounded-lg p-3 border border-outline-variant/20 hover:border-tertiary/40 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <Link href={`/wiki/${wikiSlug}/${pages.find((p: any) => p._id.toString() === rev.contentId.toString())?.slug || '_cover'}`} className="text-sm font-medium text-on-surface hover:text-tertiary truncate max-w-[140px]">
                            {rev.title}
                          </Link>
                          <span className="text-xs text-on-surface-variant shrink-0">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mb-2 line-clamp-2">
                          {rev.editSummary || 'Minor layout adjustments and content cleanup.'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            <span className="text-[9px] text-primary font-bold">{(rev.editedBy as any)?.name?.charAt(0) || 'U'}</span>
                          </div>
                          <span className="text-xs text-outline">{(rev.editedBy as any)?.name || 'Unknown User'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
