// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function TrendingPagesSection({ settings, pages }: { settings, pages?: HomepageSectionSettings | any }) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
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
{/*  Row 01  */}
<div className="group flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-md cursor-pointer shadow-sm">
<div className="flex items-center gap-space-md min-w-0">
<span className="font-display-lg text-display-lg italic text-outline/40 group-hover:text-primary transition-colors font-serif w-12 shrink-0">
              01
            </span>
<div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" data-alt="Sung Jinwoo commanding the dragon Kamish in violet spectral shadows, detailed manga art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqZlcMBLa92exOWyDMD5kmwy-Zwcv5P7VLz-UhU8IojCY1uFTDG0YdygUyiq_9BF4JNxJKV648dbto8SJQnyxnatYJVI-7GW8L5YNaQRNFs_nEPBh6N8TuQmJ4AsqEQ0bXNZOpOTkKRMKzk0hg2oMXDT47aXE7KXxOxStkkBHG4c4A--1zv2BNqnDfQDo7GR5XsKc4MOfeTyAH4eWypmrSFE-0W9HajAbJUP8BjTlf5EAmtZZWGRjavw"/>
</div>
<div className="min-w-0">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-mono text-label-mono">Solo Leveling</span>
<span className="font-label-mono text-label-mono text-tertiary flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs">trending_up</span> +340% Spike
                </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate mt-0.5">
                The Origin of the Shadow Monarch: Ashborn&apos;s Fall
              </h3>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-lg shrink-0">
{/*  Inline SVG Sparkline  */}
<div className="flex flex-col items-end">
<svg className="w-24 h-7 text-tertiary" fill="none" viewBox="0 0 100 30">
<path d="M0 24 L20 20 L40 22 L60 12 L80 16 L100 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
</svg>
<span className="font-label-mono text-label-mono text-outline">142.8k reads / 24h</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</div>
{/*  Row 02  */}
<div className="group flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-md cursor-pointer shadow-sm">
<div className="flex items-center gap-space-md min-w-0">
<span className="font-display-lg text-display-lg italic text-outline/40 group-hover:text-primary transition-colors font-serif w-12 shrink-0">
              02
            </span>
<div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" data-alt="Miquella the Kind sitting beside St Trina sleeping in a bed of deep purple velvet flowers, Elden Ring Shadow of the Erdtree illustration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLaH1JzG2RT53uMp9BWUML21CZp8hZiUliYUpFtDJ72ESLRmPKJFf9WsXsk2VHAEOAoMBV2dZh207kYBUpl_acK6lVSYq8mxkGRnxgvE4PX_ygcDuWMCylg0CZBeGtJcJDUWzVajXsnxYqB8UHxuVeTWKbt_zq2Qld3goyT4rjWCeoTwIaGKHqoGngs4_I9PstScEKsdmqT2Nim5Qo1YSuoHuVYh9B6oQWq_P7XBbrQPLCnzfkUcByUQ"/>
</div>
<div className="min-w-0">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-mono text-label-mono">Elden Ring</span>
<span className="font-label-mono text-label-mono text-tertiary flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs">trending_up</span> +210%
                </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate mt-0.5">
                Miquella&apos;s True Age: Unpacking the Scadutree Crucifixion
              </h3>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-lg shrink-0">
<div className="flex flex-col items-end">
<svg className="w-24 h-7 text-secondary" fill="none" viewBox="0 0 100 30">
<path d="M0 26 L25 22 L50 18 L75 8 L100 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
</svg>
<span className="font-label-mono text-label-mono text-outline">98.4k reads / 24h</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</div>
{/*  Row 03  */}
<div className="group flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-md cursor-pointer shadow-sm">
<div className="flex items-center gap-space-md min-w-0">
<span className="font-display-lg text-display-lg italic text-outline/40 group-hover:text-primary transition-colors font-serif w-12 shrink-0">
              03
            </span>
<div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" data-alt="Viktor transformed by the Hexcore with robotic augmentations and glowing purple core from Arcane season two" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyquvyMN-qLHRrZ_fctK5N8yd186D0gU3o5qruEkDT8glxplm-mQcTBXDQiw-K_S1EvjrBs1hCHjg1GWB0o0NqyuYZaNTpi502qVZB7VTvWWtET5CbF67zfv9ykxUA-eMKb97Z4-bJheCm3GD_9SwJeC7rR3ZPPf7kqFXnFXKLLM-vV8kBFrOi12ch6LKFIQHhF_3zt248226RNmipRufexsfNP33vr53L6RJw8xR6T5MQEQun1o-rZw"/>
</div>
<div className="min-w-0">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-mono text-label-mono">Arcane</span>
<span className="font-label-mono text-label-mono text-tertiary flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs">trending_up</span> +195%
                </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate mt-0.5">
                The Hexcore Evolution: How Viktor&apos;s Arc Reshapes Runeterra
              </h3>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-lg shrink-0">
<div className="flex flex-col items-end">
<svg className="w-24 h-7 text-tertiary" fill="none" viewBox="0 0 100 30">
<path d="M0 28 L30 25 L60 14 L80 12 L100 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
</svg>
<span className="font-label-mono text-label-mono text-outline">86.1k reads / 24h</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</div>
{/*  Row 04  */}
<div className="group flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-md cursor-pointer shadow-sm">
<div className="flex items-center gap-space-md min-w-0">
<span className="font-display-lg text-display-lg italic text-outline/40 group-hover:text-primary transition-colors font-serif w-12 shrink-0">
              04
            </span>
<div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" data-alt="The Oldest Dream train wagon surrounded by starlight and galaxy dust in Omniscient Reader novel illustration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1oq-eVePn8MssVpl-uBfu7CWlV-er4dKWIYKYAPMta2ihvzTqrJESUBq_PAiZD8AneNzFiICaI-8IMPQdqNe6tIkT-q_p_6A1rXpihYo3njtxIydVt5DGum74ymvcnrvLghqLcVYr0Mc_zmGnW-tryWb-FO8yHUPM1Vif-QA0imlMw-EP_1sgmrsFZkk8QmeDgt87w9Y_zE6zq2Az_D6Mfk_lE1fXvev886Hbtn1aibyLAgjkKBc9og"/>
</div>
<div className="min-w-0">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-mono text-label-mono">Omniscient Reader</span>
<span className="font-label-mono text-label-mono text-secondary flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs">trending_flat</span> Stable
                </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate mt-0.5">
                The 1,863rd Regression: Secret Timeline Reconstructions
              </h3>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-lg shrink-0">
<div className="flex flex-col items-end">
<svg className="w-24 h-7 text-secondary" fill="none" viewBox="0 0 100 30">
<path d="M0 16 L25 18 L50 14 L75 16 L100 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
</svg>
<span className="font-label-mono text-label-mono text-outline">67.9k reads / 24h</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</div>
{/*  Row 05  */}
<div className="group flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all gap-space-md cursor-pointer shadow-sm">
<div className="flex items-center gap-space-md min-w-0">
<span className="font-display-lg text-display-lg italic text-outline/40 group-hover:text-primary transition-colors font-serif w-12 shrink-0">
              05
            </span>
<div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform" data-alt="Johnny Silverhand playing chrome guitar in smoke and neon red lights of Night City in Cyberpunk 2077 concept" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHmob9jlcrvjwT4E2E0bBbNLG0SM8VvKiA4IzsTCgPFOb2jq4EI9WEZx7gm-T0BMhOzE1EaXCTwyV1E44LWaEWBjl_j3F9zgyFejG8noaNlnVc7F_jeu7scBrLcq692VuIEpuodRZCpWO9luVLQP_Kd7jzwYdSEQJePeWGhXR_V6aREx2wqnj1EIMnN_vaxSzaZi9nYNZfLYuo_eFGIXXTEahDw_jkCTVmYCiJ5DhQ1HWaxnU0PpQx-A"/>
</div>
<div className="min-w-0">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-mono text-label-mono">Cyberpunk 2077</span>
<span className="font-label-mono text-label-mono text-tertiary flex items-center gap-0.5">
<span className="material-symbols-outlined text-xs">trending_up</span> +88%
                </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate mt-0.5">
                Blackwall Rogue AI Protocols: Complete Declassified Files
              </h3>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-space-lg shrink-0">
<div className="flex flex-col items-end">
<svg className="w-24 h-7 text-tertiary" fill="none" viewBox="0 0 100 30">
<path d="M0 24 L25 20 L50 22 L75 14 L100 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
</svg>
<span className="font-label-mono text-label-mono text-outline">51.2k reads / 24h</span>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
</div>
</div>
</div>
</div>
</section>
  );
}
