import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectDB from '@/src/lib/db/connection';
import { Page, ReadingProgress, Wiki } from '@/src/lib/db/models';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import type { Block } from '@/src/lib/blocks/types';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import ReactionButton from '@/src/components/community/ReactionButton';
import CommentSection from '@/src/components/community/CommentSection';

interface Props {
  params: Promise<{ wikiSlug: string; pageSlug: string }>;
}

// Server-rendered on request (not client-fetched) so Google&apos;s crawler gets
// full HTML immediately — the previous version of this route was a client
// component with hardcoded mock data, which is both why readers never saw
// real admin-authored pages and why it couldn&apos;t rank: an empty shell that
// needs JS to populate is a much weaker signal to a search crawler than
// content present in the initial response.
async function loadPage(wikiSlug: string, pageSlug: string) {
  await connectDB();
  // The wiki itself must be approved too — otherwise a page inside a
  // draft/pending wiki stays publicly readable even though the wiki&apos;s own
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

  // Fire-and-forget — don&apos;t make the reader wait on a write.
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
    <div className="min-h-screen bg-surface-container-lowest pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Header with Gradients */}
      <div className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden border-b border-outline-variant/30">
        
        {/* Rich Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-surface-container-lowest to-primary/10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/20 to-transparent blur-3xl opacity-50 -z-10 rounded-full mix-blend-screen transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-50 -z-10 rounded-full mix-blend-screen transform -translate-x-1/4 translate-y-1/4" />

        {/* Background Blur Effect using Cover Image */}
        {page.coverImage && (
          <div 
            className="absolute inset-0 opacity-[0.05] bg-cover bg-center filter blur-3xl scale-125 saturate-150" 
            style={{ backgroundImage: `url(${page.coverImage})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-6 bg-surface-container-low/50 backdrop-blur-md py-2 px-4 rounded-full border border-outline-variant/30 inline-flex shadow-sm">
            <Link href={`/wiki/${wikiSlug}`} className="text-primary hover:text-primary-hover font-bold transition-colors">
              {wiki.name} Wiki
            </Link>
            <span className="opacity-50 text-on-surface">•</span>
            <span className="text-on-surface-variant font-medium text-sm">{(page.viewCount + 1).toLocaleString()} views</span>
            {session && (
              <>
                <span className="opacity-50 text-on-surface">•</span>
                <Link href={`/wiki/${wikiSlug}/${pageSlug}/edit`} className="text-accent hover:text-accent-hover font-bold text-sm transition-colors">
                  Edit Page
                </Link>
              </>
            )}
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-on-surface via-primary to-on-surface mb-6 leading-tight drop-shadow-sm">
            {page.title}
          </h1>
        </div>
      </div>

      <div className="container py-12">
        <BlockListRenderer blocks={page.blocks as Block[]} />

        {page.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-outline-variant/30 flex items-start gap-2 flex-wrap">
            <span className="text-on-surface-variant text-sm">Categories:</span>
            {page.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 text-sm bg-surface-container-low text-primary rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Community Interaction */}
        <div className="mt-12 flex justify-between items-center border-t border-outline-variant/30 pt-8">
          <div>
            <h3 className="text-lg font-headline-sm text-on-surface mb-2">Was this page helpful?</h3>
            <p className="text-on-surface-variant font-body-sm mb-4">Let the contributors know what you think!</p>
            <ReactionButton contentType="page" contentId={page._id.toString()} />
          </div>
        </div>

        <CommentSection contentType="page" contentId={page._id.toString()} />
      </div>
    </div>
  );
}
