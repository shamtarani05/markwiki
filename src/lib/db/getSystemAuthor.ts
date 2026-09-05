import crypto from 'crypto';
import connectDB from './connection';
import { User } from './models';

// Placeholder author until admin auth (NextAuth — still "Pending" per
// PROGRESS.md) is wired up. Finds-or-creates a single system admin user so
// Page.author (required) has something real to reference; this account has
// no usable password and is not a real login. Swap every call site of this
// for the authenticated session's user id once auth lands.
export async function getSystemAuthorId(): Promise<string> {
  await connectDB();

  const existing = await User.findOne({ email: 'system@internal.local' });
  if (existing) return existing._id.toString();

  const created = await User.create({
    email: 'system@internal.local',
    password: crypto.randomBytes(32).toString('hex'),
    name: 'System',
    role: 'admin',
    isActive: true,
    isVerified: true,
  });
  return created._id.toString();
}
