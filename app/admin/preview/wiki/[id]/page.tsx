import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

export default async function AdminWikiPreview({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const wiki = await Wiki.findById(id).lean();
  if (!wiki) notFound();
  const coverPage = wiki.coverPage ? await Page.findById(wiki.coverPage).lean() : null;
  const otherPages = await Page.find({ wiki: wiki._id, pageType: { $ne: 'cover' } })
    .select('title slug pageType status')
    .lean();

  return (
    <div>
      <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow)] text-sm font-medium">
        Pending preview — status: {wiki.status}. Not visible to the public yet.
      </div>
      <h1 className="text-3xl font-bold text-[#F5F3EF] mb-1">{wiki.name} Wiki</h1>
      {wiki.description && <p className="text-[#706F78] mb-6">{wiki.description}</p>}
      {coverPage ? (
        <BlockListRenderer blocks={coverPage.blocks as Block[]} />
      ) : (
        <p className="text-[#706F78]">No cover page.</p>
      )}
      {otherPages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#F5F3EF] mb-3">Pages in this wiki</h2>
          <ul className="space-y-1">
            {otherPages.map((p) => (
              <li key={p._id.toString()}>
                <Link href={`/admin/preview/page/${p._id}`} className="text-[#8B5CF6] hover:underline">{p.title}</Link>
                <span className="text-xs text-[#706F78] ml-2">({p.status})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
