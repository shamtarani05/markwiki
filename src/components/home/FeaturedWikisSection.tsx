// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function FeaturedWikisSection({ sectionSettings, wikis }: { sectionSettings, wikis?: HomepageSectionSettings | any }) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
{/*  Section Editorial Header  */}
<div className="flex items-center justify-between mb-space-xl">
<div>
<span className="font-label-mono text-label-mono text-secondary uppercase tracking-[0.25em] block mb-1">02 / SPOTLIGHT FRANCHISES</span>
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            {sectionSettings?.title || "Curated Vaults of the Month"}
          </h2>
</div>
<div className="hidden md:flex items-center gap-space-xs">
<button className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-lg">west</span>
</button>
<button className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-lg">east</span>
</button>
</div>
</div>
{/*  Asymmetric Grid Showcase  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
{/*  Primary Featured Wiki (48% width -> lg:col-span-6 or 7)  */}
<div className="lg:col-span-7 rounded-xl bg-surface-container-low overflow-hidden shadow-2xl flex flex-col justify-between group">
<div className="relative w-full h-80 sm:h-96 overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" data-alt="Sung Jinwoo surrounded by glowing shadow soldiers, purple aura radiating from dual daggers, intense eyes, highly detailed high fantasy manhwa concept art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88zIfwW8ZcBdM57XrBdpxRskhzit97AO8zIvlvD-iMoQBu9V2poDNGm1IBza6LxuZI6R82QVQYjNc7vG4Y-1A-9X6E3s0HhDtEyLrS1xN2hTNXeqfcVls4lFHFiF-vGStpvKKIze5aY0_8fBPUlkIDOK8wCuhlvR4NwHGB_1dUF-7mSGCfyrMs3SystMaDVvdQEJh0HJ9JmDpqVm0dSfYqbCqgy-0_cZHlDAPCGP9SpOuviUmEk4YmQ"/>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent"></div>
<div className="absolute top-space-md left-space-md flex gap-space-xs">
<span className="px-space-sm py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Featured Canon #01
              </span>
<span className="px-space-sm py-1 rounded-full bg-tertiary-container/90 text-on-tertiary-container font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined text-xs">verified</span> Verified 100%
              </span>
</div>
<div className="absolute bottom-space-md left-space-md right-space-md flex items-end justify-between">
<div>
<span className="font-label-mono text-label-mono text-secondary">ARCHIVE VAULT // 77-SL</span>
<h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-none mt-1">
                  Solo Leveling
                </h3>
<p className="font-headline-sm text-headline-sm text-primary italic">Shadow Monarch Compendium</p>
</div>
</div>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1">
<p className="font-body-editorial text-body-editorial text-on-surface-variant">
              The definitive registry for Sung Jinwoo&apos;s army, monarch lineages, world gates, and complete rank distributions. Over 4,800 canon-inspected entries reviewed by the Global Hunters Guild.
            </p>
<div className="grid grid-cols-3 gap-space-sm my-space-lg py-space-sm bg-surface-container rounded-lg text-center">
<div>
<span className="block font-headline-sm text-headline-sm text-on-surface">4,812</span>
<span className="font-label-caps text-label-caps uppercase text-outline">Canon Pages</span>
</div>
<div>
<span className="block font-headline-sm text-headline-sm text-on-surface">1.4M</span>
<span className="font-label-caps text-label-caps uppercase text-outline">Monthly Views</span>
</div>
<div>
<span className="block font-headline-sm text-headline-sm text-tertiary">99.8%</span>
<span className="font-label-caps text-label-caps uppercase text-outline">Accuracy Index</span>
</div>
</div>
<div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
<div className="flex items-center gap-2">
<span className="px-2.5 py-1 rounded bg-surface-variant font-label-mono text-label-mono text-on-surface-variant">Rulers</span>
<span className="px-2.5 py-1 rounded bg-surface-variant font-label-mono text-label-mono text-on-surface-variant">Monarchs</span>
<span className="px-2.5 py-1 rounded bg-surface-variant font-label-mono text-label-mono text-on-surface-variant">S-Rank Guilds</span>
</div>
<button className="px-space-lg py-space-xs rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-caps text-label-caps uppercase tracking-wider transition-all shadow-md flex items-center gap-space-xs">
<span>Enter Vault</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</button>
</div>
</div>
</div>
{/*  Secondary Wikis Stack (52% width -> lg:col-span-5)  */}
<div className="lg:col-span-5 flex flex-col gap-space-md">
{/*  Secondary Card 1: Arcane  */}
<div className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex gap-space-md items-center shadow-md">
<div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-variant relative shadow-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Jinx looking over the bridge in Zaun with vivid electric cyan hair, neon pink graffiti splashes, hextech blue ambient smoke, cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA69sAV9iIFCk-MfdsfhMYsz8WRkKiw4pMTjCt3qw-wSNP3BAATiOlhfiDW1wBMjD4HeIRxxLYr4gCY7y9UXAV3K-BM3oefB1YT8CLMU4J_rAHApwMMeVaKkdvkixzgcHLuvbq8aGmQNMOM4I7yYlqyIvWbbr2opuJvNcYM_nGC-aGRIkaIyrgC1wayE6Uy9DDaBdv3R2W5-hGJA40c1MQ40uCGNAsIShWuirkD1IV6CsfgOm7PlWyLNw"/>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-1">
<span className="font-label-mono text-label-mono text-secondary">2,940 ARTICLES</span>
<span className="text-outline-variant">•</span>
<span className="font-label-caps text-label-caps uppercase text-tertiary">Hextech Lore</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">
                Arcane: Piltover &amp; Zaun
              </h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">
                Anatomy of Shimmer, Hexgates trade corridors, and council political minutes.
              </p>
<div className="flex items-center gap-space-xs mt-space-sm text-primary font-label-caps text-label-caps uppercase tracking-wider">
<span>Inspect Archive</span>
<span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">chevron_right</span>
</div>
</div>
</div>
{/*  Secondary Card 2: Elden Ring  */}
<div className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex gap-space-md items-center shadow-md">
<div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-variant relative shadow-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Golden ethereal shattered runes floating in dark void, Erdtree roots winding through marble ruin architecture, souls-like dark fantasy concept" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3g4q4WLsmEiRpFfJkTmTh8o_IvSSGfhlqpIa8zvPKH1dZ1NGqYNQvBS8GUQ0msQ_gBCaKk7x3vBSFZQGAnd-2QT8t82hv1hsnH8xv0mbQWWZqANK8qKkt3kj2-zZ1_YNFryLqv4QHIVTJvooSkAzc0EH9uOdj-SPAUkry8o87sWlGebRH_Zw2M-it_fc79BkVkcD38oW_UYO_H3a31buo8kkqXd9ZVTU6WNB_Svt3ZpjWykt8rJGIsA"/>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-1">
<span className="font-label-mono text-label-mono text-secondary">6,120 ARTICLES</span>
<span className="text-outline-variant">•</span>
<span className="font-label-caps text-label-caps uppercase text-secondary-fixed-dim">Golden Order</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">
                Elden Ring: Lands Between Codex
              </h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">
                Demigod lineages, Shadow Realm mappings, and untranslated item runes.
              </p>
<div className="flex items-center gap-space-xs mt-space-sm text-primary font-label-caps text-label-caps uppercase tracking-wider">
<span>Inspect Archive</span>
<span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">chevron_right</span>
</div>
</div>
</div>
{/*  Secondary Card 3: Omniscient Reader  */}
<div className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex gap-space-md items-center shadow-md">
<div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-variant relative shadow-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Kim Dokja in black trench coat looking out over Seoul subway tunnel filled with floating constellation messages and blue starry constellations" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEq2X2BJNrPzJQVNSibpnneiglJhwqwTZTu1wvtnW2B-ID8HjJSkV-IWfoZaJgE65XJhodiwTN0aWpu1tYjjxQP7wRAUBi_Q6oDNviIZ5fc3QSdlVQC-VT80oiu-wIk-N5hqWmjDXjo0YBsJ3xqrr0nrZ_C4hT1BBmJ4CH9u-6atE9F1kTDr5aIoyDlqvsBAPnPqAgQC1yGcMvIrH-QK7rowiqf7ibETLhJ32oVck6NqtQlfuMzhVtug"/>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-1">
<span className="font-label-mono text-label-mono text-secondary">1,840 ARTICLES</span>
<span className="text-outline-variant">•</span>
<span className="font-label-caps text-label-caps uppercase text-tertiary">Scenario Log</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">
                Omniscient Reader&apos;s Viewpoint
              </h4>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">
                Constellation sponsor contracts, dokkaebi scenario stipulations, and Fable logs.
              </p>
<div className="flex items-center gap-space-xs mt-space-sm text-primary font-label-caps text-label-caps uppercase tracking-wider">
<span>Inspect Archive</span>
<span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">chevron_right</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
  );
}
