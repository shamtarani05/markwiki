// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function HeroSection({ settings, stats }: { settings?: HomepageSectionSettings | any, stats?: { totalArticles: number, totalViews: number, activeContributors: number } }) {
  const formatNumber = (num: number = 0) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section className="relative w-full overflow-hidden bg-transparent -mt-[72px] pt-[132px] pb-space-2xl min-h-[798px] flex flex-col justify-between">
<div className="relative z-10 max-w-[1440px] w-full mx-auto px-margin-sm md:px-margin lg:px-margin-lg flex flex-col items-center text-center">

{/*  Main Headline  */}
<h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface max-w-5xl tracking-tight leading-[1.05] text-balance">
        {settings?.heroTitle ? <span dangerouslySetInnerHTML={{__html: settings.heroTitle.replace(/<accent>/g, '<span class="italic font-normal text-primary">').replace(/<\/accent>/g, '</span>')}} /> : <>Explore the worlds <span className="italic font-normal text-primary">you love.</span></>}
</h1>
{/*  Supporting Editorial Narrative  */}
<p className="mt-space-md font-body-editorial text-body-editorial text-on-surface-variant max-w-2xl text-balance">
        {settings?.heroSubtitle || "The next-generation fan knowledge and serialized fiction platform. Deep lore, verified timelines, and living stories curated by enthusiasts worldwide."}
      </p>
{/*  Search Component Box  */}
<form action="/search" className="w-full max-w-3xl mt-space-xl relative group">
<div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary-container/40 to-primary/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
<div className="relative flex items-center bg-surface-container-high/90 backdrop-blur-xl rounded-full px-space-lg py-space-sm shadow-xl transition-all">
<span className="material-symbols-outlined text-primary text-2xl mr-space-sm select-none">travel_explore</span>
<input name="q" className="w-full bg-transparent text-headline-sm font-headline-sm text-on-surface placeholder:text-outline focus:outline-none tracking-tight" placeholder="Search wikis, characters, artifacts, chronologies..." type="text"/>
<div className="flex items-center gap-space-xs ml-space-sm shrink-0">
<button type="submit" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all shadow-md active:scale-95">
<span className="material-symbols-outlined text-xl">arrow_forward</span>
</button>
</div>
</div>
</form>
{/*  Search Chips  */}
<div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-md max-w-2xl">
            <span className="font-label-caps text-label-caps uppercase text-outline mr-space-xs tracking-wider">Indexed Now:</span>
            {(settings?.searchTags || [
              'Solo Leveling',
              'Arcane',
              'Elden Ring',
              'Chainsaw Man',
              'Cyberpunk 2077',
              'Omniscient Reader'
            ]).map((query: string) => (
              <Link 
                key={query}
                href={`/search?q=${encodeURIComponent(query)}`} 
                className="px-space-sm py-1 rounded-full bg-surface-container/70 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary font-body-sm text-body-sm transition-all"
              >
                {query}
              </Link>
            ))}
</div>
</div>
{/*  Live Archive Stats Ribbon  */}
<div className="relative z-10 max-w-[1440px] w-full mx-auto px-margin-sm md:px-margin lg:px-margin-lg mt-space-2xl">
<div className="w-full bg-surface-container/80 backdrop-blur-md rounded-xl p-space-md flex flex-wrap items-center justify-around gap-space-md text-center shadow-md">
<div className="flex items-center gap-space-sm">
<span className="w-3 h-3 rounded-full bg-primary/30 flex items-center justify-center">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
</span>
<span className="font-headline-sm text-headline-sm text-on-surface">{formatNumber(stats?.totalArticles)}</span>
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Canon Articles</span>
</div>
<div className="hidden sm:block w-px h-6 bg-surface-variant"></div>
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-lg">visibility</span>
<span className="font-headline-sm text-headline-sm text-on-surface">{formatNumber(stats?.totalViews)}</span>
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Total Views</span>
</div>
<div className="hidden sm:block w-px h-6 bg-surface-variant"></div>
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-tertiary text-lg">auto_stories</span>
<span className="font-headline-sm text-headline-sm text-on-surface">{formatNumber(stats?.activeContributors)}</span>
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Active Lore-Masters</span>
</div>
</div>
</div>
</section>
  );
}
