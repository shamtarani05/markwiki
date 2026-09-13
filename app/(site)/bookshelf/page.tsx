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
  
  const currentChapters = await Chapter.find({ _id: { $in: chapterIds } }).lean();
  const chapterMap = currentChapters.reduce((acc: any, chap: any) => {
    acc[chap._id.toString()] = chap;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Library size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Bookshelf</h1>
            <p className="text-foreground-muted mt-1">Continue where you left off</p>
          </div>
        </div>

        {progressRecords.length === 0 ? (
          <div className="card p-12 text-center border-dashed">
            <BookOpen size={48} className="mx-auto text-foreground-muted/50 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Your bookshelf is empty</h2>
            <p className="text-foreground-muted max-w-md mx-auto mb-6">
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
                  <div className="p-4 flex gap-4 border-b border-border">
                    <div className="w-20 h-28 rounded-md overflow-hidden bg-background-tertiary shrink-0 relative shadow-sm">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={24} className="text-foreground-muted/50" />
                        </div>
                      )}
                      
                      {progress.isCompleted && (
                        <div className="absolute top-1 right-1 bg-green-500 text-background rounded-full p-1 shadow">
                          <CheckCircle size={12} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                      <Link href={`/book/${book.slug}`} className="font-bold text-foreground hover:text-accent transition-colors line-clamp-2 mb-1">
                        {book.title}
                      </Link>
                      <div className="text-xs text-foreground-muted mb-3 truncate">
                        by {(book.author as any)?.name || 'Unknown'}
                      </div>
                      
                      {currentChapter && (
                        <div className="text-xs font-medium text-foreground bg-background-secondary px-2 py-1 rounded border border-border truncate">
                          Ch {currentChapter.chapterNumber}: {currentChapter.title}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-background-secondary/30 mt-auto flex items-center justify-between">
                    <div className="flex flex-col gap-1 w-full max-w-[50%]">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-foreground-muted flex items-center justify-between">
                        <span>Progress</span>
                        <span>{Math.round(progress.percentComplete || 0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-500"
                          style={{ width: `${progress.percentComplete || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <Link 
                      href={currentChapter ? `/book/${book.slug}/${currentChapter.slug}` : `/book/${book.slug}`}
                      className="text-sm font-bold text-accent hover:underline flex items-center gap-1"
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
