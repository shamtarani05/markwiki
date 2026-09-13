// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function ContinueReadingSection({ settings, items }: { settings, items?: HomepageSectionSettings | any }) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
<div className="flex items-center justify-between mb-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary text-xl">history_toggle_off</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">{settings?.title || "Pick up where you left off"}</h2>
</div>
<Link className="font-label-caps text-label-caps uppercase tracking-wider text-primary hover:text-on-surface transition-colors flex items-center gap-1" href="#">
          Reading Queue <span className="material-symbols-outlined text-sm">chevron_right</span>
</Link>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
{/*  Progress Card 1  */}
<div className="group relative flex flex-col sm:flex-row items-center gap-space-md p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all shadow-md">
<div className="relative w-full sm:w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-surface-variant shadow-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Dark moody illustrated cover of Solo Leveling Ragnarok featuring a shadow monarch with glowing violet daggers and neon blue eyes in cinematic manhwa style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKD81IlxqKT5BUWrEztiFjkdIKZ4F77xoK9QNnahcxwu6Hnk_CA5tCbz2ZIzkF9sJgVKRpIViw0QfIqWKvwsHGZj5OT1iRHlgb22i0XC0qXi1HLV2IakSWTllj62xObvVcWBsqSM3uNpO6IXWUJzGDdn3XYXP9i4BQaD-5k8GmzjqVbp1-IxN0P8jf9JjOBo-fsLYr3cgq08aHhHKLnih5e6C36jk3AfkIXSh_97tdRKou-Vo8PVd7-w"/>
<span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 font-label-mono text-label-mono text-primary-fixed">CH 42</span>
</div>
<div className="flex-1 flex flex-col justify-between w-full h-full py-1">
<div>
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Web Novel Serial</span>
<span className="font-label-mono text-label-mono text-tertiary">84% Read</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5 group-hover:text-primary transition-colors">
                Solo Leveling: Ragnarok
              </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">
                The Monarch&apos;s Descent onto the Frozen Plateau of North America.
              </p>
</div>
<div className="mt-space-sm">
<div className="w-full h-1.5 rounded-full bg-surface-variant overflow-hidden mb-space-sm">
<div className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full" style={{width: '84%'}}></div>
</div>
<div className="flex items-center justify-between">
<span className="font-label-mono text-label-mono text-outline">Last read 2h ago</span>
<button className="px-space-md py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm hover:bg-primary-container transition-all flex items-center gap-1">
<span>Resume</span>
<span className="material-symbols-outlined text-xs">play_arrow</span>
</button>
</div>
</div>
</div>
</div>
{/*  Progress Card 2  */}
<div className="group relative flex flex-col sm:flex-row items-center gap-space-md p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all shadow-md">
<div className="relative w-full sm:w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-surface-variant shadow-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Steampunk cyberpunk Zaun cityscape neon green chem-tech fog and brass piping with a hooded female silhouette from Arcane" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKDOsY3GvSDf0JY1r2tW8UJ6GfajxCvBnkN3bOvyYsYuCgcClYRGVQWEeQXylMptZIWCxBoMD_2HmSN9VtqM2jD2jvQjIiF0_e6DvV_XPNpmpFOOLBozi6OkG0z-E5y61EVq4ZxBNLB3QvURRDLy-MQzalb6BHKGEryRGSQKMg3d_bU_5yH_isOXDXD9_tC8I-PwtoYXlOQIVB8s_sqQRDGcGtRXRu6qWh2JuJbnOCrJrKS9ilRUwRYg"/>
<span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 font-label-mono text-label-mono text-secondary-fixed">CH 12</span>
</div>
<div className="flex-1 flex flex-col justify-between w-full h-full py-1">
<div>
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps uppercase tracking-wider text-tertiary">Community Lore Series</span>
<span className="font-label-mono text-label-mono text-secondary">62% Read</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5 group-hover:text-primary transition-colors">
                The Shadow of Zaun
              </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-1">
                Deep chem-baron alliances and the reconstruction of Silco&apos;s factory line.
              </p>
</div>
<div className="mt-space-sm">
<div className="w-full h-1.5 rounded-full bg-surface-variant overflow-hidden mb-space-sm">
<div className="h-full bg-gradient-to-r from-secondary to-primary-container rounded-full" style={{width: '62%'}}></div>
</div>
<div className="flex items-center justify-between">
<span className="font-label-mono text-label-mono text-outline">Last read yesterday</span>
<button className="px-space-md py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm transition-all flex items-center gap-1">
<span>Resume</span>
<span className="material-symbols-outlined text-xs">play_arrow</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
  );
}
