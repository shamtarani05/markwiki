import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { slugify } from '@/src/lib/slugify';
import type { Block } from '@/src/lib/blocks/types';

const SEED_PAGES = [{ title: 'About', siteSlug: 'about' }];

// Top-level static route segments that resolve before the dynamic
// /[siteSlug] catch-all ever sees them — a site page given one of these
// slugs would be permanently unreachable at its own URL.
const RESERVED_SLUGS = new Set(['admin', 'api', 'login', 'register', 'account', 'wiki']);

export async function GET() {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Idempotent seed, same pattern as GET /api/admin/categories.
  for (const seed of SEED_PAGES) {
    if (!(await Page.exists({ siteSlug: seed.siteSlug }))) {
      await Page.create({
        pageType: 'site', siteSlug: seed.siteSlug, title: seed.title,
        slug: seed.siteSlug, blocks: [], author: session.sub, lastEditedBy: session.sub, status: 'draft',
      });
    }
  }

  const pages = await Page.find({ pageType: 'site' }).select('title siteSlug status updatedAt').sort({ title: 1 });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const title: string = body.title?.trim();
  const blocks: Block[] = body.blocks ?? [];
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const baseSlug = slugify(title);
  let siteSlug = baseSlug;
  let suffix = 1;
  while (RESERVED_SLUGS.has(siteSlug) || (await Page.exists({ siteSlug }))) {
    suffix += 1;
    siteSlug = `${baseSlug}-${suffix}`;
  }

  const page = await Page.create({
    pageType: 'site', siteSlug, slug: siteSlug, title, blocks,
    author: session.sub, lastEditedBy: session.sub, status: 'draft',
  });
  return NextResponse.json({ page }, { status: 201 });
}
