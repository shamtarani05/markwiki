import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Book, ReadingProgress, Chapter } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { Library, BookOpen, Clock, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookshelf | MarcWiki',
  description: 'Track your reading progress.',
};

export default async function BookshelfPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect('/login?callbackUrl=/bookshelf');
  }

  await connectDB();

  const progressRecords = await ReadingProgress.find({ user: session.sub, contentType: 'book' })
    .sort({ lastReadAt: -1 })
    .lean();

  const bookIds = progressRecords.map(p => p.contentId);
  const books = await Book.find({ _id: { $in: bookIds } })
    .populate('author', 'name')
    .lean();

  // Create a map for quick lookup
  const bookMap = books.reduce((acc: any, book: any) => {
    acc[book._id.toString()] = book;
    return acc;
  }, {});

  // Get current chapters for those that have one
  const chapterIds = progressRecords
    .filter(p => p.currentChapter)
    .map(p => p.currentChapter);
  
  const currentChapters = await Chapter.find({ _id: { $in: chapterIds as any[] } }).lean();
  const chapterMap = currentChapters.reduce((acc: any, chap: any) => {
    acc[chap._id.toString()] = chap;
    return acc;
  }, {});

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
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high/50 backdrop-blur-xl border border-outline-variant/30 shadow-xl flex items-center justify-center text-primary shrink-0">
              <Library size={32} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-display-xl text-on-surface drop-shadow-sm tracking-tight text-balance">
                My Bookshelf
              </h1>
              <p className="text-on-surface-variant text-lg mt-2 font-body-editorial bg-surface-container-high/50 backdrop-blur-xl py-2 px-4 rounded-xl border border-outline-variant/30 shadow-sm inline-block">
                Continue where you left off
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl">

        {progressRecords.length === 0 ? (
          <div className="card p-12 text-center border-dashed">
            <BookOpen size={48} className="mx-auto text-on-surface-variant/50 mb-4" />
            <h2 className="text-xl font-bold text-on-surface mb-2">Your bookshelf is empty</h2>
            <p className="text-on-surface-variant max-w-md mx-auto mb-6">
              You haven't started reading any books yet. Explore our library to find your next adventure.
            </p>
            <Link href="/" className="btn btn-primary px-6 py-2 inline-flex">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressRecords.map((progress: any) => {
              const book = bookMap[progress.contentId.toString()];
              if (!book) return null; // Book might have been deleted
              
              const currentChapter = progress.currentChapter ? chapterMap[progress.currentChapter.toString()] : null;

              return (
                <div key={progress._id.toString()} className="card flex flex-col group hover:border-accent/50 transition-colors">
                  <div className="p-4 flex gap-4 border-b border-outline-variant/30">
                    <div className="w-20 h-28 rounded-md overflow-hidden bg-surface-variant shrink-0 relative shadow-sm">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={24} className="text-on-surface-variant/50" />
                        </div>
                      )}
                      
                      {progress.isCompleted && (
                        <div className="absolute top-1 right-1 bg-green-500 text-background rounded-full p-1 shadow">
                          <CheckCircle size={12} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                      <Link href={`/book/${book.slug}`} className="font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 mb-1">
                        {book.title}
                      </Link>
                      <div className="text-xs text-on-surface-variant mb-3 truncate">
                        by {(book.author as any)?.name || 'Unknown'}
                      </div>
                      
                      {currentChapter && (
                        <div className="text-xs font-medium text-on-surface bg-surface-container-low px-2 py-1 rounded border border-outline-variant/30 truncate">
                          Ch {currentChapter.chapterNumber}: {currentChapter.title}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-surface-container-low/30 mt-auto flex items-center justify-between">
                    <div className="flex flex-col gap-1 w-full max-w-[50%]">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant flex items-center justify-between">
                        <span>Progress</span>
                        <span>{Math.round(progress.percentComplete || 0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${progress.percentComplete || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <Link 
                      href={currentChapter ? `/book/${book.slug}/${currentChapter.slug}` : `/book/${book.slug}`}
                      className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      {progress.isCompleted ? 'Read Again' : 'Continue'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
