import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { BlogPost } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import getSystemAuthor from '@/src/lib/db/getSystemAuthor';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).populate('author', 'name').lean();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
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
    const { title, slug, excerpt, content, coverImage, tags, category, status } = data;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Check if slug exists
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const author = await getSystemAuthor();

    // Calculate reading time roughly
    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter((w: string) => w.length > 0).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const post = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tags || [],
      category: category || null,
      status: status || 'draft',
      author: author._id,
      readingTime,
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    await post.save();

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
