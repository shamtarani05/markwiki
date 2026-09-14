import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Reaction } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const contentType = url.searchParams.get('type') as any;
    const contentId = url.searchParams.get('id');

    if (!contentType || !contentId) {
      return NextResponse.json({ error: 'Missing type or id parameters' }, { status: 400 });
    }

    // 1. Fetch total counts
    const [likeCount, dislikeCount] = await Promise.all([
      Reaction.countDocuments({ contentType, contentId, type: 'like' }),
      Reaction.countDocuments({ contentType, contentId, type: 'dislike' })
    ]);

    // 2. Fetch current user's reaction (if logged in)
    let userReaction = null;
    const session = await getSessionUser();
    
    if (session) {
      const reaction = await Reaction.findOne({
        user: session.sub as any,
        contentType,
        contentId
      }).lean();
      
      if (reaction) {
        userReaction = (reaction as any).type;
      }
    }

    return NextResponse.json({ 
      likes: likeCount, 
      dislikes: dislikeCount,
      userReaction 
    });
  } catch (error: any) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSessionUser();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentType, contentId, type } = await req.json();

    if (!contentType || !contentId || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Check if user already reacted to this specific content
    const existingReaction = await Reaction.findOne({
      user: session.sub as any,
      contentType: contentType as any,
      contentId
    });

    let action = 'added';

    if (existingReaction) {
      if ((existingReaction as any).type === type) {
        // Toggle off if clicking the same reaction
        await Reaction.findByIdAndDelete(existingReaction._id);
        action = 'removed';
      } else {
        // Switch reaction type (e.g. like -> dislike)
        (existingReaction as any).type = type;
        await existingReaction.save();
        action = 'changed';
      }
    } else {
      // Create new reaction
      await Reaction.create({
        user: session.sub,
        contentType,
        contentId,
        type
      });
    }

    // Refetch the new counts to send back
    const [likeCount, dislikeCount] = await Promise.all([
      Reaction.countDocuments({ contentType, contentId, type: 'like' }),
      Reaction.countDocuments({ contentType, contentId, type: 'dislike' })
    ]);

    return NextResponse.json({ 
      success: true, 
      action,
      userReaction: action === 'removed' ? null : type,
      likes: likeCount,
      dislikes: dislikeCount
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error toggling reaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
