import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

export async function GET(req: NextRequest) {
  await connectDB();
  const wikiSlug = req.nextUrl.searchParams.get('wikiSlug');
  const pageSlug = req.nextUrl.searchParams.get('pageSlug');
  if (!wikiSlug || !pageSlug) {
    return NextResponse.json({ error: 'wikiSlug and pageSlug are required' }, { status: 400 });
  }
  const wiki = await Wiki.findOne({ slug: wikiSlug }).select('_id');
  if (!wiki) return NextResponse.json({ page: null }, { status: 404 });
  const page = await Page.findOne({ wiki: wiki._id, slug: pageSlug, status: 'published' })
    .select('title blocks templateKey coverImage');
  if (!page) return NextResponse.json({ page: null }, { status: 404 });
  return NextResponse.json({ page });
}
