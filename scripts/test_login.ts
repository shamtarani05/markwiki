import connectDB from '../src/lib/db/connection';
import { User } from '../src/lib/db/models';
import { verifyPassword } from '../src/lib/auth/password';

async function test() {
  await connectDB();
  const user = await User.findOne({ email: 'admin@example.com' });
  console.log('User found:', !!user);
  if (user) {
    console.log('Has password field:', !!user.password);
    console.log('Password length:', user.password?.length);
    const match = await verifyPassword('admin', user.password);
    console.log('verifyPassword result:', match);
  } else {
    console.log('No user found!');
  }
  process.exit(0);
}

test();
