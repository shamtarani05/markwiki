import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { getSystemAuthorId } from '@/src/lib/db/getSystemAuthor';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';
import type { PageStatus } from '@/src/lib/db/models/Page';

// TODO(auth): see app/api/admin/pages/route.ts — same placeholder-author note.

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
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

  const authorId = await getSystemAuthorId();

  // Snapshot the page's state as it was *before* this edit, so history shows
  // what changed at each step (matches standard wiki edit-history behavior).
  await snapshotPageRevision(existing, authorId, editSummary);

  // Mutate + .save() rather than findByIdAndUpdate — only .save() runs the
  // pre('save') hook that keeps searchText in sync with the new blocks.
  if (title) existing.title = title;
  if (blocks) existing.blocks = blocks;
  if (coverImage !== undefined) existing.coverImage = coverImage;
  if (status && status !== existing.status) {
    existing.status = status;
    if (status === 'published' && !existing.publishedAt) existing.publishedAt = new Date();
  }
  existing.lastEditedBy = new mongoose.Types.ObjectId(authorId);
  existing.editCount += 1;
  await existing.save();

  return NextResponse.json({ page: existing });
}
