import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';
import { hashPassword } from '@/src/lib/auth/password';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/src/lib/auth/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const email: string = (body.email ?? '').trim().toLowerCase();
  const password: string = body.password ?? '';
  const name: string = (body.name ?? '').trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (await User.exists({ email })) {
    return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
  }

  // role is always 'reader' on self-registration — never trust client input here.
  const user = await User.create({
    email,
    password: await hashPassword(password),
    name,
    role: 'reader',
  });

  const token = await signSession({ sub: user._id.toString(), role: user.role });
  const res = NextResponse.json(
    { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
