import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { ShortStory } from '@/src/lib/db/models';
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
    const story = await ShortStory.findById(id).lean();

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error fetching short story:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    await connectDB();
    const story = await ShortStory.findById(id);

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (updates.blocks !== undefined) {
      const textContent = (updates.blocks || [])
        .filter((b: any) => ['heading', 'richText', 'quote'].includes(b.type))
        .map((b: any) => b.props.text || b.props.html?.replace(/<[^>]*>/g, ' ') || '')
        .join(' ');
      
      const wordCount = textContent.split(/\s+/).filter((w: string) => w.length > 0).length;
      updates.wordCount = wordCount;
      updates.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    if (updates.status === 'published' && story.status !== 'published') {
      updates.publishedAt = new Date();
    }

    const updatedStory = await ShortStory.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();

    return NextResponse.json({ success: true, story: updatedStory });
  } catch (error) {
    console.error('Error updating short story:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
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
    
    const result = await ShortStory.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting short story:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
