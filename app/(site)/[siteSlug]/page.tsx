import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectDB from '@/src/lib/db/connection';
import { Page } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';

interface Props {
  params: Promise<{ siteSlug: string }>;
}

async function loadSitePage(siteSlug: string) {
  await connectDB();
  return Page.findOne({ siteSlug, pageType: 'site', status: 'published' }).lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug } = await params;
  const page = await loadSitePage(siteSlug);
  if (!page) return {};
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.excerpt,
    alternates: { canonical: `/${siteSlug}` },
  };
}

export default async function SitePage({ params }: Props) {
  const { siteSlug } = await params;
  const page = await loadSitePage(siteSlug);
  if (!page) notFound();

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-on-surface mb-6">{page.title}</h1>
      <BlockListRenderer blocks={page.blocks as Block[]} />
    </div>
  );
}
