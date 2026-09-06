import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getTrendingPages } from '@/src/lib/db/trending';
import WikiHubCoverBlocks from '@/src/components/wiki/WikiHubCoverBlocks';
import type { Block } from '@/src/lib/blocks/types';

interface Props {
  params: Promise<{ wikiSlug: string }>;
  searchParams: Promise<{ q?: string }>;
}

// This is the wiki's own "cover page" — created automatically the moment a
// Wiki exists (no separate creation step needed), and it's what /wiki/[slug]
// shows before a reader picks any individual Character/Location/Episode
// page. Everything on it (stats, featured/recent pages, categories) is
// computed live from the Page/Revision documents that already exist for
// this wiki, not authored separately.
async function loadWiki(wikiSlug: string) {
  await connectDB();
  const wiki = await Wiki.findOne({ slug: wikiSlug, status: 'approved' }).populate('category', 'name').lean();
  if (!wiki) return null;
  return wiki;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wikiSlug } = await params;
  const wiki = await loadWiki(wikiSlug);
  if (!wiki) return {};
  const description = wiki.description || `The ${wiki.name} wiki — ${wiki.pageCount} pages and counting.`;
  return {
    title: `${wiki.name} Wiki`,
    description,
    alternates: { canonical: `/wiki/${wikiSlug}` },
    openGraph: { title: `${wiki.name} Wiki`, description, type: 'website', images: wiki.coverImage ? [wiki.coverImage] : undefined },
  };
}

export default async function WikiHomePage({ params, searchParams }: Props) {
  const { wikiSlug } = await params;
  const { q } = await searchParams;
  const wiki = await loadWiki(wikiSlug);
  if (!wiki) notFound();

  const publishedFilter = { wiki: wiki._id, status: 'published' as const };

  if (q?.trim()) {
    const results = await Page.find({ ...publishedFilter, $text: { $search: q.trim() } })
      .select('title slug pageType coverImage')
      .limit(30)
      .lean();

    // A page surfacing in a search someone actually ran is a trending
    // signal in its own right — see src/lib/db/trending.ts.
    if (results.length > 0) {
      void Page.updateMany({ _id: { $in: results.map((p) => p._id) } }, { $inc: { searchCount: 1 } }).exec();
    }

    return (
      <div className="min-h-screen bg-background pb-16">
        <div className="container py-8">
          <Link href={`/wiki/${wikiSlug}`} className="text-accent text-sm hover:underline">← Back to {wiki.name} Wiki</Link>
          <h1 className="text-2xl font-bold text-foreground mt-2 mb-6">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
          </h1>
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((p) => (
              <Link key={p._id.toString()} href={`/wiki/${wikiSlug}/${p.slug}`} className="card p-4 hover:border-accent">
                <span className="text-xs text-accent font-medium capitalize">{p.pageType}</span>
                <h3 className="font-semibold text-foreground mt-1">{p.title}</h3>
              </Link>
            ))}
            {results.length === 0 && <p className="text-foreground-muted">No pages matched.</p>}
          </div>
        </div>
      </div>
    );
  }

  const coverPage = wiki.coverPage
    ? await Page.findById(wiki.coverPage).lean()
    : null;

  const [totalViews, trendingPages, categoryAgg] = await Promise.all([
    Page.aggregate([{ $match: publishedFilter }, { $group: { _id: null, total: { $sum: '$viewCount' } } }]),
    getTrendingPages(publishedFilter, 4),
    Page.aggregate([
      { $match: publishedFilter },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);
  const pageIds = (await Page.find(publishedFilter).select('_id').lean()).map((p) => p._id);
  const recentRevisions = await Revision.find({ contentType: 'page', contentId: { $in: pageIds } })
    .populate('editedBy', 'name')
    .populate({ path: 'contentId', select: 'title slug', model: 'Page' })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentActivityItems = recentRevisions.map((rev) => {
    const content = rev.contentId as unknown as { title?: string; slug?: string } | null;
    return {
      _id: rev._id.toString(),
      title: content?.title ?? rev.title,
      editSummary: rev.editSummary,
      editorName: (rev.editedBy as unknown as { name?: string })?.name ?? 'Unknown',
      createdAt: rev.createdAt.toISOString(),
      pageSlug: content?.slug,
    };
  });

  const trendingPagesData = trendingPages.map((p) => ({
    _id: p._id.toString(), slug: p.slug, pageType: p.pageType,
    title: p.title, viewCount: p.viewCount, searchCount: p.searchCount,
  }));

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="relative h-64 md:h-80 overflow-hidden bg-background-tertiary">
        {wiki.coverImage && <img src={wiki.coverImage} alt={wiki.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{wiki.name} Wiki</h1>
            {wiki.description && <p className="text-foreground-muted max-w-2xl">{wiki.description}</p>}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <form action={`/wiki/${wikiSlug}`} method="get" className="mb-8">
          <input
            type="search"
            name="q"
            placeholder={`Search ${wiki.name} Wiki...`}
            className="w-full px-5 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </form>

        {coverPage ? (
          <WikiHubCoverBlocks
            blocks={coverPage.blocks as Block[]}
            wikiSlug={wikiSlug}
            pageCount={wiki.pageCount}
            totalViews={totalViews[0]?.total ?? 0}
            trendingPages={trendingPagesData}
            recentActivityItems={recentActivityItems}
          />
        ) : (
          <p className="text-foreground-muted">
            No pages published yet. <Link href="/admin/wiki/new" className="text-accent hover:underline">Add the first one →</Link>
          </p>
        )}

        {categoryAgg.length > 0 && (
          <div className="card p-4 mt-8 max-w-sm">
            <h3 className="font-bold text-foreground mb-3">Categories</h3>
            <div className="space-y-2">
              {categoryAgg.map((cat: { _id: string; count: number }) => (
                <div key={cat._id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">{cat._id}</span>
                  <span className="text-xs text-foreground-muted bg-background-secondary px-2 py-0.5 rounded">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form action={`/wiki/${wikiSlug}/random`} className="card p-4 mt-6 max-w-sm">
          <h3 className="font-bold text-foreground mb-3">Quick Links</h3>
          <button type="submit" className="block text-foreground-muted hover:text-accent transition-colors text-sm">
            Random page →
          </button>
        </form>
      </div>
    </div>
  );
}
