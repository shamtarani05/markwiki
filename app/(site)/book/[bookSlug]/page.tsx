import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Book, Chapter, ReadingProgress } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { BookOpen, List, Heart, Eye, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import LibraryButton from '@/src/components/book/LibraryButton';

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug } = await params;
  await connectDB();
  const book = await Book.findOne({ slug: bookSlug, isPublished: true }).lean();
  if (!book) return {};

  const description = book.synopsis || `Read ${book.title} on MarcWiki.`;
  
  return {
    title: `${book.title} | MarcWiki`,
    description,
    openGraph: {
      title: book.title,
      description,
      type: 'book',
      images: book.coverImage ? [book.coverImage] : undefined,
    },
  };
}

export default async function BookLandingPage({ params }: Props) {
  const { bookSlug } = await params;
  await connectDB();

  // Find book and populate author
  const book = await Book.findOne({ slug: bookSlug, isPublished: true })
    .populate('author', 'name image')
    .populate('category', 'name')
    .lean();

  if (!book) {
    notFound();
  }

  // Get all published chapters
  const chapters = await Chapter.find({ book: book._id, isPublished: true })
    .sort({ chapterNumber: 1 })
    .lean();

  // Get reading progress for current user
  const session = await getSessionUser();
  let progress = null;
  if (session) {
    progress = await ReadingProgress.findOne({
      user: session.sub,
      contentType: 'book',
      contentId: book._id,
    }).lean();
  }

  // Determine what button to show
  let ctaHref = '';
  let ctaText = '';
  
  if (!chapters.length) {
    ctaText = 'Coming Soon';
  } else if (!progress) {
    ctaText = 'Start Reading';
    ctaHref = `/book/${bookSlug}/${chapters[0].slug}`;
  } else if (progress.currentChapter) {
    const currentChapterDoc = chapters.find(c => c._id.toString() === progress.currentChapter?.toString());
    if (currentChapterDoc) {
      ctaText = 'Continue Reading';
      ctaHref = `/book/${bookSlug}/${currentChapterDoc.slug}`;
    } else {
      ctaText = 'Start Reading';
      ctaHref = `/book/${bookSlug}/${chapters[0].slug}`;
    }
  } else {
    ctaText = 'Start Reading';
    ctaHref = `/book/${bookSlug}/${chapters[0].slug}`;
  }

  // Increment view count
  void Book.updateOne({ _id: book._id }, { $inc: { viewCount: 1 } }).exec();

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Dynamic Hero Section with Glassmorphism and Gradients */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-outline-variant/30">
        
        {/* Rich Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-container-lowest to-tertiary/10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent blur-3xl opacity-50 -z-10 rounded-full mix-blend-screen transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl opacity-50 -z-10 rounded-full mix-blend-screen transform -translate-x-1/4 translate-y-1/4" />

        {/* Background Blur Effect using Cover Image */}
        {book.coverImage && (
          <div 
            className="absolute inset-0 opacity-[0.08] bg-cover bg-center filter blur-3xl scale-125 saturate-150" 
            style={{ backgroundImage: `url(${book.coverImage})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center md:items-start">
            
            {/* Book Cover with Glassmorphism Float */}
            <div className="shrink-0 w-64 md:w-72 lg:w-80 group perspective-1000">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-outline-variant/30 bg-surface-variant relative transform transition-all duration-700 hover:rotate-y-6 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 z-10 pointer-events-none" />
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant bg-gradient-to-br from-surface-container to-surface-container-high">
                    <BookOpen size={48} className="mb-4 opacity-50" />
                    <span className="font-headline-sm opacity-50">No Cover</span>
                  </div>
                )}
                {/* Floating status badge */}
                <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 shadow-lg z-20">
                  {book.status}
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 text-center md:text-left space-y-6 mt-4 md:mt-8">
              <div>
                <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-on-surface via-primary to-on-surface mb-6 leading-tight drop-shadow-sm">
                  {book.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-on-surface-variant font-medium bg-surface-container-low/50 backdrop-blur-md py-2 px-4 rounded-full border border-outline-variant/30 inline-flex shadow-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center border border-outline-variant/30 shadow-inner">
                      {(book.author as any)?.image ? (
                        <img src={(book.author as any).image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-on-surface">{(book.author as any)?.name?.[0]}</span>
                      )}
                    </span>
                    <span className="text-on-surface">{(book.author as any)?.name}</span>
                  </span>
                  
                  {(book.category as any)?.name && (
                    <>
                      <span className="opacity-50">•</span>
                      <span className="text-primary font-bold">{(book.category as any)?.name}</span>
                    </>
                  )}
                  
                  <span className="opacity-50">•</span>
                  <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 py-6 border-y border-outline-variant/20">
                <div className="flex flex-col items-center md:items-start group">
                  <span className="text-2xl font-bold text-on-surface flex items-center gap-2">
                    <List size={22} className="text-primary group-hover:scale-110 transition-transform" />
                    {book.chapterCount}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold mt-1 opacity-70">Chapters</span>
                </div>
                
                <div className="w-px h-10 bg-outline-variant/30 hidden md:block"></div>
                
                <div className="flex flex-col items-center md:items-start group">
                  <span className="text-2xl font-bold text-on-surface flex items-center gap-2">
                    <Eye size={22} className="text-secondary group-hover:scale-110 transition-transform" />
                    {book.viewCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold mt-1 opacity-70">Views</span>
                </div>
                
                <div className="w-px h-10 bg-outline-variant/30 hidden md:block"></div>
                
                <div className="flex flex-col items-center md:items-start group">
                  <span className="text-2xl font-bold text-on-surface flex items-center gap-2">
                    <BookOpen size={22} className="text-tertiary group-hover:scale-110 transition-transform" />
                    {Math.round(book.wordCount / 1000)}k
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold mt-1 opacity-70">Words</span>
                </div>
              </div>

              {/* CTA & Genres */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {ctaHref ? (
                    <Link 
                      href={ctaHref} 
                      className="btn btn-primary px-8 py-3 text-base font-bold shadow-[0_0_20px_rgba(var(--md-sys-color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--md-sys-color-primary),0.5)] flex items-center gap-2 group transition-all"
                    >
                      {ctaText}
                      <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  ) : (
                    <button disabled className="btn bg-surface-variant text-on-surface-variant px-8 py-3 text-base font-bold cursor-not-allowed border border-outline-variant/20">
                      {ctaText}
                    </button>
                  )}
                  
                  <LibraryButton 
                    contentType="book" 
                    contentId={book._id.toString()} 
                    initialInLibrary={progress?.inLibrary || false} 
                  />
                </div>

                {book.genres && book.genres.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                    {book.genres.map((genre: string) => (
                      <span key={genre} className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded-full text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (Synopsis & Tags) */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface border-b border-outline-variant/30 pb-2 inline-block">Synopsis</h2>
              <div className="prose prose-wiki max-w-none prose-lg text-on-surface-variant">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {book.synopsis}
                </p>
                {book.description && (
                  <div className="mt-6 pt-6 border-t border-outline-variant/30/50">
                    <p className="whitespace-pre-wrap">{book.description}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                <h2 className="text-2xl font-bold text-on-surface">Table of Contents</h2>
                <span className="text-sm font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
                  {chapters.length} Chapters
                </span>
              </div>
              
              {chapters.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <p className="text-on-surface-variant">No chapters have been published yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapters.map((chapter: any) => {
                    const isRead = progress && progress.chapterProgress && (progress.currentChapter?.toString() === chapter._id.toString() || chapter.chapterNumber < chapters.findIndex((c:any) => c._id.toString() === progress.currentChapter?.toString()) + 1);
                    return (
                      <Link 
                        key={chapter._id.toString()} 
                        href={`/book/${bookSlug}/${chapter.slug}`}
                        className="flex items-center gap-4 p-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest hover:border-accent/50 hover:bg-surface-container-low transition-colors group"
                      >
                        <div className="w-10 h-10 shrink-0 rounded bg-surface-container-low border border-outline-variant/30 flex items-center justify-center font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                          {chapter.chapterNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold truncate transition-colors ${isRead ? 'text-on-surface-variant' : 'text-on-surface group-hover:text-primary'}`}>
                            {chapter.title}
                          </h3>
                          <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
                            <span>{new Date(chapter.publishedAt || chapter.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Tags Box */}
            {book.tags && book.tags.length > 0 && (
              <div className="card p-6 border-t-2 border-t-accent">
                <h3 className="font-bold text-on-surface mb-4 uppercase tracking-wider text-sm">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-surface-container-low rounded text-xs font-medium text-on-surface hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Author */}
            <div className="card p-6">
              <h3 className="font-bold text-on-surface mb-4 uppercase tracking-wider text-sm">About Author</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant border-2 border-outline-variant/30 shrink-0">
                  {(book.author as any)?.image ? (
                    <img src={(book.author as any).image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-on-surface">
                      {(book.author as any)?.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-on-surface">{(book.author as any)?.name}</div>
                  <div className="text-sm text-primary hover:underline cursor-pointer">View Profile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
