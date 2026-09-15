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
              <Link key={book._id.toString()} href={`/book/${book.slug}`} className="group p-6 rounded-xl bg-surface-container-low shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col h-full backdrop-blur-sm">
                {book.coverImage && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {book.status && (
                      <div className="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-primary border border-accent/20">
                        {book.status}
                      </div>
                    )}
                  </div>
                )}
                <h2 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{book.title}</h2>
                {book.synopsis && <p className="text-on-surface-variant mt-2 line-clamp-2">{book.synopsis}</p>}
                
                <div className="mt-4 mb-2 flex items-center gap-2 text-xs text-on-surface-variant">
                  {(book.author as any)?.image ? (
                    <img src={(book.author as any).image} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-bold">{(book.author as any)?.name?.[0]}</span>
                  )}
                  <span>{(book.author as any)?.name}</span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-sm text-outline">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5" title="Chapters">
                      <List size={14} className="text-primary" />
                      {book.chapterCount}
                    </span>
                    <span className="flex items-center gap-1.5" title="Views">
                      <Eye size={14} className="text-primary" />
                      {book.viewCount > 1000 ? `${(book.viewCount / 1000).toFixed(1)}k` : book.viewCount}
                    </span>
                  </div>
                  <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
