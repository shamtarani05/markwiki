'use client';

import React, { useEffect, useState } from 'react';
import type { HomepageSection } from '@/src/lib/db/homepageSections';
import HomepageSectionRenderer from '@/src/components/home/HomepageSectionRenderer';

interface LivePreviewWrapperProps {
  initialSections: HomepageSection[];
  initialTheme?: {
    accentColor?: string;
  };
  mockData: any;
}

export default function LivePreviewWrapper({ initialSections, initialTheme, mockData }: LivePreviewWrapperProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [theme, setTheme] = useState(initialTheme || {});
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In production, you might want to verify event.origin
      if (event.data?.type === 'LIVE_PREVIEW_UPDATE') {
        setIsPreview(true);
        if (event.data.data.sections) {
          setSections(event.data.data.sections);
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
      
      {sections.filter(s => s.isActive).map(section => (
        <HomepageSectionRenderer key={section.id} section={section as any} data={mockData} />
      ))}
    </>
  );
}
