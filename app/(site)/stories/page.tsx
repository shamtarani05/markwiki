import Link from 'next/link';
import { ShortStory } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Short Stories | MarcWiki',
  description: 'Explore standalone short fiction.',
};

export default async function ShortStoriesListingPage() {
  await connectDB();
  const stories = await ShortStory.find({ status: 'published' })
    .populate('author', 'name')
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-20">
      {/* Dynamic Header with Gradients */}
      <div className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden border-b border-outline-variant/30 mb-10 bg-surface-container-lowest">
        {/* Cosmic Violet Nebula Glow Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-primary/30 via-secondary-container/20 to-transparent blur-[140px] rounded-full"></div>
          <div className="absolute top-1/3 -left-[10%] w-[500px] h-[500px] bg-secondary-container/15 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/4 -right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full"></div>
        </div>
        {/* Editorial Ambient Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(160,120,255,0.12),transparent)] pointer-events-none"></div>

        <div className="container max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-display-xl text-on-surface mb-4 drop-shadow-sm tracking-tight text-balance">
            Short Stories
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body-editorial bg-surface-container-high/50 backdrop-blur-xl py-4 px-6 rounded-2xl border border-outline-variant/30 shadow-xl mx-auto inline-block">
            Explore standalone short fiction.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">

      {stories.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <p>No stories published yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story: any) => (
            <Link 
              key={story._id.toString()}
              href={`/stories/${story.slug}`}
              className="group flex flex-col bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {story.coverImage && (
                <div className="aspect-[2/3] relative overflow-hidden bg-surface-variant">
                  <img 
                    src={story.coverImage} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                  <span>{story.genres?.[0] || 'Fiction'}</span>
                  <span className="text-on-surface-variant">{story.readingTime} min read</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-on-surface-variant line-clamp-3 mb-6 flex-1">
                  {story.synopsis}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
                  <span className="text-sm font-medium text-on-surface">
                    {story.author?.name || 'Admin'}
                  </span>
                  <span className="text-sm text-on-surface-variant">
                    {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : 'Draft'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
