// @ts-nocheck
import type { HomepageSection } from '@/src/lib/db/homepageSections';
import {
  HeroSection,
  ContinueReadingSection,
  CategorySection,
  FeaturedWikisSection,
  TrendingPagesSection,
  CommunitySection,
  RecentActivitySection,
  PublishCTASection,
  NewsletterSection,
  AdBanner,
  type ReadingItem,
  type WikiPage,
  type Update,
  type Activity,
  type Contributor,
} from '@/src/components/home';

export interface HomepageData {
  readingItems: ReadingItem[];
  categories: any[];
  featuredWikis: any[];
  trendingPages: WikiPage[];
  communityUpdates: Update[];
  recentActivity: Activity[];
  contributors: Contributor[];
}

export default function HomepageSectionRenderer({
  section,
  data,
}: {
  section: HomepageSection;
  data: HomepageData;
}) {
  const settings = {
    ...section.settings,
    title: section.title,
    subtitle: section.subtitle,
  };

  switch (section.type) {
    case 'hero':
      return <HeroSection settings={settings} />;

    case 'continueReading':
      return <ContinueReadingSection items={data.readingItems} settings={settings} />;

    case 'adBanner':
      return <AdBanner zone={settings?.adZone || 'homepage'} className="my-8" />;

    case 'categories':
      return <CategorySection categories={data.categories} sectionSettings={settings} />;

    case 'featuredWikis':
      return <FeaturedWikisSection wikis={data.featuredWikis} sectionSettings={settings} />;

    case 'trending':
      return <TrendingPagesSection pages={data.trendingPages} settings={settings} />;

    case 'community':
      return <CommunitySection updates={data.communityUpdates} settings={settings} />;

    case 'recentActivity':
      return (
        <RecentActivitySection
          activity={data.recentActivity}
          contributors={data.contributors}
          settings={settings}
        />
      );

    case 'publishCTA':
      return <PublishCTASection settings={settings} />;

    case 'newsletter':
      return <NewsletterSection settings={settings} />;

    case 'featuredBooks':
    case 'latestStories':
    case 'blogPosts':
      return (
        <div className="container py-8 text-center border-2 border-dashed border-border rounded-lg my-8">
          <p className="text-foreground-muted">
            [{section.title || section.type}] — Component not implemented yet
          </p>
        </div>
      );

    default:
      return null;
  }
}
