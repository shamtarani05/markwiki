'use client';

interface AdBannerProps {
  zone: string;
  className?: string;
}

export default function AdBanner({ zone, className = '' }: AdBannerProps) {
  // In production, this would fetch ad content from the database
  // based on the zone and display appropriate ad

  return (
    <div className={`ad-zone ad-zone-banner ${className}`}>
      <div className="text-center p-4">
        <p className="text-foreground-muted text-sm">Advertisement</p>
        <p className="text-foreground-muted text-xs mt-1">Zone: {zone}</p>
      </div>
    </div>
  );
}
