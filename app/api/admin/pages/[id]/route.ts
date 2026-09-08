import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';
import type { PageStatus } from '@/src/lib/db/models/Page';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const page = await Page.findById(id).populate('wiki', 'name slug');
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const title: string | undefined = body.title?.trim();
  const blocks: Block[] | undefined = body.blocks;
  const editSummary: string | undefined = body.editSummary?.trim() || undefined;
  const status: PageStatus | undefined = body.status;
  const coverImage: string | undefined = body.coverImage;

  const existing = await Page.findById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const authorId = session.sub;

  const trusted = isTrustedRole(session.role);

  if (!trusted && (existing.status === 'published' || existing.status === 'archived')) {
    // Non-trusted edit to a live (or archived) page: propose a pending
    // revision instead of mutating the page directly.
    const latest = await Revision.findOne({ contentType: 'page', contentId: existing._id }).sort({ version: -1 });
    const version = (latest?.version ?? 0) + 1;
    const pendingRevision = await Revision.create({
      contentType: 'page',
      contentId: existing._id,
      title: title ?? existing.title,
      content: JSON.stringify(blocks ?? existing.blocks),
      editedBy: session.sub,
      editSummary,
      version,
      status: 'pending',
    });
    return NextResponse.json({ pendingRevision }, { status: 202 });
  }

  // Snapshot the page's state as it was *before* this edit, so history shows
  // what changed at each step (matches standard wiki edit-history behavior).
  await snapshotPageRevision(existing, authorId, editSummary);

  // Mutate + .save() rather than findByIdAndUpdate — only .save() runs the
  // pre('save') hook that keeps searchText in sync with the new blocks.
  if (title) existing.title = title;
  if (blocks) existing.blocks = blocks;
  if (coverImage !== undefined) existing.coverImage = coverImage;
  if (status && status !== existing.status) {
    // Publish state is a trusted-only decision — without this check a
    // non-trusted author could create a page (auto 'pending') and then
    // PATCH it straight to 'published', bypassing the review queue.
    if (!trusted) {
      return NextResponse.json({ error: 'Only admin/editor can change page status directly' }, { status: 403 });
    }
    existing.status = status;
    if (status === 'published' && !existing.publishedAt) existing.publishedAt = new Date();
  }
  existing.lastEditedBy = new mongoose.Types.ObjectId(authorId);
  existing.editCount += 1;
  await existing.save();

  return NextResponse.json({ page: existing });
}
