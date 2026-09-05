import Link from 'next/link';
import { Plus } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

const STATUS_BADGE: Record<string, string> = {
  draft: 'badge-yellow',
  published: 'badge-green',
  archived: 'badge-gray',
};

export default async function PagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ wikiId?: string }>;
}) {
  await connectDB();
  const { wikiId } = await searchParams;

  const [pages, wiki] = await Promise.all([
    Page.find(wikiId ? { wiki: wikiId } : {})
      .populate('wiki', 'name')
      .sort({ updatedAt: -1 })
      .limit(100),
    wikiId ? Wiki.findById(wikiId) : null,
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pages</h1>
          {wiki && (
            <p className="text-sm text-foreground-muted mt-1">
              Filtered to <span className="text-accent font-medium">{wiki.name}</span> ·{' '}
              <Link href="/admin/pages" className="hover:underline">clear filter</Link>
            </p>
          )}
        </div>
        <Link href="/admin/wiki/new" className="btn btn-primary text-sm py-2 flex items-center gap-1.5">
          <Plus size={16} /> New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <p className="text-foreground-muted">No pages yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.map((p) => (
            <Link
              key={p._id.toString()}
              href={`/admin/wiki/${p._id}/edit`}
              className="card overflow-hidden hover:border-accent transition-colors"
            >
              <div className="aspect-[16/9] bg-background-tertiary">
                {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-foreground-muted">{p.pageType}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_BADGE[p.status]}`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-xs text-foreground-muted truncate">
                    {(p.wiki as unknown as { name?: string } | null)?.name ?? '—'}
                  </span>
                  <span className="text-xs text-foreground-muted shrink-0 ml-2">{new Date(p.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
