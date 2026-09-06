import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectDB();
  const { type, id } = await params;
  const body = await req.json();
  const decision: 'approve' | 'decline' = body.decision;
  const reviewNote: string | undefined = body.reviewNote;
  const publishStatus: 'draft' | 'published' = body.publishStatus ?? 'published';

  if (type === 'wiki') {
    const wiki = await Wiki.findById(id);
    if (!wiki) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    wiki.status = decision === 'approve' ? 'approved' : 'draft';
    if (decision === 'decline') wiki.reviewNote = reviewNote;
    await wiki.save();
    return NextResponse.json({ wiki });
  }

  if (type === 'page') {
    const page = await Page.findById(id);
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (decision === 'approve') {
      page.status = publishStatus;
      if (publishStatus === 'published' && !page.publishedAt) page.publishedAt = new Date();
    } else {
      page.status = 'draft';
      page.reviewNote = reviewNote;
    }
    await page.save();
    return NextResponse.json({ page });
  }

  if (type === 'revision') {
    const revision = await Revision.findById(id);
    if (!revision) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (decision === 'approve') {
      const page = await Page.findById(revision.contentId);
      if (!page) return NextResponse.json({ error: 'Target page no longer exists' }, { status: 404 });
      await snapshotPageRevision(page, session.sub, `Approved contribution from review queue`);
      page.title = revision.title;
      page.blocks = JSON.parse(revision.content) as Block[];
      page.lastEditedBy = new mongoose.Types.ObjectId(session.sub);
      page.editCount += 1;
      await page.save();
      revision.status = 'applied';
      await revision.save();
      return NextResponse.json({ page });
    }
    revision.status = 'rejected';
    await revision.save();
    return NextResponse.json({ revision });
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}
