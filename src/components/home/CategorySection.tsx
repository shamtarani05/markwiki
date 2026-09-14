// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';
import AdZoneRenderer from '@/src/components/ads/AdZoneRenderer';

export default function CategorySection({ sectionSettings, categories }: { sectionSettings?: HomepageSectionSettings | any, categories?: any[] }) {
  return (
<section className="w-full bg-surface-container-lowest py-space-2xl">
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
          if (i === 0) {
    return (
      <Link href={`/category/${cat.slug || cat.id}`} key={cat.id || i} className="md:col-span-7 md:row-span-2 relative rounded-xl overflow-hidden group p-space-lg flex flex-col justify-between shadow-xl bg-surface-container block">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-60" style={{backgroundImage: `url('${cat.image}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-mono text-label-mono">
            // {cat.tag}
          </span>
        </div>
        <div className="relative z-10 mt-auto">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-1">CULT CLASSICS &amp; RELEASES</span>
          <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface group-hover:text-primary transition-colors">
            {cat.name}
          </h3>
          <p className="font-body-default text-body-default text-on-surface-variant max-w-xl mt-space-xs line-clamp-2">
            {cat.description}
          </p>
          <div className="flex items-center gap-space-md mt-space-md">
            <span className="inline-flex items-center text-primary font-label-caps text-label-caps uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              Explore Domain <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }
  
  if (i === 1 || i === 2) {
    return (
      <Link href={`/category/${cat.slug || cat.id}`} key={cat.id || i} className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between shadow-lg bg-surface-container block">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-40" style={{backgroundImage: `url('${cat.image}')`}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/90 via-surface-container-lowest/60 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-label-mono text-label-mono text-tertiary">// {cat.tag}</span>
        </div>
        <div className="relative z-10">
          <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
            {cat.name}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
            {cat.description}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/category/${cat.slug || cat.id}`} key={cat.id || i} className="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group p-space-md flex flex-col justify-between bg-surface-container-low shadow-md block">
      <div className="flex items-center justify-between">
        <span className="text-xl">{cat.icon}</span>
      </div>
      <div>
        <span className="font-label-caps text-label-caps uppercase text-outline">{cat.tag}</span>
        <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mt-0.5">{cat.name}</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">{cat.description}</p>
      </div>
    </Link>
  );
})}
</div>
</div>
</section>
  );
}
