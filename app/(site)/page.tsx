import connectDB from '@/src/lib/db/connection';
import SiteConfig from '@/src/lib/db/models/SiteConfig';
import type { HomepageSection } from '@/src/lib/db/homepageSections';
import { getDefaultHomepageSections } from '@/src/lib/db/homepageSections';
import LivePreviewWrapper from '@/src/components/admin/LivePreviewWrapper';

export const revalidate = 3600; // Cache for 1 hour, or revalidate on demand

export default async function Page() {
  await connectDB();
  const config = await SiteConfig.findOne().lean();
  let sections: HomepageSection[] = config?.homepage?.sections || [];

  if (!sections.length) {
    sections = getDefaultHomepageSections();
  }

  const initialTheme = {
    accentColor: config?.theme?.accentColor || '#D4AF37'
  };

  // Mock data for the static UI since the beautiful static UI doesn&apos;t use the DB yet
  const mockData = {
    readingItems: [],
    categories: [],
    featuredWikis: [],
    trendingPages: [],
    communityUpdates: [],
    recentActivity: [],
    contributors: [],
  };

  return (
    <div className="flex flex-col w-full relative selection:bg-primary-container selection:text-on-primary-container">
      <LivePreviewWrapper 
        initialSections={sections} 
        initialTheme={initialTheme} 
        mockData={mockData} 
      />
    </div>
  );
}
