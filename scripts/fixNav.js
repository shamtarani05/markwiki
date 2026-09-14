const { MongoClient } = require('mongodb');

async function fixNav() {
  const uri = 'mongodb://localhost:27017/wiki-platform';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    const defaultNavigation = {
      main: [
        { label: 'Home', url: '/', order: 0, isExternal: false },
        { label: 'Novels', url: '/books', order: 1, isExternal: false },
        { label: 'Short Stories', url: '/stories', order: 2, isExternal: false },
        { label: 'Blog', url: '/blog', order: 3, isExternal: false },
        { label: 'Bookshelf', url: '/bookshelf', order: 4, isExternal: false },
      ],
      footer: [
        { label: 'Home', url: '/', order: 0, isExternal: false },
        { label: 'Novels', url: '/books', order: 1, isExternal: false },
        { label: 'Short Stories', url: '/stories', order: 2, isExternal: false },
        { label: 'Blog', url: '/blog', order: 3, isExternal: false },
      ],
    };

    const result = await db.collection('siteconfigs').updateOne(
      {},
      { $set: { navigation: defaultNavigation } },
      { upsert: true }
    );
    
    console.log(`Updated SiteConfig: ${result.modifiedCount} document(s) modified.`);
  } finally {
    await client.close();
  }
}

fixNav().catch(console.error);
