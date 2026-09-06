import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { verifyPassword } from '@/src/lib/auth/password';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/src/lib/auth/session';

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  await connectDB();
  const email: string = (body.email ?? '').trim().toLowerCase();
  const password: string = body.password ?? '';

  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  if (!user.isActive) {
    return NextResponse.json({ error: 'This account has been deactivated' }, { status: 403 });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = await signSession({ sub: user._id.toString(), role: user.role });
  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
