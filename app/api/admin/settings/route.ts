import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const userId = session.sub;
  const user = await User.findById(userId).select('name email preferences');
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const userId = session.sub;
  const body = await req.json();

  const update: Record<string, unknown> = {};
  if (body.editorMode === 'block' || body.editorMode === 'text') {
    update['preferences.editorMode'] = body.editorMode;
  }

  const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('name email preferences');
  return NextResponse.json({ user });
}
