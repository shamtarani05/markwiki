// Homepage section configuration — stored in SiteConfig.homepage.sections[],
// rendered dynamically by the public homepage, and editable from the admin
// Homepage Builder page (/admin/homepage).
//
// Each section type maps to a specific React component in
// src/components/home/HomepageSectionRenderer.tsx. The section's `settings`
// bag carries per-type knobs (item count, ad zone, CTA text, etc.) that the
// admin can adjust without touching code.

export const HOMEPAGE_SECTION_TYPES = [
  'hero',
  'continueReading',
  'adBanner',
  'categories',
  'featuredWikis',
  'trending',
  'community',
  'recentActivity',
  'publishCTA',
  'newsletter',
  'featuredBooks',
  'latestStories',
  'blogPosts',
] as const;

export type HomepageSectionType = (typeof HOMEPAGE_SECTION_TYPES)[number];

export interface HomepageSectionSettings {
  // Overrides from the parent section for components that read from settings bag
  title?: string;
  subtitle?: string;

  // General
  itemCount?: number;
  backgroundStyle?: 'default' | 'secondary' | 'gradient';

  // Hero
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroSearchPlaceholder?: string;
  popularLinks?: { label: string; href: string }[];

  // Ad Banner
  adZone?: string;

  // Publish CTA
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;

  // Newsletter
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterDisclaimer?: string;
}

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string;
  subtitle: string;
  order: number;
  isActive: boolean;
  settings: HomepageSectionSettings;
}

// Labels and icons for the admin builder UI
export const SECTION_META: Record<
  HomepageSectionType,
  { label: string; icon: string; description: string }
> = {
  hero: {
    label: 'Hero Section',
    icon: '🎯',
    description: 'Main banner with search bar and quick links',
  },
  continueReading: {
    label: 'Continue Reading',
    icon: '📖',
    description: 'Resume cards for logged-in users (auto-hidden for guests)',
  },
  adBanner: {
    label: 'Ad Banner',
    icon: '📢',
    description: 'Advertisement placement zone',
  },
  categories: {
    label: 'Categories',
    icon: '📂',
    description: 'Browse by category (Anime, Games, Web Novels, etc.)',
  },
  featuredWikis: {
    label: 'Featured Wikis',
    icon: '⭐',
    description: 'Showcase top wikis with cover art carousel',
  },
  trending: {
    label: 'Trending Pages',
    icon: '🔥',
    description: 'Most popular wiki pages right now',
  },
  community: {
    label: 'Community News',
    icon: '💬',
    description: 'Latest community updates and wiki edits',
  },
  recentActivity: {
    label: 'Recent Activity',
    icon: '⚡',
    description: 'Edit timeline and top contributors leaderboard',
  },
  publishCTA: {
    label: 'Contribute CTA',
    icon: '✏️',
    description: 'Call-to-action to contribute or start a wiki',
  },
  newsletter: {
    label: 'Newsletter',
    icon: '📧',
    description: 'Email newsletter signup form',
  },
  featuredBooks: {
    label: 'Featured Books',
    icon: '📚',
    description: 'Showcase featured books and novels',
  },
  latestStories: {
    label: 'Latest Stories',
    icon: '📝',
    description: 'Recently published short stories',
  },
  blogPosts: {
    label: 'Blog Posts',
    icon: '📰',
    description: 'Latest blog articles',
  },
};

let sectionIdCounter = 0;

export function createSectionId(): string {
  sectionIdCounter += 1;
  return `sec_${Date.now().toString(36)}_${sectionIdCounter}`;
}

/**
 * Default homepage layout matching the current hardcoded section order.
 * Seeded into SiteConfig on first load so existing sites look identical
 * without any admin action.
 */
export function getDefaultHomepageSections(): HomepageSection[] {
  return [
    {
      id: createSectionId(),
      type: 'hero',
      title: '',
      subtitle: '',
      order: 0,
      isActive: true,
      settings: {
        heroTitle: 'Your Hub for <accent>Anime, Games</accent>\n& Web Novels',
        heroSubtitle:
          'Explore comprehensive wikis for your favorite anime, webtoons, web novels, and video games. Discover characters, lore, and connect with passionate fan communities.',
        heroSearchPlaceholder: 'Search wikis, characters, series...',
        popularLinks: [
          { label: 'Solo Leveling', href: '/wiki/solo-leveling' },
          { label: 'Jujutsu Kaisen', href: '/wiki/jujutsu-kaisen' },
          { label: 'Elden Ring', href: '/wiki/elden-ring' },
          { label: 'Lord of the Mysteries', href: '/wiki/lotm' },
        ],
      },
    },
    {
      id: createSectionId(),
      type: 'continueReading',
      title: 'Continue Reading',
      subtitle: '',
      order: 1,
      isActive: true,
      settings: { itemCount: 6 },
    },
    {
      id: createSectionId(),
      type: 'adBanner',
      title: '',
      subtitle: '',
      order: 2,
      isActive: true,
      settings: { adZone: 'homepage-hero' },
    },
    {
      id: createSectionId(),
      type: 'categories',
      title: 'Explore Wiki Categories',
      subtitle: 'Dive into comprehensive wikis across anime, games, web novels, and more',
      order: 3,
      isActive: true,
      settings: { backgroundStyle: 'secondary' },
    },
    {
      id: createSectionId(),
      type: 'featuredWikis',
      title: 'Featured Wikis',
      subtitle: 'Most Popular',
      order: 4,
      isActive: true,
      settings: { itemCount: 8 },
    },
    {
      id: createSectionId(),
      type: 'adBanner',
      title: '',
      subtitle: '',
      order: 5,
      isActive: true,
      settings: { adZone: 'homepage-feed' },
    },
    {
      id: createSectionId(),
      type: 'trending',
      title: 'Trending Wiki Pages',
      subtitle: 'Hot Right Now',
      order: 6,
      isActive: true,
      settings: { itemCount: 6, backgroundStyle: 'secondary' },
    },
    {
      id: createSectionId(),
      type: 'community',
      title: 'Community News',
      subtitle: 'Stay Updated',
      order: 7,
      isActive: true,
      settings: {},
    },
    {
      id: createSectionId(),
      type: 'recentActivity',
      title: 'Recent Activity',
      subtitle: 'Live Updates',
      order: 8,
      isActive: true,
      settings: { itemCount: 8 },
    },
    {
      id: createSectionId(),
      type: 'publishCTA',
      title: 'Help Build the Ultimate Fan Resource',
      subtitle: 'Become a Contributor',
      order: 9,
      isActive: true,
      settings: {
        ctaPrimaryText: 'Start a Wiki',
        ctaPrimaryLink: '/create-wiki',
        ctaSecondaryText: 'Learn to Contribute',
        ctaSecondaryLink: '/contribute',
      },
    },
    {
      id: createSectionId(),
      type: 'adBanner',
      title: '',
      subtitle: '',
      order: 10,
      isActive: true,
      settings: { adZone: 'homepage-feed' },
    },
    {
      id: createSectionId(),
      type: 'newsletter',
      title: 'Join Our Wiki Community',
      subtitle: 'Stay Updated',
      order: 11,
      isActive: true,
      settings: {
        backgroundStyle: 'secondary',
        newsletterSubtitle:
          'Get notified about new wiki launches, trending pages, anime/game news, and community events delivered straight to your inbox.',
        newsletterDisclaimer: 'No spam, unsubscribe at any time.',
      },
    },
  ];
}
