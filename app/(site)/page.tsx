import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import type { Block } from '@/src/lib/blocks/types';
import { getDefaultHomepageSections } from '@/src/lib/db/homepageSections';
import LivePreviewWrapper from '@/src/components/admin/LivePreviewWrapper';
import { getSessionUser } from '@/src/lib/auth/getSessionUser';
import { Book, Category, Wiki, Page as WikiPage, BlogPost, ShortStory, Revision, User, ReadingProgress } from '@/src/lib/db/models';

export const revalidate = 60; // Cache for 1 minute

export default async function Page() {
  await connectDB();
  const session = await getSessionUser();
  const config = await SiteConfig.findOne().lean();
  let blocks: Block[] = config?.homepage?.blocks || [];

  if (!blocks.length) {
    blocks = getDefaultHomepageSections();
  }

  const initialTheme = {
    accentColor: config?.theme?.accentColor || '#D4AF37'
  };

  // 0. Dynamic Search Tags (popularLinks)
  const dynamicLinks = (await Wiki.find({ status: 'approved' }).sort({ pageCount: -1 }).limit(6).lean()).map((w: any) => ({
    label: w.name,
    href: `/search?q=${encodeURIComponent(w.name)}`
  }));

  if (dynamicLinks.length === 0) {
    dynamicLinks.push(
      { label: 'Solo Leveling', href: '/search?q=Solo%20Leveling' },
      { label: 'Arcane', href: '/search?q=Arcane' },
      { label: 'Elden Ring', href: '/search?q=Elden%20Ring' }
    );
  }
  
  // Inject tags into hero block if it exists
  const heroBlock = blocks.find(b => b.type === 'hero');
  if (heroBlock) {
    heroBlock.props = {
      ...heroBlock.props,
      popularLinks: dynamicLinks
    };
  }

  let readingItems: any[] = [];
  if (session) {
    const progressRecords = await ReadingProgress.find({ user: session.sub })
      .sort({ lastReadAt: -1 })
      .limit(3)
      .lean();

    const populatedRecords = await Promise.all(progressRecords.map(async (p: any) => {
      let content = null;
      if (p.contentType === 'book') content = await Book.findById(p.contentId, 'title coverImage slug type status').lean();
      if (p.contentType === 'story') content = await ShortStory.findById(p.contentId, 'title coverImage slug type status').lean();
      if (p.contentType === 'blog') content = await BlogPost.findById(p.contentId, 'title coverImage slug type status').lean();
      if (p.contentType === 'page') content = await WikiPage.findById(p.contentId, 'title coverImage slug type status').lean();
      return { ...p, contentId: content };
    }));

    readingItems = populatedRecords.map((p: any) => ({
      id: p._id.toString(),
      title: p.contentId?.title || 'Unknown',
      chapter: p.currentChapter ? 'Resuming...' : 'New',
      image: p.contentId?.coverImage || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80',
      progress: p.percentComplete || 0,
      type: p.contentType,
      lastRead: p.lastReadAt ? new Date(p.lastReadAt).toLocaleDateString() : 'Recently',
    }));
  }

  // 2. Categories
  const dbCategories = await Category.find().limit(6).lean();
  const categories = dbCategories.map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
    description: c.description || 'Explore this domain',
    icon: c.icon || '📚',
    tag: c.slug.toUpperCase(),
    slug: c.slug,
    image: c.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80'
  }));

  // 3. Featured Wikis
  const dbWikis = await Wiki.find({ status: 'approved' }).sort({ pageCount: -1 }).limit(4).populate('category', 'name').lean();
  const featuredWikis = dbWikis.map((w: any) => ({
    id: w._id.toString(),
    name: w.name,
    pages: w.pageCount?.toString() || '0',
    contributors: '0', // Could be aggregated if needed
    tag: w.category?.name?.toUpperCase() || 'WIKI',
    image: w.coverImage || 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80',
    url: `/wiki/${w.slug}`
  }));

  // 4. Trending Pages
  const dbPages = await WikiPage.find({ status: 'published', wiki: { $ne: null } })
    .sort({ viewCount: -1 })
    .limit(5)
    .populate('wiki', 'name slug')
    .lean();
    
  const trendingPages = dbPages.map((p: any, index) => ({
    id: p._id.toString(),
    rank: `0${index + 1}`.slice(-2),
    title: p.title,
    type: p.pageType,
    wiki: p.wiki?.name || 'General',
    views: p.viewCount ? `${p.viewCount}` : '0',
    trend: '+0%', // Placeholder for actual trend calculation
    isHot: index < 2,
    url: `/wiki/${p.wiki?.slug}/${p.slug}`
  }));

  // 5. Community Updates (Mix of blogs and stories)
  const [blogs, stories] = await Promise.all([
    BlogPost.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(2).populate('author', 'name').lean(),
    ShortStory.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(2).populate('author', 'name').lean()
  ]);
  
  const updates = [...blogs, ...stories].sort((a: any, b: any) => 
    new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  ).slice(0, 4);

  const communityUpdates = updates.map((u: any) => ({
    id: u._id.toString(),
    title: u.title,
    type: u.synopsis ? 'story' : 'blog',
    author: u.author?.name || 'Admin',
    excerpt: u.excerpt || u.synopsis || 'Read more about this update...',
    date: u.publishedAt || u.createdAt,
    readTime: 5,
    featured: false,
    image: u.coverImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    url: u.synopsis ? `/stories/${u.slug}` : `/blog/${u.slug}`
  }));

  // 6. Recent Activity
  const dbRevisions = await Revision.find().sort({ createdAt: -1 }).limit(5).populate('editedBy', 'name avatar').lean();
  const recentActivity = dbRevisions.map((r: any) => ({
    id: r._id.toString(),
    user: r.editedBy?.name || 'Anonymous',
    userAvatar: r.editedBy?.avatar || `https://i.pravatar.cc/150?u=${r.editedBy?._id || 'anon'}`,
    action: r.editSummary ? 'edited' : 'updated',
    target: r.title || 'Unknown Page',
    targetType: 'page',
    wiki: 'MarcWiki', // Could populate wiki from page
    time: new Date(r.createdAt).toLocaleDateString(),
    tag: 'Update',
    icon: 'edit'
  }));

  // 7. Contributors
  const dbUsers = await User.find({ role: { $in: ['admin', 'editor', 'contributor'] } }).limit(3).lean();
  const contributors = dbUsers.map((u: any) => ({
    id: u._id.toString(),
    user: u.name,
    userAvatar: u.avatar || `https://i.pravatar.cc/150?u=${u._id}`,
    title: u.role.toUpperCase(),
    revisions: 'Verified Revisions',
    points: 'Active'
  }));

  const mockData = {
    readingItems,
    categories,
    featuredWikis,
    trendingPages,
    communityUpdates,
    recentActivity,
    contributors,
  };

  return (
    <div className="flex flex-col w-full relative selection:bg-primary-container selection:text-on-primary-container">
      <LivePreviewWrapper 
        initialBlocks={blocks} 
        initialTheme={initialTheme} 
        mockData={mockData} 
      />
    </div>
  );
}
