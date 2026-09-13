import { notFound } from 'next/navigation';
import { Book, Chapter, ReadingProgress } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import ChapterReader from '@/src/components/book/ChapterReader';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ bookSlug: string; chapterSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug, chapterSlug } = await params;
  await connectDB();
  
  const book = await Book.findOne({ slug: bookSlug, isPublished: true }).lean();
  if (!book) return {};

  const chapter = await Chapter.findOne({ book: book._id, slug: chapterSlug, isPublished: true }).lean();
  if (!chapter) return {};

  return {
    title: `${chapter.title} | ${book.title} | MarcWiki`,
    description: `Read ${chapter.title} of ${book.title}.`,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { bookSlug, chapterSlug } = await params;
  await connectDB();

  const book = await Book.findOne({ slug: bookSlug, isPublished: true }).lean();
  if (!book) notFound();

  const chapters = await Chapter.find({ book: book._id, isPublished: true })
    .sort({ chapterNumber: 1 })
    .lean();

  const currentIndex = chapters.findIndex(c => c.slug === chapterSlug);
  if (currentIndex === -1) notFound();

  const chapter = chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined;

  // Track view on chapter
  void Chapter.updateOne({ _id: chapter._id }, { $inc: { viewCount: 1 } }).exec();

  // Get initial progress if logged in
  const session = await getSessionUser();
  let progress = null;
  if (session) {
    progress = await ReadingProgress.findOne({
      user: session.sub,
      contentType: 'book',
      contentId: book._id,
    }).lean();
    
    // Set current chapter
    void ReadingProgress.updateOne(
      { user: session.sub, contentType: 'book', contentId: book._id },
      { $set: { currentChapter: chapter._id, lastReadAt: new Date() } }
    ).exec();
  }

  return (
    <ChapterReader
      book={{ _id: book._id.toString(), title: book.title, slug: book.slug, format: book.format || 'novel' }}
      chapter={{
        _id: chapter._id.toString(),
        title: chapter.title,
        content: chapter.content,
        images: chapter.images,
        authorNote: chapter.authorNote,
      }}
      prevChapter={prevChapter ? { slug: prevChapter.slug, title: prevChapter.title } : undefined}
      nextChapter={nextChapter ? { slug: nextChapter.slug, title: nextChapter.title } : undefined}
      initialProgress={progress?.currentChapter?.toString() === chapter._id.toString() ? progress : undefined}
    />
  );
}
