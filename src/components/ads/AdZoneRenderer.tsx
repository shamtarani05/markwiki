'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IAdPlacement, AdZone } from '@/src/lib/db/models/AdPlacement';

export default function AdZoneRenderer({ zone, className = '' }: { zone: AdZone, className?: string }) {
  const [ads, setAds] = useState<IAdPlacement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [zone]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/ads?zone=${zone}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error('Error fetching ads for zone', zone, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || ads.length === 0) return null;

  // Render the highest priority ad (first one since they are sorted by priority)
  const ad = ads[0];

  return (
    <div className={`ad-zone flex justify-center items-center my-space-lg w-full ${className}`}>
      <div className="relative group rounded-xl overflow-hidden shadow-lg border border-outline-variant/30 bg-surface-container w-full max-w-4xl mx-auto flex items-center justify-center">
        {/* Ad Badge indicator */}
        <span className="absolute top-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-label-caps text-label-caps uppercase tracking-widest text-outline z-10 pointer-events-none">
          Advertisement
        </span>

        {ad.type === 'banner' && ad.content?.imageUrl && (
          ad.content.linkUrl ? (
            <a href={ad.content.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
              <img 
                src={ad.content.imageUrl} 
                alt={ad.content.altText || ad.name} 
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </a>
          ) : (
            <img 
              src={ad.content.imageUrl} 
              alt={ad.content.altText || ad.name} 
              className="w-full h-auto object-cover opacity-90"
            />
          )
        )}

        {ad.type === 'custom' && ad.content?.html && (
          <div 
            className="w-full h-full p-4"
            dangerouslySetInnerHTML={{ __html: ad.content.html }} 
          />
        )}

        {ad.type === 'adsense' && ad.content?.adsenseCode && (
          <div 
            className="w-full h-full p-4 min-h-[90px] flex items-center justify-center text-on-surface-variant font-label-mono"
          >
            {/* Real adsense would be injected here via dangerouslySetInnerHTML or a dedicated AdSense component */}
            <div dangerouslySetInnerHTML={{ __html: ad.content.adsenseCode }} />
          </div>
        )}
      </div>
    </div>
  );
}
