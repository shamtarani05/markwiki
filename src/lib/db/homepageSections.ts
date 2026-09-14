import type { Block } from '@/src/lib/blocks/types';
import { createBlockId } from '@/src/lib/blocks/types';

/**
 * Default homepage layout matching the current hardcoded section order.
 * Seeded into SiteConfig on first load so existing sites look identical
 * without any admin action.
 */
export function getDefaultHomepageSections(): Block[] {
  return [
    {
      id: createBlockId(),
      type: 'hero',
      props: {
        heroTitle: 'Your Hub for Anime, Games\n& Web Novels',
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
      id: createBlockId(),
      type: 'continueReading',
      props: { itemCount: 6 },
    },
    {
      id: createBlockId(),
      type: 'adSlot',
      props: { zone: 'homepage-hero' },
    },
    {
      id: createBlockId(),
      type: 'categories',
      props: { backgroundStyle: 'secondary' },
    },
    {
      id: createBlockId(),
      type: 'featuredWikis',
      props: { itemCount: 8 },
    },
    {
      id: createBlockId(),
      type: 'adSlot',
      props: { zone: 'homepage-feed' },
    },
    {
      id: createBlockId(),
      type: 'trendingPages',
      props: { limit: 6 },
    },
    {
      id: createBlockId(),
      type: 'community',
      props: {},
    },
    {
      id: createBlockId(),
      type: 'recentActivity',
      props: { limit: 8 },
    },
    {
      id: createBlockId(),
      type: 'publishCTA',
      props: {
        ctaPrimaryText: 'Start a Wiki',
        ctaPrimaryLink: '/create-wiki',
        ctaSecondaryText: 'Learn to Contribute',
        ctaSecondaryLink: '/contribute',
      },
    },
    {
      id: createBlockId(),
      type: 'adSlot',
      props: { zone: 'homepage-feed' },
    },
    {
      id: createBlockId(),
      type: 'newsletter',
      props: {
        title: 'Join Our Wiki Community',
        subtitle: 'Stay Updated',
      },
    },
  ];
}
