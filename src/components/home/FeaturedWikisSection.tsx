'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

interface Wiki {
  id: string;
  slug: string;
  title: string;
  franchise: string;
  cover: string;
  category: string;
  pages: number;
  contributors: number;
  trending: boolean;
}

const featuredWikis: Wiki[] = [
  {
    id: '1',
    slug: 'solo-leveling',
    title: 'Solo Leveling',
    franchise: 'Manhwa / Anime',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop&q=80',
    category: 'Webtoon',
    pages: 1247,
    contributors: 342,
    trending: true,
  },
  {
    id: '2',
    slug: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    franchise: 'Manga / Anime',
    cover: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop&q=80',
    category: 'Anime',
    pages: 2156,
    contributors: 567,
    trending: true,
  },
  {
    id: '3',
    slug: 'elden-ring',
    title: 'Elden Ring',
    franchise: 'FromSoftware',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop&q=80',
    category: 'Game',
    pages: 3421,
    contributors: 892,
    trending: false,
  },
  {
    id: '4',
    slug: 'lord-of-the-mysteries',
    title: 'Lord of the Mysteries',
    franchise: 'Web Novel',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop&q=80',
    category: 'Web Novel',
    pages: 1876,
    contributors: 234,
    trending: true,
  },
  {
    id: '5',
    slug: 'one-piece',
    title: 'One Piece',
    franchise: 'Manga / Anime',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&q=80',
    category: 'Anime',
    pages: 8934,
    contributors: 2341,
    trending: false,
  },
  {
    id: '6',
    slug: 'genshin-impact',
    title: 'Genshin Impact',
    franchise: 'miHoYo',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&q=80',
    category: 'Game',
    pages: 4521,
    contributors: 1234,
    trending: true,
  },
  {
    id: '7',
    slug: 'demon-slayer',
    title: 'Demon Slayer',
    franchise: 'Manga / Anime',
    cover: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=600&fit=crop&q=80',
    category: 'Anime',
    pages: 1567,
    contributors: 456,
    trending: false,
  },
  {
    id: '8',
    slug: 'the-beginning-after-the-end',
    title: 'The Beginning After The End',
    franchise: 'Webtoon',
    cover: 'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=400&h=600&fit=crop&q=80',
    category: 'Webtoon',
    pages: 987,
    contributors: 189,
    trending: true,
  },
];

const categoryColors: Record<string, string> = {
  'Anime': 'badge-red',
  'Webtoon': 'badge-purple',
  'Game': 'badge-green',
  'Web Novel': 'badge-blue',
};

function WikiCard({ wiki }: { wiki: Wiki }) {
  return (
    <Link href={`/wiki/${wiki.slug}`} className="group block">
      <div className="card overflow-hidden">
        {/* Cover */}
        <div className="relative h-[240px] md:h-[280px] overflow-hidden">
          <img
            src={wiki.cover}
            alt={wiki.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Trending Badge */}
          {wiki.trending && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-white text-xs font-bold rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Trending
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="btn btn-primary text-sm">Explore Wiki</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[wiki.category] || 'badge-gray'}`}>
              {wiki.category}
            </span>
          </div>
          <h3 className="font-bold text-foreground mb-1 group-hover:text-accent transition-colors text-base leading-tight line-clamp-1">
            {wiki.title}
          </h3>
          <p className="text-sm text-foreground-muted mb-3">{wiki.franchise}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-foreground-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{wiki.pages.toLocaleString()} pages</span>
            </div>
            <div className="flex items-center gap-1 text-foreground-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{wiki.contributors}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedWikisSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(featuredWikis.length / 4);

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
      setCurrentSlide(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const newSlide = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="section-subtitle">Most Popular</span>
            <h2 className="section-title">Featured Wikis</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollToSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="p-2 rounded-full border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="p-2 rounded-full border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link href="/wikis" className="btn btn-secondary hidden sm:flex">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Wikis Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6"
        >
          {/* Each slide contains 4 wikis */}
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full snap-start grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {featuredWikis.slice(slideIndex * 4, slideIndex * 4 + 4).map((wiki) => (
                <WikiCard key={wiki.id} wiki={wiki} />
              ))}
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-accent w-6'
                  : 'bg-border hover:bg-foreground-muted'
              }`}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/wikis" className="btn btn-secondary">
            View All Wikis
          </Link>
        </div>
      </div>
    </section>
  );
}
