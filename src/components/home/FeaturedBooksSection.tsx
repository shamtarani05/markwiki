'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  chapters: number;
  genre: string;
}

const featuredBooks: Book[] = [
  {
    id: '1',
    title: 'The Modern Work Mindset',
    author: 'Toni Morrison',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&q=80',
    rating: 4.8,
    chapters: 24,
    genre: 'Self-Help',
  },
  {
    id: '2',
    title: 'Clear Thinking',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&q=80',
    rating: 4.6,
    chapters: 18,
    genre: 'Non-Fiction',
  },
  {
    id: '3',
    title: 'Decisions That Scale',
    author: 'Sarah Mitchell',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop&q=80',
    rating: 4.9,
    chapters: 32,
    genre: 'Business',
  },
  {
    id: '4',
    title: 'Rise, Shine, Repeat',
    author: 'Emma Watson',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop&q=80',
    rating: 4.7,
    chapters: 20,
    genre: 'Motivation',
  },
  {
    id: '5',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop&q=80',
    rating: 4.9,
    chapters: 28,
    genre: 'Fiction',
  },
  {
    id: '6',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop&q=80',
    rating: 4.8,
    chapters: 15,
    genre: 'Self-Help',
  },
  {
    id: '7',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop&q=80',
    rating: 4.7,
    chapters: 22,
    genre: 'Thriller',
  },
  {
    id: '8',
    title: 'Educated',
    author: 'Tara Westover',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop&q=80',
    rating: 4.9,
    chapters: 30,
    genre: 'Memoir',
  },
];

function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.id}`} className="group block">
      <div className="card overflow-hidden">
        {/* Cover */}
        <div className="relative h-[240px] md:h-[300px] overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="btn btn-primary text-sm">Read Now</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-primary font-medium mb-1">{book.genre}</p>
          <h3 className="font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors text-sm leading-tight line-clamp-1">
            {book.title}
          </h3>
          <p className="text-sm text-on-surface-variant mb-3">{book.author}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-[var(--tag-yellow)]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{book.rating}</span>
            </div>
            <span className="text-on-surface-variant">{book.chapters} chapters</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedBooksSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(featuredBooks.length / 4);

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
            <span className="section-subtitle">Top Picks</span>
            <h2 className="section-title">Featured Books</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollToSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="p-2 rounded-full border border-outline-variant/30 hover:border-accent hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
                disabled={currentSlide === totalSlides - 1}
                className="p-2 rounded-full border border-outline-variant/30 hover:border-accent hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link href="/books" className="btn btn-secondary hidden sm:flex">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Books Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6"
        >
          {/* Each slide contains 4 books */}
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full snap-start grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {featuredBooks.slice(slideIndex * 4, slideIndex * 4 + 4).map((book) => (
                <BookCard key={book.id} book={book} />
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
                  ? 'bg-primary w-6'
                  : 'bg-border hover:bg-foreground-muted'
              }`}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/books" className="btn btn-secondary">
            View All Books
          </Link>
        </div>
      </div>
    </section>
  );
}
