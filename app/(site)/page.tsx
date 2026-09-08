import connectDB from '@/src/lib/db/connection';
import { Category, Page, ReadingProgress, Revision, Wiki } from '@/src/lib/db/models';
import { trendingScoreStage } from '@/src/lib/db/trending';
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

// "2 hours ago" / "3 days ago" style relative time, computed server-side at
// render time — no client JS/library needed for this coarse a granularity.
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

async function getHomeData() {
  await connectDB();
  const [categories, wikis, wikiCountsByCategory, trendingPages, recentRevisions, topContributors] = await Promise.all([
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
    // Trending = weighted views + search hits (src/lib/db/trending.ts),
    // same formula the wiki hub page already uses.
    Page.aggregate([
      { $match: { status: 'published' } },
      trendingScoreStage(),
      { $sort: { trendingScore: -1 } },
      { $limit: 6 },
      { $lookup: { from: 'wikis', localField: 'wiki', foreignField: '_id', as: 'wiki' } },
      { $unwind: '$wiki' },
    ]),
    // Feeds both RecentActivitySection (edit feed) and CommunitySection
    // (wiki-update items) — real Revision docs, no separate query needed.
    // status: 'applied' — a non-trusted edit to a published page creates a
    // *pending* revision whose target page is still published, so the
    // contentId.status check below would let its attacker-controlled
    // editSummary onto the homepage before any admin reviewed it.
    // snapshotPageRevision (every trusted edit/rollback/approval path)
    // relies on the schema default 'applied', so legitimate activity is
    // unaffected; an approved contribution flips to 'applied' and appears.
    Revision.find({ contentType: 'page', status: 'applied' })
      .populate('editedBy', 'name avatar')
      .populate({
        path: 'contentId',
        select: 'title slug wiki excerpt coverImage status',
        model: 'Page',
        populate: { path: 'wiki', select: 'name slug' },
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    // Top contributors by edit count — no Contributor/leaderboard model
    // exists, so this is derived straight from real Revision history.
    Revision.aggregate([
      { $match: { contentType: 'page' } },
      { $group: { _id: '$editedBy', edits: { $sum: 1 } } },
      { $sort: { edits: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
    ]),
  ]);
  const countByCategory = new Map(
    wikiCountsByCategory.map((c: { _id: unknown; count: number }) => [c._id?.toString(), c.count])
  );
  return { categories, wikis, countByCategory, trendingPages, recentRevisions, topContributors };
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
  const { categories, wikis, countByCategory, trendingPages, recentRevisions, topContributors } = await getHomeData();
  const session = await getSessionUser();
  const continueReading = session ? await getContinueReading(session.sub) : [];

  // Only revisions whose target page still exists (populate resolves to
  // null for a deleted page) *and* is published are usable for either
  // activity feed below — without the status check these public feeds leak
  // the titles and edit summaries of draft/pending pages, including
  // contributor submissions still sitting in the review queue.
  const validRevisions = recentRevisions.filter(
    (r) => r.contentId && (r.contentId as unknown as { status?: string }).status === 'published'
  );

  const recentActivity = validRevisions.map((rev) => {
    const page = rev.contentId as unknown as {
      title: string;
      wiki?: { name?: string; slug?: string };
    };
    const editor = rev.editedBy as unknown as { name?: string; avatar?: string } | undefined;
    return {
      id: rev._id.toString(),
      type: (rev.version === 1 ? 'create' : 'edit') as 'create' | 'edit',
      user: editor?.name ?? 'Unknown',
      userAvatar: editor?.avatar ?? '',
      page: page.title,
      wiki: page.wiki?.name ?? '',
      wikiSlug: page.wiki?.slug ?? '',
      timestamp: timeAgo(rev.createdAt),
      summary: rev.editSummary,
    };
  });

  // CommunitySection's Update shape has no real backing model for the
  // 'news' | 'community' | 'announcement' types (no BlogPost/Comment
  // content exists yet, per PROGRESS.md) — only 'wiki-update' items are
  // real, built from the same revision history above. The other types
  // are intentionally left an empty list rather than fabricated content.
  const communityUpdates = validRevisions.slice(0, 3).map((rev, index) => {
    const page = rev.contentId as unknown as {
      title: string;
      excerpt?: string;
      coverImage?: string;
      wiki?: { name?: string };
    };
    const editor = rev.editedBy as unknown as { name?: string } | undefined;
    const excerpt = rev.editSummary || page.excerpt || 'This page was recently updated.';
    return {
      id: rev._id.toString(),
      title: page.title,
      type: 'wiki-update' as const,
      author: editor?.name ?? 'Unknown',
      excerpt,
      date: rev.createdAt.toISOString(),
      readTime: Math.max(1, Math.round(excerpt.split(' ').length / 40)),
      featured: index === 0,
      image: page.coverImage ?? '',
      wiki: page.wiki?.name,
    };
  });

  const contributors = topContributors.map((c) => {
    const user = c.user as unknown as { name?: string; avatar?: string };
    return {
      name: user?.name ?? 'Unknown',
      edits: c.edits as number,
      avatar: user?.avatar ?? '',
    };
  });

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
      <TrendingPagesSection
        pages={trendingPages.map((p) => {
          const wiki = p.wiki as unknown as { name?: string; slug?: string };
          const pageType = (p.pageType as string | undefined) ?? 'blank';
          return {
            id: p.slug as string,
            title: p.title as string,
            wiki: wiki?.name ?? '',
            wikiSlug: wiki?.slug ?? '',
            excerpt: (p.excerpt as string | undefined) ?? '',
            views: (p.viewCount as number | undefined) ?? 0,
            edits: (p.editCount as number | undefined) ?? 0,
            category: pageType.charAt(0).toUpperCase() + pageType.slice(1),
            image: (p.coverImage as string | undefined) ?? '',
            lastUpdated: timeAgo(p.updatedAt as Date),
          };
        })}
      />

      {/* Community News & Updates */}
      <CommunitySection updates={communityUpdates} />

      {/* Recent Activity & Top Contributors */}
      <RecentActivitySection activity={recentActivity} contributors={contributors} />

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
