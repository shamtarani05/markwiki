import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { getSystemAuthorId } from '@/src/lib/db/getSystemAuthor';

// TODO(auth): "current admin" is the placeholder system user until NextAuth
// is wired (PROGRESS.md — "Auth: TBD"). Once real sessions exist, resolve
// the user from the session instead of getSystemAuthorId().

export async function GET() {
  await connectDB();
  const userId = await getSystemAuthorId();
  const user = await User.findById(userId).select('name email preferences');
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const userId = await getSystemAuthorId();
  const body = await req.json();

  const update: Record<string, unknown> = {};
  if (body.editorMode === 'block' || body.editorMode === 'text') {
    update['preferences.editorMode'] = body.editorMode;
  }

  const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('name email preferences');
  return NextResponse.json({ user });
}
