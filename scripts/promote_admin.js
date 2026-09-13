const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@example.com' },
    { $set: { role: 'admin' } }
  );
  console.log('Updated:', result.modifiedCount);
  process.exit(0);
});
