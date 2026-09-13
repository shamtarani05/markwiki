import ChapterEditor from '@/src/components/admin/books/ChapterEditor';
import { Book } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';

export default async function NewChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const book = await Book.findById(id).select('format').lean();
  const format = book?.format || 'novel';

  return <ChapterEditor bookId={id} bookFormat={format} />;
}
