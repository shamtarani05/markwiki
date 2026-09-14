'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Settings, AlignLeft, Search, Bookmark, ChevronLeft } from 'lucide-react';

interface ChapterReaderProps {
  book: {
    _id: string;
    title: string;
    slug: string;
    format: string;
  };
  chapter: {
    _id: string;
    title: string;
    content?: string;
    images?: string[];
    authorNote?: string;
  };
  prevChapter?: { slug: string; title: string };
  nextChapter?: { slug: string; title: string };
  initialProgress?: any;
}

export default function ChapterReader({ book, chapter, prevChapter, nextChapter, initialProgress }: ChapterReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [fontSize, setFontSize] = useState(18); // default font size

  // Track scrolling
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    // Show/hide controls based on scroll direction could be added here
    
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setReadProgress(100);
      return;
    }
    
    const percentage = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
    setReadProgress(percentage);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Save progress periodically
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const saveProgress = async () => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentType: 'book',
            contentId: book._id,
            currentChapter: chapter._id,
            chapterProgress: readProgress,
            percentComplete: readProgress, // Rough estimate
            isCompleted: readProgress > 95, // Mark complete if they reached the bottom
          }),
        });
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    };

    // Save every 10 seconds if progress changed significantly
    const intervalId = setInterval(saveProgress, 10000);
    
    // Save on unmount
    return () => {
      clearInterval(intervalId);
      saveProgress();
    };
  }, [book._id, chapter._id, readProgress]);

  // If there's an initial progress, scroll to it (rough estimate)
  useEffect(() => {
    if (initialProgress?.chapterProgress && initialProgress.chapterProgress > 0 && initialProgress.chapterProgress < 100) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const targetScroll = (initialProgress.chapterProgress / 100) * scrollHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [initialProgress]);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col relative transition-colors duration-300">
      {/* Top Navbar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 transition-transform duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container h-14 flex items-center justify-between">
          <Link href={`/book/${book.slug}`} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <ChevronLeft size={20} />
            <span className="font-medium hidden sm:inline">{book.title}</span>
          </Link>

          <h1 className="text-sm font-bold truncate max-w-[50%] absolute left-1/2 -translate-x-1/2">
            {chapter.title}
          </h1>

          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="hover:text-on-surface transition-colors" title="Settings">
              <Settings size={20} />
            </button>
            <button className="hover:text-on-surface transition-colors" title="Bookmark">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-surface-container-low absolute bottom-0 left-0">
          <div 
            className="h-full bg-primary transition-all duration-150" 
            style={{ width: `${readProgress}%` }}
          />
        </div>
      </div>

      {/* Main Reading Area */}
      <div 
        className="flex-1 w-full max-w-3xl mx-auto px-6 py-24 sm:py-32"
        style={{ fontSize: `${fontSize}px` }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-on-surface leading-tight">
          {chapter.title}
        </h1>

        {book.format === 'webtoon' && chapter.images && chapter.images.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            {chapter.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Page ${i + 1}`} 
                className="w-full h-auto object-cover max-w-3xl block pointer-events-none select-none mb-0" 
                loading={i < 3 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          <div 
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:mb-6 marker:text-primary"
            dangerouslySetInnerHTML={{ __html: chapter.content || '' }}
          />
        )}

        {chapter.authorNote && (
          <div className="mt-16 pt-8 border-t border-outline-variant/30 bg-surface-container-low/50 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Author's Note</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant whitespace-pre-wrap">
              {chapter.authorNote}
            </p>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex items-center justify-between gap-4">
          {prevChapter ? (
            <Link 
              href={`/book/${book.slug}/${prevChapter.slug}`}
              className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-outline-variant/30 hover:border-accent/50 hover:bg-surface-container-low transition-all group"
            >
              <ArrowLeft size={20} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Previous</div>
                <div className="font-medium truncate text-on-surface group-hover:text-primary transition-colors">
                  {prevChapter.title}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextChapter ? (
            <Link 
              href={`/book/${book.slug}/${nextChapter.slug}`}
              className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl border border-outline-variant/30 hover:border-accent/50 hover:bg-surface-container-low transition-all text-right group"
            >
              <div className="min-w-0">
                <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Next</div>
                <div className="font-medium truncate text-on-surface group-hover:text-primary transition-colors">
                  {nextChapter.title}
                </div>
              </div>
              <ArrowRight size={20} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ) : (
            <div className="flex-1 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low text-center text-on-surface-variant font-medium">
              You've reached the end!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
