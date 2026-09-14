import Link from 'next/link';
import { Plus, Feather, ImageOff } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { ShortStory } from '@/src/lib/db/models';

export default async function ShortStoryListPage() {
  await connectDB();
  const stories = await ShortStory.find().populate('author', 'name').sort({ updatedAt: -1 }).lean();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Short Stories</h1>
          <p className="admin-subtitle">
            {stories.length === 0
              ? 'Manage single-page standalone stories.'
              : `${stories.length} stor${stories.length === 1 ? 'y' : 'ies'}, newest edits first.`}
          </p>
        </div>
        <Link href="/admin/short-stories/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
          <Plus size={15} /> New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="admin-empty">
          <Feather size={22} className="mx-auto text-on-surface-variant mb-3" aria-hidden="true" />
          <p className="text-[13px] text-on-surface mb-1">No short stories yet</p>
          <p className="admin-meta mb-4">
            Short stories are standalone pieces of fiction without chapters.
          </p>
          <Link href="/admin/short-stories/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
            <Plus size={15} /> Create the first story
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stories.map((s: any) => (
            <div key={s._id.toString()} className="admin-tile flex flex-col">
              <Link href={`/admin/short-stories/${s._id}`} className="no-underline group">
                <div className="aspect-[2/3] bg-surface-variant flex items-center justify-center relative overflow-hidden">
                  {s.coverImage ? (
                    <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ImageOff size={24} className="text-on-surface-variant/50" aria-hidden="true" />
                  )}
                  {/* Status badge */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      s.status === 'published'
                        ? 'bg-primary text-background'
                        : 'bg-surface-variant text-on-surface-variant border border-outline-variant/30'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="px-4 pt-3.5 pb-3">
                  <h3 className="text-[14px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="admin-meta mt-1 line-clamp-2">
                    {s.synopsis || 'No synopsis provided.'}
                  </p>
                  <p className="admin-meta mt-2 text-[11px] font-medium text-primary">
                    {s.genres?.join(', ') || 'Uncategorized'}
                  </p>
                </div>
              </Link>
              <div className="mt-auto flex items-center justify-between gap-2 px-4 py-2.5 border-t border-outline-variant/30 bg-surface-container-low/30">
                <span className="admin-meta admin-num font-medium text-on-surface">
                  {s.readingTime} min read
                </span>
                <span className="admin-meta admin-num text-right">{new Date(s.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
