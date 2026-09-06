import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const wiki = await Wiki.findById(id);
  if (!wiki) return NextResponse.json({ error: 'Wiki not found' }, { status: 404 });

  const isOwner = wiki.createdBy.toString() === session.sub;
  const trusted = isTrustedRole(session.role);
  if (!isOwner && !trusted) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const action: string = body.action;

  // Only owner/self-service actions live here. Approve/decline of a
  // *pending* wiki belongs solely to the review queue (Task 12's
  // POST /api/admin/review/wiki/[id]) — one code path for that transition.
  if (action === 'publish') {
    if (!trusted) return NextResponse.json({ error: 'Only admin/editor can publish directly' }, { status: 403 });
    if (wiki.status !== 'draft') return NextResponse.json({ error: 'Only a draft wiki can be published' }, { status: 400 });
    wiki.status = 'approved';
  } else if (action === 'submit') {
    if (wiki.status !== 'draft') return NextResponse.json({ error: 'Only a draft wiki can be submitted' }, { status: 400 });
    wiki.status = 'pending';
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  await wiki.save();
  return NextResponse.json({ wiki });
}
