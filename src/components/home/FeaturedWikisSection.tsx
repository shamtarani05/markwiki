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
  {wikis?.length > 0 && (
    <div className="lg:col-span-7 rounded-xl bg-surface-container-low overflow-hidden shadow-2xl flex flex-col justify-between group">
      <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-surface-variant">
        <img className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" alt={wikis[0].name} src={wikis[0].image}/>
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
            <span className="font-label-mono text-label-mono text-secondary">ARCHIVE VAULT // {wikis[0].tag}</span>
            <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-none mt-1">
              {wikis[0].name}
            </h3>
            <p className="font-headline-sm text-headline-sm text-primary italic">Featured Compendium</p>
          </div>
        </div>
      </div>
      <div className="p-space-lg flex flex-col justify-between flex-1">
        <p className="font-body-editorial text-body-editorial text-on-surface-variant">
          The definitive registry for {wikis[0].name}. Completely reviewed by the Global Guild.
        </p>
        <div className="grid grid-cols-3 gap-space-sm my-space-lg py-space-sm bg-surface-container rounded-lg text-center">
          <div>
            <span className="block font-headline-sm text-headline-sm text-on-surface">{wikis[0].pages}</span>
            <span className="font-label-caps text-label-caps uppercase text-outline">Canon Pages</span>
          </div>
          <div>
            <span className="block font-headline-sm text-headline-sm text-on-surface">{wikis[0].contributors}</span>
            <span className="font-label-caps text-label-caps uppercase text-outline">Contributors</span>
          </div>
          <div>
            <span className="block font-headline-sm text-headline-sm text-tertiary">99.8%</span>
            <span className="font-label-caps text-label-caps uppercase text-outline">Accuracy</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-surface-variant font-label-mono text-label-mono text-on-surface-variant">Top Tier</span>
          </div>
          <Link href={`/wiki/${wikis[0].id}`} className="px-space-lg py-space-xs rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-caps text-label-caps uppercase tracking-wider transition-all shadow-md flex items-center gap-space-xs">
            <span>Enter Vault</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  )}

  <div className="lg:col-span-5 flex flex-col gap-space-md">
    {wikis?.slice(1).map((wiki: any, index: number) => (
      <Link href={`/wiki/${wiki.id}`} key={wiki.id || index} className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex gap-space-md items-center shadow-md">
        <div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-variant relative shadow-md">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={wiki.name} src={wiki.image}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-mono text-label-mono text-secondary">{wiki.pages} ARTICLES</span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-caps text-label-caps uppercase text-tertiary">{wiki.tag}</span>
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">
            {wiki.name}
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">
            Explore the deep lore of {wiki.name}.
          </p>
          <div className="flex items-center gap-space-xs mt-space-sm text-primary font-label-caps text-label-caps uppercase tracking-wider">
            <span>Inspect Archive</span>
            <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>
</div>
</section>
  );
}
