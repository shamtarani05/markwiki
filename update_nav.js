const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wiki-platform');
  const db = mongoose.connection.db;
  await db.collection('siteconfigs').updateOne({}, {
    $set: {
      'navigation.main': [
        { label: 'Home', url: '/', order: 0, isExternal: false },
        { label: 'Wikis', url: '/wikis', order: 1, isExternal: false },
        { label: 'Novels', url: '/books', order: 2, isExternal: false },
        { label: 'Short Stories', url: '/stories', order: 3, isExternal: false },
        { label: 'Blog', url: '/blog', order: 4, isExternal: false },
        { label: 'Bookshelf', url: '/bookshelf', order: 5, isExternal: false }
      ]
    }
  });
  console.log('Updated DB navigation');
  process.exit(0);
}
run();
