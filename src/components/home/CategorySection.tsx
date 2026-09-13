// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function CategorySection({ sectionSettings, categories }: { sectionSettings?: HomepageSectionSettings | any, categories?: any[] }) {
  return (
<section className="w-full bg-surface-container-lowest py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
{/*  Section Editorial Header  */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
<div>
<span className="font-label-mono text-label-mono text-primary uppercase tracking-[0.25em] block mb-1">01 / ARCHIVE DOMAINS</span>
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            {sectionSettings?.title || "Traverse curated knowledge nodes."}
          </h2>
</div>
<p className="font-body-default text-body-default text-on-surface-variant max-w-md">
          {sectionSettings?.subtitle || "Every universe partitioned by discipline, verified by cross-referencing core canon materials and authorized scripts."}
        </p>
</div>
{/*  Bento Grid (Asymmetrical)  */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-md auto-rows-[220px]">
{/*  Large Card 1: Anime & Manga (Cols: 7, Rows: 2)  */}
<div className="md:col-span-7 md:row-span-2 relative rounded-xl overflow-hidden group p-space-lg flex flex-col justify-between shadow-xl bg-surface-container">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-60" data-alt="Epic widescreen cinematic anime artwork with dark celestial sky, neon magenta energy slashing across the frame, highly stylized line work and glowing sparks" style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between">
<span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-mono text-label-mono">
              // DOMAIN.01
            </span>
<span className="font-label-mono text-label-mono text-on-surface-variant bg-surface-container-lowest/60 px-2 py-0.5 rounded">
              184,290 WIKIS
            </span>
</div>
<div className="relative z-10 mt-auto">
<span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">CULT CLASSICS &amp; RELEASES</span>
<h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface group-hover:text-primary transition-colors">
              Anime &amp; Manga
            </h3>
<p className="font-body-default text-body-default text-on-surface-variant max-w-xl mt-space-xs line-clamp-2">
              From the deep curses of Shibuya to the ancient Grand Line. Unravel complete character profiles, sakuga keyframe credits, and translated creator interviews.
            </p>
<div className="flex items-center gap-space-md mt-space-md">
<span className="inline-flex items-center text-primary font-label-caps text-label-caps uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Explore Domain <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
</span>
</div>
</div>
</div>
{/*  Medium Card 2: Webtoons & Web Novels (Cols: 5, Rows: 1)  */}
<div className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between shadow-lg bg-surface-container">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-40" data-alt="Vertical scrolling manhwa art panel illustration showing a floating blue screen holographic user interface with glowing runes and dark silhouette" style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/90 via-surface-container-lowest/60 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between">
<span className="font-label-mono text-label-mono text-tertiary">// DOMAIN.02</span>
<span className="font-label-mono text-label-mono text-outline">98,120 WIKIS</span>
</div>
<div className="relative z-10">
<h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
              Webtoons &amp; Serialized Novels
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
              Cultivation realms, regression systems, and dungeon apocalypse mythologies.
            </p>
</div>
</div>
{/*  Medium Card 3: Video Games (Cols: 5, Rows: 1)  */}
<div className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between shadow-lg bg-surface-container">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-40" data-alt="Dark fantasy gothic stone temple illuminated by golden Erdtree ethereal branches with an armored knight kneeling on wet stones in atmospheric Elden Ring lighting" style={{backgroundImage: 'url(\'https'}}></div>
<div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/90 via-surface-container-lowest/60 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between">
<span className="font-label-mono text-label-mono text-secondary">// DOMAIN.03</span>
<span className="font-label-mono text-label-mono text-outline">112,040 WIKIS</span>
</div>
<div className="relative z-10">
<h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
              Video Game Universes
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
              Item description lore, interactive boss timings, and fragmented environmental storytelling.
            </p>
</div>
</div>
{/*  Compact Card 4: Movies & TV (Cols: 4, Rows: 1)  */}
<div className="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between bg-surface-container-low shadow-md">
<div className="flex items-center justify-between">
<span className="material-symbols-outlined text-primary text-xl">movie</span>
<span className="font-label-mono text-label-mono text-outline">43,800</span>
</div>
<div>
<span className="font-label-caps text-label-caps uppercase text-outline">Cinematic Universes</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mt-0.5">Movies &amp; TV</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">Sci-fi franchises, space operas, &amp; serialized screenplays.</p>
</div>
</div>
{/*  Compact Card 5: Tabletop & RPG (Cols: 4, Rows: 1)  */}
<div className="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between bg-surface-container-low shadow-md">
<div className="flex items-center justify-between">
<span className="material-symbols-outlined text-tertiary text-xl">casino</span>
<span className="font-label-mono text-label-mono text-outline">28,450</span>
</div>
<div>
<span className="font-label-caps text-label-caps uppercase text-outline">Campaign Lore</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mt-0.5">Tabletop &amp; TTRPG</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">D&amp;D world settings, homebrew pantheons &amp; statblocks.</p>
</div>
</div>
{/*  Compact Card 6: Trading Cards & Collectibles (Cols: 4, Rows: 1)  */}
<div className="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between bg-surface-container-low shadow-md">
<div className="flex items-center justify-between">
<span className="material-symbols-outlined text-secondary text-xl">style</span>
<span className="font-label-mono text-label-mono text-outline">15,490</span>
</div>
<div>
<span className="font-label-caps text-label-caps uppercase text-outline">Card Archetypes</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mt-0.5">Trading Cards &amp; CCG</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">Flavor text, card genealogy, and competitive meta logs.</p>
</div>
</div>
</div>
</div>
</section>
  );
}
