import Link from 'next/link';
import { Plus, FileText, BookOpen, ImageOff } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Wiki } from '@/src/lib/db/models';

export default async function WikisListPage() {
  await connectDB();
  const wikis = await Wiki.find().populate('category', 'name').sort({ updatedAt: -1 });

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Wikis</h1>
          <p className="admin-subtitle">
            {wikis.length === 0
              ? 'Each wiki is a franchise that holds its own set of pages.'
              : `${wikis.length} wiki${wikis.length === 1 ? '' : 's'}, newest edits first.`}
          </p>
        </div>
        <Link href="/admin/wiki/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
          <Plus size={15} /> New wiki
        </Link>
      </div>

      {wikis.length === 0 ? (
        <div className="admin-empty">
          <BookOpen size={22} className="mx-auto text-foreground-muted mb-3" aria-hidden="true" />
          <p className="text-[13px] text-foreground mb-1">No wikis yet</p>
          <p className="admin-meta mb-4">
            A wiki groups pages for one franchise. Creating your first page starts one.
          </p>
          <Link href="/admin/wiki/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
            <Plus size={15} /> Create the first page
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wikis.map((w) => (
            // Outer element is a plain div, not a Link: the footer holds its own
            // Preview link, and an <a> inside an <a> is invalid HTML.
            <div key={w._id.toString()} className="admin-tile flex flex-col">
              <Link href={`/admin/pages?wikiId=${w._id}`} className="no-underline group">
                <div className="aspect-[16/9] bg-background-tertiary flex items-center justify-center">
                  {w.coverImage ? (
                    <img src={w.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={20} className="text-foreground-muted/50" aria-hidden="true" />
                  )}
                </div>
                <div className="px-4 pt-3.5 pb-3">
                  <h3 className="text-[13px] font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                    {w.name}
                  </h3>
                  <p className="admin-meta mt-1 truncate">
                    {(w.category as unknown as { name?: string } | null)?.name ?? 'Uncategorized'}
                  </p>
                </div>
              </Link>
              <div className="mt-auto flex items-center justify-between gap-2 px-4 py-2.5 border-t border-border">
                <span className="admin-meta admin-num flex items-center gap-1.5">
                  <FileText size={12} aria-hidden="true" />
                  {w.pageCount} page{w.pageCount === 1 ? '' : 's'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="admin-meta admin-num">{new Date(w.updatedAt).toLocaleDateString()}</span>
                  <Link
                    href={`/admin/preview/wiki/${w._id}`}
                    className="text-[11.5px] font-medium text-accent hover:underline"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
