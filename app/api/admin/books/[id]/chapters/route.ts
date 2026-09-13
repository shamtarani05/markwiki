import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Book, Chapter } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    const chapters = await Chapter.find({ book: id }).sort({ chapterNumber: 1 }).lean();
    return NextResponse.json({ chapters });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { title, slug, content, images, chapterNumber, authorNote, isPublished } = data;

    if (!title || !slug || chapterNumber === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Check if slug exists in this book
    const existing = await Chapter.findOne({ book: id, slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists for this book' }, { status: 400 });
    }

    // Calculate word count roughly (for text chapters)
    const wordCount = content ? content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter((w: string) => w.length > 0).length : 0;

    const chapter = new Chapter({
      book: id,
      title,
      slug,
      content,
      images,
      chapterNumber,
      wordCount,
      authorNote,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : undefined,
    });

    await chapter.save();

    // Update book chapter count and word count
    book.chapterCount += 1;
    book.wordCount += wordCount;
    if (isPublished) {
      book.lastChapterAt = new Date();
    }
    await book.save();

    return NextResponse.json({ success: true, chapter }, { status: 201 });
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
