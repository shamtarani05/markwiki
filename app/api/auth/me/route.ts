import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(session.sub).select('name email role avatar preferences');
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, preferences: user.preferences },
  });
}
