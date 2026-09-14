import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Comment } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const contentType = url.searchParams.get('type') as any;
    const contentId = url.searchParams.get('id');

    if (!contentType || !contentId) {
      return NextResponse.json({ error: 'Missing type or id parameters' }, { status: 400 });
    }

    const comments = await Comment.find({
      contentType,
      contentId,
      isApproved: true,
      isDeleted: false,
    })
      .populate('author', 'name email image')
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSessionUser();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: You must be logged in to comment' }, { status: 401 });
    }

    const { contentType, contentId, content, parent } = await req.json();

    if (!contentType || !contentId || !content) {
      return NextResponse.json({ error: 'Missing required fields (contentType, contentId, content)' }, { status: 400 });
    }

    // Determine auto-approval based on role
    // Admins and editors might bypass moderation filters in a robust setup.
    // For now, auto-approve all comments.
    const isApproved = true;

    const commentData: any = {
      contentType,
      contentId,
      author: session.sub,
      content,
      isApproved,
    };
    
    if (parent) {
      commentData.parent = new mongoose.Types.ObjectId(parent as string);
    }

    const comment = await Comment.create(commentData);

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name email image').lean();

    return NextResponse.json({ success: true, comment: populatedComment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
