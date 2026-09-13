import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { User } from '@/src/lib/db/models';

// WARNING: Remove this file after use! This is a one-time admin setup endpoint.
export async function POST() {
  await connectDB();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  const user = await User.findOneAndUpdate(
    { email: adminEmail },
    { role: 'admin' },
    { new: true }
  );
  
  if (!user) {
    return NextResponse.json({ error: 'User not found. Register first at /register' }, { status: 404 });
  }

  return NextResponse.json({ 
    message: `User ${user.email} promoted to admin`,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}
