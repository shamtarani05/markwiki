import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Book, Chapter } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, chapterId: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, chapterId } = await params;
    await connectDB();
    
    const chapter = await Chapter.findOne({ _id: chapterId, book: id }).lean();
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ chapter });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, chapterId: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, chapterId } = await params;
    const updates = await request.json();

    await connectDB();
    
    const chapter = await Chapter.findOne({ _id: chapterId, book: id });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Recalculate word count if content changed
    if ('content' in updates) {
      const oldWordCount = chapter.wordCount;
      const newWordCount = updates.content ? updates.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter((w: string) => w.length > 0).length : 0;
      updates.wordCount = newWordCount;
      
      // Update book's total word count
      const book = await Book.findById(id);
      if (book) {
        book.wordCount = Math.max(0, (book.wordCount - oldWordCount) + newWordCount);
        await book.save();
      }
    }

    // Set publishedAt if transitioning to published
    if (updates.isPublished === true && !chapter.isPublished) {
      updates.publishedAt = new Date();
      const book = await Book.findById(id);
      if (book) {
        book.lastChapterAt = new Date();
        await book.save();
      }
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, { $set: updates }, { new: true }).lean();
    return NextResponse.json({ success: true, chapter: updatedChapter });
  } catch (error) {
    console.error('Error updating chapter:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, chapterId: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, chapterId } = await params;
    await connectDB();
    
    const chapter = await Chapter.findOne({ _id: chapterId, book: id });
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const wordCount = chapter.wordCount;
    await Chapter.findByIdAndDelete(chapterId);

    // Update book stats
    const book = await Book.findById(id);
    if (book) {
      book.chapterCount = Math.max(0, book.chapterCount - 1);
      book.wordCount = Math.max(0, book.wordCount - wordCount);
      await book.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
