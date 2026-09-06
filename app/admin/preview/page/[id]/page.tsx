import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

export default async function AdminPagePreview({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const page = await Page.findById(id).lean();
  if (!page) notFound();

  return (
    <div>
      <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow)] text-sm font-medium">
        Pending preview — status: {page.status}. Not visible to the public yet.
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-6">{page.title}</h1>
      <BlockListRenderer blocks={page.blocks as Block[]} />
    </div>
  );
}
