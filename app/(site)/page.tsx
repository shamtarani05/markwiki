import connectDB from '@/src/lib/db/connection';
import { Category, Page, ReadingProgress, Wiki } from '@/src/lib/db/models';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import {
  HeroSection,
  CategorySection,
  FeaturedWikisSection,
  ContinueReadingSection,
  TrendingPagesSection,
  CommunitySection,
  RecentActivitySection,
  PublishCTASection,
  AdBanner,
  NewsletterSection,
} from '@/src/components/home';

async function getHomeData() {
  await connectDB();
  const [categories, wikis, wikiCountsByCategory] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1 }).lean(),
    Wiki.find({ status: 'approved' })
      .populate('category', 'name')
      .sort({ isFeatured: -1, pageCount: -1 })
      .limit(8)
      .lean(),
    // Real "wikis in this category" count per category, rather than a
    // hardcoded placeholder — one aggregation covering every category.
    Wiki.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);
  const countByCategory = new Map(
    wikiCountsByCategory.map((c: { _id: unknown; count: number }) => [c._id?.toString(), c.count])
  );
  return { categories, wikis, countByCategory };
}

// Reuses the exact join Task 14's GET /api/account/reading-progress performs —
// duplicated rather than calling the API route internally (a Server Component
// calling its own API route over HTTP is an anti-pattern; both share the same
// query shape by construction since this is a straight copy).
async function getContinueReading(userId: string) {
  const progress = await ReadingProgress.find({ user: userId, contentType: 'page' })
    .sort({ lastReadAt: -1 })
    .limit(6)
    .lean();
  const pages = await Page.find({ _id: { $in: progress.map((p) => p.contentId) } })
    .select('title slug coverImage wiki')
    .populate('wiki', 'name slug')
    .lean();
  const pageById = new Map(pages.map((p) => [p._id.toString(), p]));
  return progress
    .map((p) => {
      const page = pageById.get(p.contentId.toString());
      if (!page) return null;
      const wiki = page.wiki as unknown as { name: string; slug: string };
      return {
        pageTitle: page.title,
        pageSlug: page.slug,
        coverImage: page.coverImage,
        wikiName: wiki.name,
        wikiSlug: wiki.slug,
        lastReadAt: p.lastReadAt.toISOString(),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export default async function HomePage() {
  const { categories, wikis, countByCategory } = await getHomeData();
  const session = await getSessionUser();
  const continueReading = session ? await getContinueReading(session.sub) : [];

  return (
    <>
      {/* Hero Section - Wiki Search & Quick Links */}
      <HeroSection />

      {/* Continue Reading - only shown for a logged-in user with reading history */}
      {continueReading.length > 0 && (
        <div className="container py-6">
          <ContinueReadingSection items={continueReading} />
        </div>
      )}

      {/* Ad Banner - Homepage Top */}
      <div className="container py-6">
        <AdBanner zone="homepage-hero" />
      </div>

      {/* Categories Section - Anime, Games, Web Novels, etc. */}
      <CategorySection
        categories={categories.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          icon: c.icon ?? '📚',
          count: countByCategory.get(c._id.toString()) ?? 0,
          description: c.description ?? '',
          image: c.coverImage ?? '',
          color: 'accent',
        }))}
      />

      {/* Featured Wikis Section */}
      <FeaturedWikisSection
        wikis={wikis.map((w) => ({
          id: w._id.toString(),
          slug: w.slug,
          title: w.name,
          franchise: (w.category as unknown as { name?: string })?.name ?? 'General',
          cover: w.coverImage ?? '',
          category: (w.category as unknown as { name?: string })?.name ?? 'General',
          pages: w.pageCount,
          contributors: 0,
          trending: w.isFeatured,
        }))}
      />

      {/* Ad Banner - Homepage Feed */}
      <div className="container py-6">
        <AdBanner zone="homepage-feed" />
      </div>

      {/* Trending Wiki Pages */}
      <TrendingPagesSection />

      {/* Community News & Updates */}
      <CommunitySection />

      {/* Recent Activity & Top Contributors */}
      <RecentActivitySection />

      {/* Contribute CTA Section */}
      <PublishCTASection />

      {/* Ad Banner - Before Newsletter */}
      <div className="container py-6">
        <AdBanner zone="homepage-feed" />
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
}
