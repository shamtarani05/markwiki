import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { ReadingProgress, Book } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { contentType, contentId, currentChapter, chapterProgress, scrollPosition, percentComplete, isCompleted } = data;

    if (!contentType || !contentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const updateData: any = {
      lastReadAt: new Date(),
    };

    if (currentChapter) updateData.currentChapter = currentChapter;
    if (chapterProgress !== undefined) updateData.chapterProgress = chapterProgress;
    if (scrollPosition !== undefined) updateData.scrollPosition = scrollPosition;
    if (percentComplete !== undefined) updateData.percentComplete = percentComplete;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const progress = await ReadingProgress.findOneAndUpdate(
      {
        user: session.sub,
        contentType,
        contentId,
      },
      {
        $set: updateData,
        $setOnInsert: { startedAt: new Date() },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error saving reading progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
