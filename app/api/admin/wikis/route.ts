import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { slugify } from '@/src/lib/slugify';

export async function GET() {
  await connectDB();
  const wikis = await Wiki.find().populate('category', 'name slug').sort({ name: 1 });
  return NextResponse.json({ wikis });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const name: string = body.name?.trim();
  const categoryId: string = body.categoryId;
  const description: string | undefined = body.description;
  const coverImage: string | undefined = body.coverImage;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!categoryId) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (await Wiki.exists({ slug })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const createdBy = session.sub;

  const wiki = await Wiki.create({
    name,
    slug,
    description,
    coverImage,
    category: categoryId,
    createdBy,
  });

  return NextResponse.json({ wiki }, { status: 201 });
}
