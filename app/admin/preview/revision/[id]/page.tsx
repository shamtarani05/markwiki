import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Revision } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

export default async function AdminRevisionPreview({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const revision = await Revision.findById(id).lean();
  if (!revision) notFound();
  const blocks = JSON.parse(revision.content) as Block[];

  return (
    <div>
      <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow)] text-sm font-medium">
        Proposed edit preview — not yet applied to the live page.
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-6">{revision.title}</h1>
      <BlockListRenderer blocks={blocks} />
    </div>
  );
}
