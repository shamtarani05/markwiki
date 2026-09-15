import mongoose from 'mongoose';
import connectDB from '../src/lib/db/connection';
import { User, Category, Wiki, Page, Book, Chapter, BlogPost, ShortStory } from '../src/lib/db/models';
import { hashPassword } from '../src/lib/auth/password';
import type { Block } from '../src/lib/blocks/types';

const generateBlocks = (text: string): Block[] => [
  {
    id: new mongoose.Types.ObjectId().toString(),
    type: 'prose',
    props: { content: `<p>${text}</p>` },
  },
];

async function seed() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    Category.deleteMany({}),
    Wiki.deleteMany({}),
    Page.deleteMany({}),
    Book.deleteMany({}),
    Chapter.deleteMany({}),
    BlogPost.deleteMany({}),
    ShortStory.deleteMany({}),
  ]);

  console.log('Seeding Users...');
  const password = await hashPassword('password123');
  
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) {
    admin = await User.create({
      email: 'admin@example.com',
      password,
      name: 'Admin User',
      role: 'admin',
    });
  }

  let editor = await User.findOne({ email: 'editor@example.com' });
  if (!editor) {
    editor = await User.create({
      email: 'editor@example.com',
      password,
      name: 'Editor User',
      role: 'editor',
    });
  }

  let author = await User.findOne({ email: 'author@example.com' });
  if (!author) {
    author = await User.create({
      email: 'author@example.com',
      password,
      name: 'Author User',
      role: 'contributor',
    });
  }

  console.log('Seeding Categories...');
  const animeCategory = await Category.create({
    name: 'Anime',
    slug: 'anime',
    description: 'Japanese animation and related media.',
    isActive: true,
  });

  const webNovelCategory = await Category.create({
    name: 'Web Novels',
    slug: 'web-novels',
    description: 'Serialized fiction published online.',
    isActive: true,
  });

  const gamesCategory = await Category.create({
    name: 'Games',
    slug: 'games',
    description: 'Video games and interactive media.',
    isActive: true,
  });

  console.log('Seeding Wikis & Pages...');
  const wiki1 = await Wiki.create({
    name: 'Solo Leveling',
    slug: 'solo-leveling',
    description: 'A weak hunter awakens as a Player with the ability to grow infinitely.',
    coverImage: 'https://images.unsplash.com/photo-1542451313056-b7c8e626645f?w=800&q=80',
    category: animeCategory._id,
    status: 'approved',
    createdBy: admin._id,
    pageCount: 3,
  });

  await Page.create({
    wiki: wiki1._id,
    pageType: 'overview',
    title: 'Solo Leveling Overview',
    slug: 'overview',
    blocks: generateBlocks('Solo Leveling is a South Korean web novel written by Chugong.'),
    searchText: 'Solo Leveling is a South Korean web novel written by Chugong.',
    author: admin._id,
    lastEditedBy: admin._id,
    status: 'published',
    category: animeCategory._id,
  });

  await Page.create({
    wiki: wiki1._id,
    pageType: 'character',
    title: 'Sung Jinwoo',
    slug: 'sung-jinwoo',
    blocks: generateBlocks('Sung Jinwoo is the main protagonist of Solo Leveling. He was previously known as the Worlds Weakest Hunter.'),
    searchText: 'Sung Jinwoo is the main protagonist of Solo Leveling. He was previously known as the Worlds Weakest Hunter.',
    author: editor._id,
    lastEditedBy: editor._id,
    status: 'published',
    category: animeCategory._id,
  });

  console.log('Seeding Books & Chapters...');
  const book1 = await Book.create({
    title: 'The Shadow Monarchs Return',
    slug: 'shadow-monarchs-return',
    author: author._id,
    category: webNovelCategory._id,
    status: 'ongoing',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
    synopsis: 'A fan-fiction continuing the journey of the Shadow Monarch.',
    tags: ['Action', 'Fantasy'],
    viewCount: 1500,
  });

  await Chapter.create({
    book: book1._id,
    title: 'Chapter 1: The Awakening',
    slug: 'chapter-1',
    chapterNumber: 1,
    content: 'The sky turned red as the gates opened once more...',
    isPublished: true,
  });

  await Chapter.create({
    book: book1._id,
    title: 'Chapter 2: The First Trial',
    slug: 'chapter-2',
    chapterNumber: 2,
    content: 'Standing before the massive doors, he took a deep breath...',
    isPublished: true,
  });

  console.log('Seeding Short Stories...');
  await ShortStory.create({
    title: 'The Last Stand at Caelid',
    slug: 'last-stand-at-caelid',
    author: author._id,
    category: gamesCategory._id,
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80',
    synopsis: 'A tale of bravery in the scarlet rot.',
    blocks: generateBlocks('The sky was painted with the color of rust and blood...'),
    searchText: 'The sky was painted with the color of rust and blood...',
    tags: ['Elden Ring', 'Dark Fantasy'],
    viewCount: 500,
  });

  console.log('Seeding Blog Posts...');
  await BlogPost.create({
    title: 'Top 10 Anime of 2026',
    slug: 'top-10-anime-2026',
    author: editor._id,
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    excerpt: 'Our definitive list of the best anime this year.',
    content: '1. Solo Leveling Season 3...',
    tags: ['Anime', 'Review'],
  });

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
