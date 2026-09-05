import {
  HeroSection,
  CategorySection,
  FeaturedWikisSection,
  TrendingPagesSection,
  CommunitySection,
  RecentActivitySection,
  PublishCTASection,
  AdBanner,
  NewsletterSection,
} from "@/src/components/home";

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Wiki Search & Quick Links */}
      <HeroSection />

      {/* Ad Banner - Homepage Top */}
      <div className="container py-6">
        <AdBanner zone="homepage-hero" />
      </div>

      {/* Categories Section - Anime, Games, Web Novels, etc. */}
      <CategorySection />

      {/* Featured Wikis Section */}
      <FeaturedWikisSection />

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
