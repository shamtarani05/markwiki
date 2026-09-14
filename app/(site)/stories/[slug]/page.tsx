import { notFound } from 'next/navigation';
import { ShortStory } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const story = await ShortStory.findOne({ slug, status: 'published' }).lean();
  if (!story) return {};
  return {
    title: `${story.title} | Short Stories | MarcWiki`,
    description: story.synopsis,
  };
}

export default async function ShortStoryPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const story = await ShortStory.findOne({ slug, status: 'published' })
    .populate('author', 'name')
    .lean();

  if (!story) notFound();

  // Track view
  void ShortStory.updateOne({ _id: story._id }, { $inc: { viewCount: 1 } }).exec();

  return (
    <article className="min-h-screen pb-24 bg-surface-container-lowest transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          href="/stories" 
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8 bg-surface-container-lowest/80 backdrop-blur-sm py-1.5 px-3 rounded-full border border-outline-variant/30 w-fit"
        >
          <ArrowLeft size={16} /> Back to Stories
        </Link>

        <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
          {story.coverImage && (
            <div className="w-full md:w-1/3 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-lg">
              <img 
                src={story.coverImage} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 flex flex-col justify-center py-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {story.genres?.map((genre: string) => (
                <span key={genre} className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                  {genre}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight">
              {story.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant text-sm md:text-base mb-6">
              <span className="font-medium text-on-surface">{(story.author as any)?.name || 'Admin'}</span>
              <span>•</span>
              <span>{story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
              <span>•</span>
              <span>{story.readingTime} min read</span>
            </div>
            
            {story.synopsis && (
              <div className="text-on-surface-variant text-lg italic border-l-4 border-accent/30 pl-4 py-1">
                {story.synopsis}
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto border-t border-outline-variant/30 pt-12">
          <BlockListRenderer blocks={story.blocks || []} />
        </div>
      </div>
    </article>
  );
}
