import Link from 'next/link';
import { Search } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Wiki, Page, Book as BookModel, ShortStory, BlogPost } from '@/src/lib/db/models';

export default async function SiteSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  await connectDB();

  const query = q?.trim();
  let results: any[] = [];

  if (query) {
    const regex = new RegExp(query, 'i');
    const [wikis, pages, books, stories, blogs] = await Promise.all([
      Wiki.find({ name: regex }).limit(10).lean(),
      Page.find({ title: regex, status: 'published' }).populate('wiki', 'name slug').limit(15).lean(),
      BookModel.find({ title: regex, status: 'published' }).limit(10).lean(),
      ShortStory.find({ title: regex, status: 'published' }).limit(10).lean(),
      BlogPost.find({ title: regex, status: 'published' }).limit(10).lean(),
    ]);

    results = [
      ...wikis.map(w => ({ _id: w._id, type: 'wiki', title: w.name, subtitle: 'Wiki', desc: w.description, link: `/wiki/${w.slug}` })),
      ...pages.map(p => ({ _id: p._id, type: 'page', title: p.title, subtitle: `Page · ${(p as any).wiki?.name || 'General'}`, desc: p.excerpt || p.content?.substring(0, 100), link: `/wiki/${(p as any).wiki?.slug || 'general'}/${p.slug}` })),
      ...books.map(b => ({ _id: b._id, type: 'book', title: b.title, subtitle: `Book · ${(b as any).wiki?.name || 'General'}`, desc: b.synopsis, link: `/book/${b.slug}` })),
      ...stories.map(s => ({ _id: s._id, type: 'story', title: s.title, subtitle: `Short Story · ${(s as any).wiki?.name || 'General'}`, desc: s.synopsis, link: `/stories/${s.slug}` })),
      ...blogs.map(b => ({ _id: b._id, type: 'blog', title: b.title, subtitle: 'Blog Post', desc: b.excerpt, link: `/blog/${b.slug}` }))
    ];
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline text-on-surface">
          Search Results
        </h1>
        <p className="text-xl text-on-surface-variant mb-12">
          {query ? `Showing results for "${query}"` : 'Enter a query to search across wikis, pages, books, and stories.'}
        </p>

        {!query ? (
          <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-border">
            <Search size={32} className="mx-auto text-outline mb-4" />
            <p className="text-lg text-on-surface mb-2">Search across the universe</p>
            <p className="text-on-surface-variant">
              Use the search bar above to find lore, characters, stories, and blogs.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-border">
            <Search size={32} className="mx-auto text-outline mb-4" />
            <p className="text-lg text-on-surface mb-2">No results found</p>
            <p className="text-on-surface-variant">
              We couldn't find anything matching "{query}". Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((r, i) => (
              <Link 
                key={`${r.type}-${r._id}-${i}`} 
                href={r.link} 
                className="block p-5 bg-surface-container-low border border-border hover:border-primary/50 hover:bg-surface-container transition-all rounded-xl group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-muted text-primary uppercase tracking-wider">
                        {r.type}
                      </span>
                      <span className="text-sm text-on-surface-variant">{r.subtitle}</span>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
                      {r.title}
                    </h2>
                    {r.desc && (
                      <p className="text-sm text-on-surface-variant line-clamp-2">
                        {r.desc.replace(/<[^>]*>?/gm, '')}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
