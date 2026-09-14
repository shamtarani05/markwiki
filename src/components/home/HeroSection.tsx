// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function HeroSection({ settings }: { settings?: HomepageSectionSettings | any }) {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-[72px] pt-[132px] pb-space-2xl min-h-[798px] flex flex-col justify-between">
{/*  Cosmic Violet Nebula Glow Background  */}
<div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
<div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-primary/30 via-secondary-container/20 to-transparent blur-[140px] rounded-full"></div>
<div className="absolute top-1/3 -left-[10%] w-[500px] h-[500px] bg-secondary-container/15 blur-[120px] rounded-full"></div>
<div className="absolute top-1/4 -right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full"></div>
</div>
{/*  Editorial Ambient Grid Overlay  */}
<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(160,120,255,0.12),transparent)] pointer-events-none"></div>
<div className="relative z-10 max-w-[1440px] w-full mx-auto px-margin-sm md:px-margin lg:px-margin-lg flex flex-col items-center text-center">
{/*  Living Badge  */}
<div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high/90 shadow-md mb-space-lg backdrop-blur-md">
<span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#51de9d] animate-pulse"></span>
<span className="font-label-caps text-label-caps text-on-surface uppercase tracking-[0.2em]">The Living Archive</span>
<span className="text-outline-variant text-label-caps">•</span>
<span className="font-label-mono text-label-mono text-primary">v4.8 CANON FEED</span>
</div>
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
<kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-label-mono font-label-mono text-on-surface-variant shadow-sm">
<span className="text-xs">⌘</span>K
            </kbd>
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
<span className="font-headline-sm text-headline-sm text-on-surface">482,190</span>
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Canon Articles</span>
</div>
<div className="hidden sm:block w-px h-6 bg-surface-variant"></div>
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-lg">visibility</span>
<span className="font-headline-sm text-headline-sm text-on-surface">3.4M</span>
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Daily Readers</span>
</div>
<div className="hidden sm:block w-px h-6 bg-surface-variant"></div>
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-tertiary text-lg">auto_stories</span>
<span className="font-headline-sm text-headline-sm text-on-surface">14,200</span>
<span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Active Lore-Masters</span>
</div>
</div>
</div>
</section>
  );
}
