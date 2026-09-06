'use client';

// `BlockListRenderer` is a Client Component, so a Server Component caller
// (the wiki hub route) cannot hand it a `renderOverride` *function* prop
// directly — Next.js only allows Server->Client props to be serializable
// data, not closures (functions can only cross that boundary as Server
// Actions, which this isn't). This wrapper is the fix: the page passes it
// plain, serializable data (already computed server-side), and the
// `renderOverride` closure over that data is built here, entirely on the
// client side of the boundary.
import type { Block } from '@/src/lib/blocks/types';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import WikiStatsDisplay from '@/src/components/wiki/WikiStatsDisplay';
import TrendingPagesDisplay from '@/src/components/wiki/TrendingPagesDisplay';
import RecentActivityDisplay from '@/src/components/wiki/RecentActivityDisplay';

interface TrendingPageData {
  _id: string;
  slug: string;
  pageType: string;
  title: string;
  viewCount: number;
  searchCount: number;
}

interface ActivityItemData {
  _id: string;
  title: string;
  editSummary?: string;
  editorName: string;
  createdAt: string;
  pageSlug?: string;
}

export default function WikiHubCoverBlocks({
  blocks,
  wikiSlug,
  pageCount,
  totalViews,
  trendingPages,
  recentActivityItems,
}: {
  blocks: Block[];
  wikiSlug: string;
  pageCount: number;
  totalViews: number;
  trendingPages: TrendingPageData[];
  recentActivityItems: ActivityItemData[];
}) {
  const renderOverride = (block: Block): React.ReactNode | null => {
    switch (block.type) {
      case 'wikiStats':
        return <WikiStatsDisplay pageCount={pageCount} totalViews={totalViews} />;
      case 'trendingPages':
        return <TrendingPagesDisplay wikiSlug={wikiSlug} pages={trendingPages} />;
      case 'recentActivity':
        return <RecentActivityDisplay wikiSlug={wikiSlug} items={recentActivityItems} />;
      default:
        return null;
    }
  };

  return <BlockListRenderer blocks={blocks} renderOverride={renderOverride} />;
}
