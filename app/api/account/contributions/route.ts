import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();

  const [wikis, pages, revisions] = await Promise.all([
    Wiki.find({ createdBy: session.sub }).select('name slug status coverImage reviewNote updatedAt').sort({ updatedAt: -1 }).lean(),
    Page.find({ author: session.sub, pageType: { $ne: 'cover' } }).select('title slug status coverImage reviewNote wiki updatedAt').populate('wiki', 'slug').sort({ updatedAt: -1 }).lean(),
    Revision.find({ editedBy: session.sub, status: { $ne: 'applied' } }).select('title status createdAt').sort({ createdAt: -1 }).lean(),
  ]);

  return NextResponse.json({ wikis, pages, revisions });
}
