import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Book } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import getSystemAuthor from '@/src/lib/db/getSystemAuthor';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const books = await Book.find().sort({ updatedAt: -1 }).populate('author', 'name').lean();
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
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
    const { title, slug, synopsis, description, coverImage, tags, genres, status, format } = data;

    if (!title || !slug || !synopsis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Check if slug exists
    const existing = await Book.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Auth integration is pending, so use the system author for now
    const author = await getSystemAuthor();

    const book = new Book({
      title,
      slug,
      synopsis,
      description,
      coverImage,
      tags: tags || [],
      genres: genres || [],
      status: status || 'draft',
      format: format || 'novel',
      author: author._id,
      isPublished: status === 'ongoing' || status === 'completed',
    });

    await book.save();

    return NextResponse.json({ success: true, book }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
