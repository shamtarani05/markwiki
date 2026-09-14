'use client';

import React, { useEffect, useState } from 'react';
import type { Block } from '@/src/lib/blocks/types';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
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
} from '@/src/components/home';

interface LivePreviewWrapperProps {
  initialBlocks: Block[];
  initialTheme?: {
    accentColor?: string;
  };
  mockData: any;
}

export default function LivePreviewWrapper({ initialBlocks, initialTheme, mockData }: LivePreviewWrapperProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [theme, setTheme] = useState(initialTheme || {});
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In production, you might want to verify event.origin
      if (event.data?.type === 'LIVE_PREVIEW_UPDATE') {
        setIsPreview(true);
        if (event.data.data.blocks) {
          setBlocks(event.data.data.blocks);
        }
        if (event.data.data.theme) {
          setTheme(event.data.data.theme);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Tell parent frame we are ready to receive preview data
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'LIVE_PREVIEW_READY' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update URL if previewing so links don't navigate away in iframe unless intended
  useEffect(() => {
    if (isPreview) {
      const handleClicks = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (link && link.href.startsWith(window.location.origin)) {
          e.preventDefault();
          console.log('Intercepted navigation in live preview:', link.href);
        }
      };
      document.addEventListener('click', handleClicks);
      return () => document.removeEventListener('click', handleClicks);
    }
  }, [isPreview]);

  return (
    <>
      {theme.accentColor && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --accent: ${theme.accentColor};
              --color-accent: ${theme.accentColor};
              --primary: ${theme.accentColor};
            }
          `
        }} />
      )}
      <BlockListRenderer
        blocks={blocks}
        renderOverride={(block) => {
          // Render specific homepage blocks using the mockData (like HomepageSectionRenderer did)
          switch (block.type) {
            case 'hero':
              return <HeroSection settings={block.props as any} />;
            case 'continueReading':
              return <ContinueReadingSection items={mockData.readingItems} settings={block.props as any} />;
            case 'categories':
              return <CategorySection categories={mockData.categories} sectionSettings={block.props as any} />;
            case 'featuredWikis':
              return <FeaturedWikisSection wikis={mockData.featuredWikis} sectionSettings={block.props as any} />;
            case 'trendingPages':
              return <TrendingPagesSection pages={mockData.trendingPages} settings={block.props as any} />;
            case 'community':
              return <CommunitySection updates={mockData.communityUpdates} />;
            case 'recentActivity':
              return (
                <RecentActivitySection
                  settings={block.props as any}
                  activity={mockData.recentActivity}
                  contributors={mockData.contributors}
                />
              );
            case 'publishCTA':
              return <PublishCTASection settings={block.props as any} />;
            case 'newsletter':
              return <NewsletterSection />;
            case 'featuredBooks':
            case 'latestStories':
            case 'blogPosts':
              return (
                <div className="container py-8 text-center border-2 border-dashed border-outline-variant/30 rounded-lg my-8">
                  <p className="text-on-surface-variant">
                    [{block.type}] — Component not implemented yet
                  </p>
                </div>
              );
            case 'adSlot':
              return <AdBanner zone={(block.props as any).zone || 'homepage'} className="my-8" />;
            default:
              return undefined; // Let BlockRenderer handle it
          }
        }}
      />
    </>
  );
}
