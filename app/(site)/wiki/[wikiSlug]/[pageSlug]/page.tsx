import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectDB from '@/src/lib/db/connection';
import { Page, ReadingProgress, Wiki } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';

interface Props {
  params: Promise<{ wikiSlug: string; pageSlug: string }>;
}

// Server-rendered on request (not client-fetched) so Google's crawler gets
// full HTML immediately — the previous version of this route was a client
// component with hardcoded mock data, which is both why readers never saw
// real admin-authored pages and why it couldn't rank: an empty shell that
// needs JS to populate is a much weaker signal to a search crawler than
// content present in the initial response.
async function loadPage(wikiSlug: string, pageSlug: string) {
  await connectDB();
  // The wiki itself must be approved too — otherwise a page inside a
  // draft/pending wiki stays publicly readable even though the wiki's own
  // hub page 404s.
  const wiki = await Wiki.findOne({ slug: wikiSlug, status: 'approved' }).lean();
  if (!wiki) return null;
  const page = await Page.findOne({ wiki: wiki._id, slug: pageSlug, status: 'published' }).lean();
  if (!page) return null;
  return { wiki, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wikiSlug, pageSlug } = await params;
  const result = await loadPage(wikiSlug, pageSlug);
  if (!result) return {};
  const { page, wiki } = result;

  const description = page.seo?.description || page.excerpt || `${page.title} — part of the ${wiki.name} wiki.`;
  const title = page.seo?.title || `${page.title} | ${wiki.name} Wiki`;
  const url = `/wiki/${wikiSlug}/${pageSlug}`;

  return {
    title,
    description,
    keywords: page.seo?.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description,
      type: 'article',
      url,
      images: page.coverImage ? [page.coverImage] : undefined,
    },
    twitter: {
      card: page.coverImage ? 'summary_large_image' : 'summary',
      title: page.title,
      description,
    },
  };
}

export default async function WikiReadPage({ params }: Props) {
  const { wikiSlug, pageSlug } = await params;
  const result = await loadPage(wikiSlug, pageSlug);
  if (!result) notFound();
  const { page, wiki } = result;
  const session = await getSessionUser();

  // Fire-and-forget — don't make the reader wait on a write.
  void Page.updateOne({ _id: page._id }, { $inc: { viewCount: 1 } }).exec();
  if (session) {
    void ReadingProgress.updateOne(
      { user: session.sub, contentType: 'page', contentId: page._id },
      { $set: { lastReadAt: new Date() }, $setOnInsert: { startedAt: new Date() } },
      { upsert: true }
    ).exec();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.seo?.description || page.excerpt,
    dateModified: new Date(page.updatedAt).toISOString(),
    datePublished: page.publishedAt ? new Date(page.publishedAt).toISOString() : undefined,
    isPartOf: { '@type': 'WebSite', name: `${wiki.name} Wiki` },
    image: page.coverImage,
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-border bg-background-secondary">
        <div className="container py-2 flex items-center justify-between text-sm">
          <Link href={`/wiki/${wikiSlug}`} className="text-accent hover:underline font-medium">
            {wiki.name} Wiki
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-foreground-muted">{(page.viewCount + 1).toLocaleString()} views</span>
            {session && (
              <Link href={`/wiki/${wikiSlug}/${pageSlug}/edit`} className="text-accent hover:underline font-medium">
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-4xl font-bold text-foreground mb-6">{page.title}</h1>
        <BlockListRenderer blocks={page.blocks as Block[]} />

        {page.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border flex items-start gap-2 flex-wrap">
            <span className="text-foreground-muted text-sm">Categories:</span>
            {page.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 text-sm bg-background-secondary text-accent rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
