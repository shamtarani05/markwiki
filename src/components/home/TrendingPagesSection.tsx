// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';
import AdZoneRenderer from '@/src/components/ads/AdZoneRenderer';

export default function TrendingPagesSection({ settings, pages }: { settings, pages?: HomepageSectionSettings | any }) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
<AdZoneRenderer zone="homepage-feed" className="mb-space-xl" />
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
<div>
<div className="flex items-center gap-2 mb-1">
<span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
<span className="font-label-mono text-label-mono text-error uppercase tracking-[0.25em]">03 / PULSE OF THE ARCHIVE</span>
</div>
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
          {settings?.title || "Trending Lore Topics Today"}
          </h2>
</div>
<div className="flex items-center gap-space-xs bg-surface-container-high/60 p-1 rounded-xl">
<button className="px-space-md py-1 rounded-lg bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase tracking-wider shadow-sm">
            Past 24h
          </button>
<button className="px-space-md py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors">
            7 Days
          </button>
<button className="px-space-md py-1 rounded-lg text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors">
            All-Time
          </button>
</div>
</div>
{/*  Ranked List (Editorial High Contrast)  */}
<div className="flex flex-col gap-space-sm">
  {pages?.map((page: any, index: number) => (
    <div key={page.id || index} className="group flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-md cursor-pointer shadow-sm">
      <div className="flex items-center gap-space-md min-w-0">
        <span className="font-display-lg text-display-lg italic text-outline/40 group-hover:text-primary transition-colors font-serif w-12 shrink-0">
          {page.rank}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-space-xs">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-mono text-label-mono">{page.wiki}</span>
            <span className={`font-label-mono text-label-mono flex items-center gap-0.5 ${page.isHot ? 'text-tertiary' : 'text-secondary'}`}>
              <span className="material-symbols-outlined text-xs">{page.trend.startsWith('+') ? 'trending_up' : 'trending_down'}</span> {page.trend} Trend
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate mt-0.5">
            {page.title}
          </h3>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-space-lg shrink-0">
        <div className="flex flex-col items-end">
          <svg className={`w-24 h-7 ${page.isHot ? 'text-tertiary' : 'text-secondary'}`} fill="none" viewBox="0 0 100 30">
            <path d={page.trend.startsWith('+') ? "M0 24 L20 20 L40 22 L60 12 L80 16 L100 4" : "M0 4 L20 16 L40 12 L60 22 L80 20 L100 24"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          <span className="font-label-mono text-label-mono text-outline">{page.views} reads / 24h</span>
        </div>
        <Link href={`/wiki/${page.wikiId}/${page.id}`} className="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </Link>
      </div>
    </div>
  ))}
</div>
</div>
</section>
  );
}
