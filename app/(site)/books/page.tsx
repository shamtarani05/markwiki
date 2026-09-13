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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background-secondary border-b border-border py-12 mb-10">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Web Novels</h1>
          <p className="text-foreground-muted text-lg max-w-2xl">
            Explore our collection of serialized original fiction, fan-works, and novels. 
            Updated regularly by our community of authors.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl">
        {books.length === 0 ? (
          <div className="text-center py-20 border border-border border-dashed rounded-xl">
            <BookOpen size={48} className="mx-auto text-foreground-muted/50 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No books available yet</h2>
            <p className="text-foreground-muted">Check back later when authors publish their work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book: any) => (
              <div key={book._id.toString()} className="card flex flex-col group hover:border-accent/50 transition-colors h-full">
                <Link href={`/book/${book.slug}`} className="block relative aspect-[2/3] bg-background-tertiary overflow-hidden shrink-0 border-b border-border">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={48} className="text-foreground-muted/30" />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                    {book.status}
                  </div>
                </Link>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-auto">
                    <Link href={`/book/${book.slug}`} className="block">
                      <h3 className="font-bold text-foreground hover:text-accent transition-colors line-clamp-2 mb-1 leading-snug">
                        {book.title}
                      </h3>
                    </Link>
                    <div className="text-xs text-foreground-muted mb-3 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-background-tertiary overflow-hidden border border-border">
                        {(book.author as any)?.image ? (
                          <img src={(book.author as any).image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[8px] font-bold">{(book.author as any)?.name?.[0]}</span>
                        )}
                      </span>
                      <span className="truncate">{(book.author as any)?.name}</span>
                    </div>
                    
                    <p className="text-sm text-foreground-muted line-clamp-3 mb-4 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-border/50 text-xs font-semibold text-foreground-muted">
                    <span className="flex items-center gap-1.5" title="Chapters">
                      <List size={14} className="text-accent" />
                      {book.chapterCount}
                    </span>
                    <span className="flex items-center gap-1.5" title="Views">
                      <Eye size={14} className="text-accent" />
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
