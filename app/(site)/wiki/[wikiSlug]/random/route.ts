import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

export async function GET(req: NextRequest, { params }: { params: Promise<{ wikiSlug: string }> }) {
  const { wikiSlug } = await params;
  await connectDB();

  const wiki = await Wiki.findOne({ slug: wikiSlug }).select('_id').lean();
  if (!wiki) return NextResponse.redirect(new URL(`/wiki/${wikiSlug}`, req.url));

  const [random] = await Page.aggregate([
    { $match: { wiki: wiki._id, status: 'published' } },
    { $sample: { size: 1 } },
    { $project: { slug: 1 } },
  ]);

  const destination = random ? `/wiki/${wikiSlug}/${random.slug}` : `/wiki/${wikiSlug}`;
  return NextResponse.redirect(new URL(destination, req.url));
}
