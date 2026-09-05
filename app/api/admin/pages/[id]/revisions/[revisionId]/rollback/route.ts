import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page, Revision } from '@/src/lib/db/models';
import { getSystemAuthorId } from '@/src/lib/db/getSystemAuthor';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string; revisionId: string }> }) {
  await connectDB();
  const { id, revisionId } = await params;

  const [page, revision] = await Promise.all([
    Page.findById(id),
    Revision.findOne({ _id: revisionId, contentType: 'page', contentId: id }),
  ]);
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  if (!revision) return NextResponse.json({ error: 'Revision not found' }, { status: 404 });

  const authorId = await getSystemAuthorId();

  // Snapshot the current state too, so rolling back is itself a reversible
  // step rather than losing whatever was there before the rollback.
  await snapshotPageRevision(page, authorId, `Rolled back to version ${revision.version}`);

  const restoredBlocks: Block[] = JSON.parse(revision.content);
  page.title = revision.title;
  page.blocks = restoredBlocks;
  page.lastEditedBy = new mongoose.Types.ObjectId(authorId);
  page.editCount += 1;
  await page.save();

  return NextResponse.json({ page });
}
