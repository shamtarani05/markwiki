import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { ReadingProgress } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSessionUser();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentType, contentId } = await req.json();

    if (!contentType || !contentId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Find or create ReadingProgress for this content
    let progress = await ReadingProgress.findOne({
      user: session.sub as any,
      contentType: contentType as any,
      contentId,
    });

    if (progress) {
      // Toggle inLibrary state
      progress.inLibrary = !progress.inLibrary;
      await progress.save();
    } else {
      // Create new progress with inLibrary = true
      progress = await ReadingProgress.create({
        user: session.sub,
        contentType,
        contentId,
        inLibrary: true,
      });
    }

    return NextResponse.json({ success: true, inLibrary: progress.inLibrary });
  } catch (error: any) {
    console.error('Error toggling library:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
