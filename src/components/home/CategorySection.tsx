// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';
import AdZoneRenderer from '@/src/components/ads/AdZoneRenderer';

export default function CategorySection({ sectionSettings, categories }: { sectionSettings?: HomepageSectionSettings | any, categories?: any[] }) {
  return (
<section className="w-full bg-transparent py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
<AdZoneRenderer zone="homepage-feed" className="mb-space-xl" />
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
{categories?.map((cat: any, i: number) => {
  // Card 1: Large Featured Card
  if (i === 0) {
    return (
      <Link href={`/category/${cat.slug || cat.id}`} key={cat.id || i} className="md:col-span-7 md:row-span-2 relative rounded-2xl overflow-hidden group p-space-lg flex flex-col justify-between shadow-2xl bg-surface-container block ring-1 ring-white/5 hover:ring-primary/30 transition-all duration-500">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70" style={{backgroundImage: `url('${cat.image}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity duration-700 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-transparent/40 backdrop-blur-md border border-white/10 text-primary font-label-mono text-xs tracking-wider shadow-lg">
            // {cat.tag}
          </span>
        </div>
        <div className="relative z-10 mt-auto">
          <span className="font-label-caps text-xs uppercase tracking-[0.2em] text-secondary/90 block mb-2 drop-shadow-md">TOP DESTINATION</span>
          <h3 className="font-headline-lg text-4xl md:text-5xl font-black text-white group-hover:text-primary transition-colors tracking-tight drop-shadow-lg">
            {cat.name}
          </h3>
          <p className="font-body-default text-base text-gray-300 max-w-xl mt-3 line-clamp-2 drop-shadow-md font-medium">
            {cat.description}
          </p>
          <div className="flex items-center gap-2 mt-6">
            <span className="inline-flex items-center text-primary font-label-caps text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 bg-primary/10 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/20">
              Explore Domain <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }
  
  // Cards 2 & 3: Medium Side Cards
  if (i === 1 || i === 2) {
    return (
      <Link href={`/category/${cat.slug || cat.id}`} key={cat.id || i} className="md:col-span-5 md:row-span-1 relative rounded-2xl overflow-hidden group p-space-md flex flex-col justify-between shadow-xl bg-surface-container block ring-1 ring-white/5 hover:ring-secondary/40 transition-all duration-500">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110 opacity-50" style={{backgroundImage: `url('${cat.image}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent opacity-80"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-label-mono text-[10px] text-tertiary tracking-widest uppercase px-2 py-1 bg-tertiary/10 rounded backdrop-blur-sm border border-tertiary/20">// {cat.tag}</span>
        </div>
        <div className="relative z-10">
          <h3 className="font-headline-md text-2xl font-bold text-white group-hover:text-secondary transition-colors drop-shadow-md">
            {cat.name}
          </h3>
          <p className="font-body-sm text-sm text-gray-400 mt-2 line-clamp-1 drop-shadow-md">
            {cat.description}
          </p>
        </div>
      </Link>
    );
  }

  // Cards 4+: Small Bottom Cards
  return (
    <Link href={`/category/${cat.slug || cat.id}`} key={cat.id || i} className="md:col-span-4 md:row-span-1 relative rounded-2xl overflow-hidden group p-space-md flex flex-col justify-between bg-gradient-to-br from-surface-container-low to-surface-container-lowest shadow-lg block ring-1 ring-outline-variant/30 hover:ring-primary/50 transition-all duration-300 hover:shadow-primary/5 hover:-translate-y-1">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
        <span className="text-8xl">{cat.icon}</span>
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shadow-inner border border-outline-variant/20 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
          <span className="text-2xl drop-shadow-md">{cat.icon}</span>
        </div>
      </div>
      <div className="relative z-10 mt-6">
        <span className="font-label-caps text-[10px] uppercase text-outline tracking-widest group-hover:text-primary/70 transition-colors">{cat.tag}</span>
        <h4 className="font-headline-sm text-xl font-bold text-on-surface group-hover:text-primary transition-colors mt-1">{cat.name}</h4>
        <p className="font-body-sm text-sm text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">{cat.description}</p>
      </div>
    </Link>
  );
})}
</div>
</div>
</section>
  );
}
