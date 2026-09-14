import { notFound } from 'next/navigation';
import { BlogPost } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({ slug, status: 'published' }).lean();
  if (!post) return {};
  return {
    title: `${post.title} | Blog | MarcWiki`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const post = await BlogPost.findOne({ slug, status: 'published' })
    .populate('author', 'name')
    .lean();

  if (!post) notFound();

  // Track view
  void BlogPost.updateOne({ _id: post._id }, { $inc: { viewCount: 1 } }).exec();

  return (
    <article className="min-h-screen pb-24">
      {post.coverImage && (
        <div className="w-full h-[40vh] md:h-[50vh] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`container mx-auto px-4 max-w-3xl ${post.coverImage ? '-mt-32 relative z-20' : 'pt-24'}`}>
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8 bg-surface-container-lowest/80 backdrop-blur-sm py-1.5 px-3 rounded-full border border-outline-variant/30 w-fit"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <div className="mb-12 text-center bg-surface-container-lowest/80 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-outline-variant/30 shadow-xl">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wider text-primary mb-6">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="bg-primary/10 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-on-surface-variant">
            <span className="font-medium text-on-surface">{(post.author as any)?.name || 'Admin'}</span>
            <span>•</span>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-on-surface prose-a:text-primary hover:prose-a:text-primary-hover"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
