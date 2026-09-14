import { User } from './models';

export default async function getSystemAuthor() {
  const author = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
  
  if (!author) {
    throw new Error('System author (admin user) not found. Please run the seed script.');
  }

  return author;
}
