import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';

export async function GET() {
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectDB();

  const [wikis, pages, revisions] = await Promise.all([
    Wiki.find({ status: 'pending' }).populate('createdBy', 'name email').sort({ updatedAt: -1 }).lean(),
    Page.find({ status: 'pending' }).populate('author', 'name email').populate('wiki', 'name slug').sort({ updatedAt: -1 }).lean(),
    Revision.find({ status: 'pending' }).populate('editedBy', 'name email').populate({ path: 'contentId', select: 'title slug wiki', model: 'Page' }).sort({ createdAt: -1 }).lean(),
  ]);

  const items = [
    ...wikis.map((w) => ({ kind: 'wiki' as const, id: w._id.toString(), title: w.name, submittedBy: (w.createdBy as unknown as { name?: string })?.name, updatedAt: w.updatedAt })),
    ...pages.map((p) => ({ kind: 'page' as const, id: p._id.toString(), title: p.title, submittedBy: (p.author as unknown as { name?: string })?.name, updatedAt: p.updatedAt })),
    ...revisions.map((r) => ({ kind: 'revision' as const, id: r._id.toString(), title: r.title, submittedBy: (r.editedBy as unknown as { name?: string })?.name, updatedAt: r.createdAt })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({ items });
}
