import Link from 'next/link';
import { Book } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import { BookOpen, List, Eye } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Novels | MarcWiki',
  description: 'Browse and read serialized novels on MarcWiki.',
};

export default async function BooksDirectoryPage() {
  await connectDB();
  
  // Find all published books
  const books = await Book.find({ isPublished: true })
    .populate('author', 'name image')
    .sort({ lastChapterAt: -1, updatedAt: -1 })
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

        <div className="container max-w-6xl relative z-10">
          <h1 className="text-4xl lg:text-5xl font-display-xl text-on-surface mb-4 drop-shadow-sm tracking-tight text-balance">
            Web Novels
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body-editorial bg-surface-container-high/50 backdrop-blur-xl py-4 px-6 rounded-2xl border border-outline-variant/30 shadow-xl">
            Explore our collection of serialized original fiction, fan-works, and novels. 
            Updated regularly by our community of authors.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl">
        {books.length === 0 ? (
          <div className="text-center py-20 border border-outline-variant/30 border-dashed rounded-xl">
            <BookOpen size={48} className="mx-auto text-on-surface-variant/50 mb-4" />
            <h2 className="text-xl font-bold text-on-surface mb-2">No books available yet</h2>
            <p className="text-on-surface-variant">Check back later when authors publish their work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book: any) => (
              <div key={book._id.toString()} className="card flex flex-col group hover:border-accent/50 transition-colors h-full">
                <Link href={`/book/${book.slug}`} className="block relative aspect-[2/3] bg-surface-variant overflow-hidden shrink-0 border-b border-outline-variant/30">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={48} className="text-on-surface-variant/30" />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-primary border border-accent/20">
                    {book.status}
                  </div>
                </Link>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-auto">
                    <Link href={`/book/${book.slug}`} className="block">
                      <h3 className="font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 mb-1 leading-snug">
                        {book.title}
                      </h3>
                    </Link>
                    <div className="text-xs text-on-surface-variant mb-3 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30">
                        {(book.author as any)?.image ? (
                          <img src={(book.author as any).image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[8px] font-bold">{(book.author as any)?.name?.[0]}</span>
                        )}
                      </span>
                      <span className="truncate">{(book.author as any)?.name}</span>
                    </div>
                    
                    <p className="text-sm text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-outline-variant/30/50 text-xs font-semibold text-on-surface-variant">
                    <span className="flex items-center gap-1.5" title="Chapters">
                      <List size={14} className="text-primary" />
                      {book.chapterCount}
                    </span>
                    <span className="flex items-center gap-1.5" title="Views">
                      <Eye size={14} className="text-primary" />
                      {book.viewCount > 1000 ? `${(book.viewCount / 1000).toFixed(1)}k` : book.viewCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
