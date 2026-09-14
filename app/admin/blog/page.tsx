import Link from 'next/link';
import { Plus, PenTool, ImageOff } from 'lucide-react';
import connectDB from '@/src/lib/db/connection';
import { BlogPost } from '@/src/lib/db/models';

export default async function BlogListPage() {
  await connectDB();
  const posts = await BlogPost.find().populate('author', 'name').sort({ updatedAt: -1 }).lean();

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Blog Posts</h1>
          <p className="admin-subtitle">
            {posts.length === 0
              ? 'Manage articles, news, and long-form content.'
              : `${posts.length} post${posts.length === 1 ? '' : 's'}, newest edits first.`}
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
          <Plus size={15} /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-empty">
          <PenTool size={22} className="mx-auto text-on-surface-variant mb-3" aria-hidden="true" />
          <p className="text-[13px] text-on-surface mb-1">No posts yet</p>
          <p className="admin-meta mb-4">
            Blog posts are perfect for announcements, news, or articles.
          </p>
          <Link href="/admin/blog/new" className="btn btn-primary text-[13px] py-2 px-4 no-underline">
            <Plus size={15} /> Create the first post
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((p: any) => (
            <div key={p._id.toString()} className="admin-tile flex flex-col">
              <Link href={`/admin/blog/${p._id}`} className="no-underline group">
                <div className="aspect-video bg-surface-variant flex items-center justify-center relative overflow-hidden">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ImageOff size={24} className="text-on-surface-variant/50" aria-hidden="true" />
                  )}
                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'published'
                        ? 'bg-primary text-background'
                        : 'bg-surface-variant text-on-surface-variant border border-outline-variant/30'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="px-4 pt-3.5 pb-3">
                  <h3 className="text-[14px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="admin-meta mt-1 line-clamp-2">
                    {p.excerpt}
                  </p>
                </div>
              </Link>
              <div className="mt-auto flex items-center justify-between gap-2 px-4 py-2.5 border-t border-outline-variant/30 bg-surface-container-low/30">
                <span className="admin-meta admin-num font-medium text-on-surface">
                  {p.readingTime} min read
                </span>
                <span className="admin-meta admin-num text-right">{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
