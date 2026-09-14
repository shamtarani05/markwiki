import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Category } from '@/src/lib/db/models';

// The 8 topic categories shown on the homepage (src/components/home/CategorySection.tsx)
// today live only as a hardcoded array there — nothing seeds them into the
// Category collection. The Wiki-creation flow needs real Category documents
// to attach a wiki to, so seed them here (idempotent) the first time they're
// requested, rather than requiring a separate manual seed step.
const DEFAULT_CATEGORIES = [
  { name: 'Anime', slug: 'anime', icon: '🎬', description: 'Japanese animation series & films', order: 1 },
  { name: 'Web Novels', slug: 'web-novels', icon: '📖', description: 'Light novels & web fiction', order: 2 },
  { name: 'Webtoons', slug: 'webtoons', icon: '🎨', description: 'Manhwa, Manhua & WebComics', order: 3 },
  { name: 'Video Games', slug: 'games', icon: '🎮', description: 'RPGs, Action, Adventure & more', order: 4 },
  { name: 'Trading Cards', slug: 'tcg', icon: '🃏', description: 'MTG, Pokemon, Yu-Gi-Oh & more', order: 5 },
  { name: 'Movies & TV', slug: 'movies-tv', icon: '🎥', description: 'Films, series & documentaries', order: 6 },
  { name: 'Books & Literature', slug: 'books', icon: '📚', description: 'Fantasy, Sci-Fi & Fiction series', order: 7 },
  { name: 'Tabletop & RPG', slug: 'tabletop', icon: '🎲', description: 'D&D, Warhammer & board games', order: 8 },
];

export async function GET() {
  await connectDB();

  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
  }

  const categories = await Category.find().sort({ order: 1 });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = await Category.create(data);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 400 }
    );
  }
}
