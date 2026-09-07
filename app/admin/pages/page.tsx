import Link from 'next/link';
import { Plus, FileText, ImageOff, X } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

const STATUS_BADGE: Record<string, string> = {
  draft: 'badge-yellow',
  published: 'badge-green',
  archived: 'badge-gray',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

const PAGE_TYPE_LABEL: Record<string, string> = {
  overview: 'Overview',
  character: 'Character',
  location: 'Location',
  episode: 'Episode',
  blank: 'Blank',
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
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Pages</h1>
          <p className="admin-subtitle">
            {pages.length === 0
              ? 'Every article inside your wikis lives here.'
              : `${pages.length} page${pages.length === 1 ? '' : 's'}, newest edits first.`}
          </p>
        </div>
        <Link href="/admin/wiki/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
          <Plus size={15} /> New page
        </Link>
      </div>

      {/* An active filter is state the admin can't otherwise see, so it gets a
          visible, dismissible token rather than a sentence. */}
      {wiki && (
        <div className="flex items-center gap-2 mb-4">
          <span className="admin-meta">Filtered to</span>
          <Link
            href="/admin/pages"
            className="admin-chip bg-accent-muted text-accent no-underline hover:opacity-80 transition-opacity"
            title="Clear filter"
          >
            {wiki.name}
            <X size={12} aria-hidden="true" />
          </Link>
        </div>
      )}

      {pages.length === 0 ? (
        <div className="admin-empty">
          <FileText size={22} className="mx-auto text-foreground-muted mb-3" aria-hidden="true" />
          <p className="text-[13px] text-foreground mb-1">
            {wiki ? `No pages in ${wiki.name} yet` : 'No pages yet'}
          </p>
          <p className="admin-meta mb-4">Start from an archetype — overview, character, location or episode.</p>
          <Link href="/admin/wiki/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
            <Plus size={15} /> New page
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.map((p) => (
            <Link
              key={p._id.toString()}
              href={`/admin/wiki/${p._id}/edit`}
              className="admin-tile no-underline group flex flex-col"
            >
              <div className="aspect-[16/9] bg-background-tertiary flex items-center justify-center">
                {p.coverImage ? (
                  <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={20} className="text-foreground-muted/50" aria-hidden="true" />
                )}
              </div>
              <div className="px-4 pt-3.5 pb-3">
                <h3 className="text-[13px] font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="admin-meta mt-1 truncate">
                  {(p.wiki as unknown as { name?: string } | null)?.name ?? 'No wiki'}
                  <span aria-hidden="true" className="inline-block w-px h-3 align-middle bg-border mx-2" />
                  {PAGE_TYPE_LABEL[p.pageType] ?? p.pageType}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 px-4 py-2.5 border-t border-border">
                <span className={`admin-chip ${STATUS_BADGE[p.status] ?? 'badge-gray'}`}>
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
                <span className="admin-meta admin-num">{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
