import mongoose from 'mongoose';
import connectDB from '../src/lib/db/connection';
import { User } from '../src/lib/db/models';
import { hashPassword } from '../src/lib/auth/password';

async function seed() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = 'admin';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists');
    process.exit(0);
  }
  const hashedPassword = await hashPassword(password);
  await User.create({
    email,
    password: hashedPassword,
    name: 'Admin',
    role: 'admin',
  });
  console.log(`Admin user created! Email: ${email} | Password: ${password}`);
  process.exit(0);
}

seed().catch(console.error);
