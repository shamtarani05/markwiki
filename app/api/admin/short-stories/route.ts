import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { ShortStory } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import getSystemAuthor from '@/src/lib/db/getSystemAuthor';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const stories = await ShortStory.find().sort({ updatedAt: -1 }).populate('author', 'name').lean();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching short stories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, slug, synopsis, blocks, coverImage, tags, genres, status } = data;

    if (!title || !slug || !blocks) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Check if slug exists
    const existing = await ShortStory.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const author = await getSystemAuthor();

    // Calculate reading time and word count roughly
    // Calculate reading time roughly from text blocks
    const textContent = (blocks || [])
      .filter((b: any) => ['heading', 'richText', 'quote'].includes(b.type))
      .map((b: any) => b.props.text || b.props.html?.replace(/<[^>]*>/g, ' ') || '')
      .join(' ');
    
    const wordCount = textContent.split(/\s+/).filter((w: string) => w.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const story = new ShortStory({
      title,
      slug,
      synopsis: synopsis || '',
      blocks,
      coverImage,
      tags: tags || [],
      genres: genres || [],
      status: status || 'draft',
      author: author._id,
      wordCount,
      readingTime,
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    await story.save();

    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (error) {
    console.error('Error creating short story:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
