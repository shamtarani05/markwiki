import Link from 'next/link';
import { Search, Database, FileText, Book, BookOpen, PenTool } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Wiki, Page, Book as BookModel, ShortStory, BlogPost } from '@/src/lib/db/models';

export default async function AdminSearchPage({
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
      Page.find({ title: regex }).populate('wiki', 'name').limit(15).lean(),
      BookModel.find({ title: regex }).limit(10).lean(),
      ShortStory.find({ title: regex }).limit(10).lean(),
      BlogPost.find({ title: regex }).limit(10).lean(),
    ]);

    results = [
      ...wikis.map(w => ({ _id: w._id, type: 'wiki', title: w.name, subtitle: 'Wiki', link: `/admin/pages?wikiId=${w._id}` })),
      ...pages.map(p => ({ _id: p._id, type: 'page', title: p.title, subtitle: `Page · ${(p as any).wiki?.name || 'Uncategorized'}`, link: `/admin/wiki/${p._id}/edit` })),
      ...books.map(b => ({ _id: b._id, type: 'book', title: b.title, subtitle: `Book · ${(b as any).wiki?.name || 'Uncategorized'}`, link: `/admin/books/${b._id}` })),
      ...stories.map(s => ({ _id: s._id, type: 'story', title: s.title, subtitle: `Short Story · ${(s as any).wiki?.name || 'Uncategorized'}`, link: `/admin/short-stories/${s._id}` })),
      ...blogs.map(b => ({ _id: b._id, type: 'blog', title: b.title, subtitle: 'Blog Post', link: `/admin/blog/${b._id}` }))
    ];
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wiki': return <Database size={16} className="text-[#8B5CF6]" />;
      case 'page': return <FileText size={16} className="text-[#35C98A]" />;
      case 'book': return <BookOpen size={16} className="text-[#E8AF35]" />;
      case 'story': return <Book size={16} className="text-[#F87171]" />;
      case 'blog': return <PenTool size={16} className="text-[#60A5FA]" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Search Results</h1>
          <p className="admin-subtitle">
            {query ? `Showing results for "${query}"` : 'Enter a query in the top bar to search content.'}
          </p>
        </div>
      </div>

      {!query ? (
        <div className="admin-empty">
          <Search size={22} className="mx-auto text-[#706F78] mb-3" aria-hidden="true" />
          <p className="text-[13px] text-[#F5F3EF] mb-1">Search across all content</p>
          <p className="admin-meta mb-4">
            Use the search bar above to find wikis, pages, books, stories, and blogs.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="admin-empty">
          <Search size={22} className="mx-auto text-[#706F78] mb-3" aria-hidden="true" />
          <p className="text-[13px] text-[#F5F3EF] mb-1">No results found</p>
          <p className="admin-meta mb-4">
            We couldn't find anything matching "{query}". Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 max-w-4xl">
          {results.map((r, i) => (
            <Link key={`${r.type}-${r._id}-${i}`} href={r.link} className="admin-panel flex flex-row items-center gap-4 p-4 hover:border-accent transition-colors no-underline">
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center shrink-0">
                {getTypeIcon(r.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-medium text-[#F5F3EF] truncate">{r.title}</h4>
                <p className="text-[12px] text-[#706F78] truncate mt-0.5">{r.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
