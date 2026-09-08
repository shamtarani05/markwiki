import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/db/connection';
import { Revision } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { isTrustedRole } from '@/src/lib/auth/roles';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  // Trusted-only: this feed includes pending (unreviewed) revisions and
  // populates contributor emails, neither of which is public information.
  const session = await getSessionUser();
  if (!session || !isTrustedRole(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const revisions = await Revision.find({ contentType: 'page', contentId: id })
    .populate('editedBy', 'name email')
    .sort({ version: -1 });
  return NextResponse.json({ revisions });
}
