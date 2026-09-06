import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, ReadingProgress } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();

  const progress = await ReadingProgress.find({ user: session.sub, contentType: 'page' })
    .sort({ lastReadAt: -1 })
    .limit(6)
    .lean();

  const pages = await Page.find({ _id: { $in: progress.map((p) => p.contentId) } })
    .select('title slug coverImage wiki')
    .populate('wiki', 'name slug')
    .lean();
  const pageById = new Map(pages.map((p) => [p._id.toString(), p]));

  const items = progress
    .map((p) => {
      const page = pageById.get(p.contentId.toString());
      if (!page) return null;
      const wiki = page.wiki as unknown as { name: string; slug: string };
      return {
        pageTitle: page.title,
        pageSlug: page.slug,
        coverImage: page.coverImage,
        wikiName: wiki.name,
        wikiSlug: wiki.slug,
        lastReadAt: p.lastReadAt,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items });
}
