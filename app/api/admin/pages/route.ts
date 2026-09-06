import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { slugify } from '@/src/lib/slugify';
import type { Block } from '@/src/lib/blocks/types';
import type { PageArchetype } from '@/src/lib/blocks/templates';

export async function GET(req: NextRequest) {
  await connectDB();
  const wikiId = req.nextUrl.searchParams.get('wikiId');
  const filter = wikiId ? { wiki: wikiId } : {};
  const pages = await Page.find(filter)
    .select('title slug pageType status wiki coverImage updatedAt')
    .populate('wiki', 'name')
    .sort({ updatedAt: -1 })
    .limit(50);
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const title: string = body.title?.trim();
  const wikiId: string = body.wikiId;
  const pageType: PageArchetype = body.pageType ?? 'blank';
  const blocks: Block[] = body.blocks ?? [];
  const templateKey: string | undefined = body.templateKey;
  const coverImage: string | undefined = body.coverImage || undefined;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!wikiId) {
    return NextResponse.json({ error: 'A wiki is required — every page belongs to one wiki' }, { status: 400 });
  }
  if (!(await Wiki.exists({ _id: wikiId }))) {
    return NextResponse.json({ error: 'Wiki not found' }, { status: 404 });
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await Page.exists({ wiki: wikiId, slug })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const authorId = session.sub;

  const status = isTrustedRole(session.role) ? 'draft' : 'pending';

  const page = await Page.create({
    wiki: wikiId,
    pageType,
    title,
    slug,
    blocks,
    templateKey,
    coverImage,
    author: authorId,
    lastEditedBy: authorId,
    status,
  });

  await Wiki.updateOne({ _id: wikiId }, { $inc: { pageCount: 1 } });

  return NextResponse.json({ page }, { status: 201 });
}
