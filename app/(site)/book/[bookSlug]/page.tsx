import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Book, Chapter, ReadingProgress } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { BookOpen, List, Heart, Eye, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-border">
        {/* Background Blur Effect */}
        {book.coverImage && (
          <div 
            className="absolute inset-0 opacity-10 bg-cover bg-center filter blur-3xl scale-110" 
            style={{ backgroundImage: `url(${book.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
            {/* Book Cover */}
            <div className="shrink-0 w-64 md:w-72 lg:w-80">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border bg-background-tertiary relative group">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-muted">
                    No Cover Image
                  </div>
                )}
                {/* Floating status badge */}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-accent border border-accent/20 shadow-lg">
                  {book.status}
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                  {book.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-foreground-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-background-tertiary overflow-hidden flex items-center justify-center border border-border">
                      {(book.author as any)?.image ? (
                        <img src={(book.author as any).image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-foreground">{(book.author as any)?.name?.[0]}</span>
                      )}
                    </span>
                    <span className="font-medium text-foreground">{(book.author as any)?.name}</span>
                  </span>
                  
                  {(book.category as any)?.name && (
                    <>
                      <span>•</span>
                      <span className="text-accent">{(book.category as any)?.name}</span>
                    </>
                  )}
                  
                  <span>•</span>
                  <span>{new Date(book.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 py-4 border-y border-border/50">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-xl font-bold text-foreground flex items-center gap-2">
                    <List size={18} className="text-accent" />
                    {book.chapterCount}
                  </span>
                  <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">Chapters</span>
                </div>
                
                <div className="w-px h-8 bg-border hidden md:block"></div>
                
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Eye size={18} className="text-accent" />
                    {book.viewCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">Views</span>
                </div>
                
                <div className="w-px h-8 bg-border hidden md:block"></div>
                
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BookOpen size={18} className="text-accent" />
                    {Math.round(book.wordCount / 1000)}k
                  </span>
                  <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">Words</span>
                </div>
              </div>

              {/* CTA & Genres */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {ctaHref ? (
                    <Link 
                      href={ctaHref} 
                      className="btn btn-primary px-8 py-3 text-base font-bold shadow-lg shadow-accent/20 flex items-center gap-2 group"
                    >
                      {ctaText}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button disabled className="btn bg-background-tertiary text-foreground-muted px-8 py-3 text-base font-bold cursor-not-allowed">
                      {ctaText}
                    </button>
                  )}
                  
                  <button className="btn bg-background-secondary border border-border hover:border-accent/50 text-foreground px-6 py-3 flex items-center gap-2">
                    <Heart size={18} />
                    <span>Library</span>
                  </button>
                </div>

                {book.genres && book.genres.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                    {book.genres.map((genre: string) => (
                      <span key={genre} className="px-3 py-1 bg-background-secondary border border-border rounded-full text-xs font-medium text-foreground-muted hover:text-foreground transition-colors">
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
              <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 inline-block">Synopsis</h2>
              <div className="prose prose-wiki max-w-none prose-lg text-foreground-muted">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {book.synopsis}
                </p>
                {book.description && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="whitespace-pre-wrap">{book.description}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-2xl font-bold text-foreground">Table of Contents</h2>
                <span className="text-sm font-semibold text-foreground-muted bg-background-secondary px-3 py-1 rounded-full">
                  {chapters.length} Chapters
                </span>
              </div>
              
              {chapters.length === 0 ? (
                <div className="text-center py-12 bg-background-secondary rounded-lg border border-border">
                  <p className="text-foreground-muted">No chapters have been published yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapters.map((chapter: any) => {
                    const isRead = progress && progress.chapterProgress && (progress.currentChapter?.toString() === chapter._id.toString() || chapter.chapterNumber < chapters.findIndex((c:any) => c._id.toString() === progress.currentChapter?.toString()) + 1);
                    return (
                      <Link 
                        key={chapter._id.toString()} 
                        href={`/book/${bookSlug}/${chapter.slug}`}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-accent/50 hover:bg-background-secondary transition-colors group"
                      >
                        <div className="w-10 h-10 shrink-0 rounded bg-background-secondary border border-border flex items-center justify-center font-bold text-foreground-muted group-hover:text-accent transition-colors">
                          {chapter.chapterNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold truncate transition-colors ${isRead ? 'text-foreground-muted' : 'text-foreground group-hover:text-accent'}`}>
                            {chapter.title}
                          </h3>
                          <div className="text-xs text-foreground-muted mt-1 flex items-center gap-2">
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
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-background-secondary rounded text-xs font-medium text-foreground hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Author */}
            <div className="card p-6">
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">About Author</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-background-tertiary border-2 border-border shrink-0">
                  {(book.author as any)?.image ? (
                    <img src={(book.author as any).image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-foreground">
                      {(book.author as any)?.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-foreground">{(book.author as any)?.name}</div>
                  <div className="text-sm text-accent hover:underline cursor-pointer">View Profile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
