import type { MetadataRoute } from 'next';
import connectDB from '@/src/lib/db/connection';
import { Page, Wiki } from '@/src/lib/db/models';

// Lets Google discover every published wiki page even if it isn't reachable
// by internal links yet — important for a wiki with many pages, since
// crawlers can't rank what they never find.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [wikis, pages] = await Promise.all([
    Wiki.find().select('slug updatedAt').lean(),
    Page.find({ status: 'published' }).select('slug updatedAt wiki').populate('wiki', 'slug').lean(),
  ]);

  const wikiEntries: MetadataRoute.Sitemap = wikis.map((w) => ({
    url: `${SITE_URL}/wiki/${w.slug}`,
    lastModified: w.updatedAt,
    changeFrequency: 'daily',
  }));

  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((p) => p.wiki && typeof p.wiki === 'object' && 'slug' in p.wiki)
    .map((p) => ({
      url: `${SITE_URL}/wiki/${(p.wiki as unknown as { slug: string }).slug}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
    }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily' },
    ...wikiEntries,
    ...pageEntries,
  ];
}
