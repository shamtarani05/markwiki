import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';
import { snapshotPageRevision } from '@/src/lib/db/pageRevisions';
import type { Block } from '@/src/lib/blocks/types';
import type { PageStatus } from '@/src/lib/db/models/Page';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const page = await Page.findOne({ _id: id, pageType: 'site' });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const title: string | undefined = body.title?.trim();
  const blocks: Block[] | undefined = body.blocks;
  const status: PageStatus | undefined = body.status;
  const editSummary: string | undefined = body.editSummary?.trim() || undefined;

  const existing = await Page.findOne({ _id: id, pageType: 'site' });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await snapshotPageRevision(existing, session.sub, editSummary);
  if (title) existing.title = title;
  if (blocks) existing.blocks = blocks;
  if (status && status !== existing.status) {
    existing.status = status;
    if (status === 'published' && !existing.publishedAt) existing.publishedAt = new Date();
  }
  existing.lastEditedBy = new mongoose.Types.ObjectId(session.sub);
  existing.editCount += 1;
  await existing.save();

  return NextResponse.json({ page: existing });
}
