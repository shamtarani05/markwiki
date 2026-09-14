'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  readTime: number;
  genre: string;
  likes: number;
  image: string;
}

const latestStories: Story[] = [
  {
    id: '1',
    title: 'The Last Train Home',
    author: 'Sarah Mitchell',
    excerpt: 'The station was empty, save for the flickering lights that cast long shadows across the platform...',
    readTime: 12,
    genre: 'Drama',
    likes: 234,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop&q=80',
  },
  {
    id: '2',
    title: 'Echoes of Tomorrow',
    author: 'James Chen',
    excerpt: 'In the year 2157, memories could be traded like currency. Elena had spent everything she had...',
    readTime: 18,
    genre: 'Sci-Fi',
    likes: 456,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&q=80',
  },
  {
    id: '3',
    title: 'The Forgotten Garden',
    author: 'Maria Santos',
    excerpt: 'Behind the old manor, hidden by decades of overgrowth, lay a garden that time forgot...',
    readTime: 15,
    genre: 'Fantasy',
    likes: 389,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop&q=80',
  },
  {
    id: '4',
    title: 'Midnight Confession',
    author: 'Alex Turner',
    excerpt: 'The letter arrived at exactly midnight, as it had every night for the past thirty years...',
    readTime: 8,
    genre: 'Mystery',
    likes: 567,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop&q=80',
  },
];

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/story/${story.id}`} className="card group overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative shrink-0 overflow-hidden">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {story.genre}
            </span>
            <span className="text-on-surface-variant text-sm">{story.readTime} min read</span>
          </div>

          <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            {story.title}
          </h3>

          <p className="text-on-surface-variant mb-4 line-clamp-2">
            {story.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              by <span className="text-on-surface">{story.author}</span>
            </p>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{story.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LatestStoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="section-subtitle">Fresh Reads</span>
            <h2 className="section-title">Latest Short Stories</h2>
          </div>
          <Link href="/stories" className="btn btn-secondary hidden sm:flex">
            View All Stories
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {latestStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/stories" className="btn btn-secondary">
            View All Stories
          </Link>
        </div>
      </div>
    </section>
  );
}
