import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { Wiki } from '@/src/lib/db/models';

export default async function WikisListPage() {
  await connectDB();
  const wikis = await Wiki.find().populate('category', 'name').sort({ updatedAt: -1 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Wikis</h1>
        <Link href="/admin/wiki/new" className="btn btn-primary text-sm py-2 flex items-center gap-1.5">
          <Plus size={16} /> New Wiki
        </Link>
      </div>

      {wikis.length === 0 ? (
        <p className="text-foreground-muted">
          No wikis yet.{' '}
          <Link href="/admin/wiki/new" className="text-accent hover:underline">Create the first page</Link>{' '}
          to start one.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wikis.map((w) => (
            <Link
              key={w._id.toString()}
              href={`/admin/pages?wikiId=${w._id}`}
              className="card overflow-hidden hover:border-accent transition-colors"
            >
              <div className="aspect-[16/9] bg-background-tertiary">
                {w.coverImage && <img src={w.coverImage} alt={w.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground truncate">{w.name}</h3>
                <p className="text-xs text-foreground-muted mt-1">
                  {(w.category as unknown as { name?: string } | null)?.name ?? 'Uncategorized'}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-xs text-foreground-muted">
                    <FileText size={12} /> {w.pageCount} page{w.pageCount === 1 ? '' : 's'}
                  </span>
                  <span className="text-xs text-foreground-muted">{new Date(w.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
