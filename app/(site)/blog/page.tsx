import Link from 'next/link';
import { BlogPost } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | MarcWiki',
  description: 'Latest news, articles, and updates.',
};

export default async function BlogListingPage() {
  await connectDB();
  const posts = await BlogPost.find({ status: 'published' })
    .populate('author', 'name')
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-lg text-foreground-muted">Latest news, articles, and updates.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-foreground-muted">
          <p>No posts published yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              key={post._id.toString()}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-background-secondary rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {post.coverImage && (
                <div className="aspect-video relative overflow-hidden bg-background-tertiary">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  <span>{post.tags?.[0] || 'Article'}</span>
                  <span className="text-foreground-muted">{post.readingTime} min read</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-foreground-muted line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-sm font-medium text-foreground">
                    {post.author?.name || 'Admin'}
                  </span>
                  <span className="text-sm text-foreground-muted">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
