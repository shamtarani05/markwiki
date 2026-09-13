// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function RecentActivitySection({ settings }: { settings?: HomepageSectionSettings | any }) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
{/*  Left Column: Live Archive Feed (7 Cols)  */}
<div className="lg:col-span-7 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-md">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
<h3 className="font-headline-md text-headline-md text-on-surface">{settings?.title || "Live Ledger Updates"}</h3>
</div>
<span className="font-label-mono text-label-mono text-outline">SYNCHRONIZING FEED</span>
</div>
{/*  Feed Items  */}
<div className="flex flex-col gap-space-sm">
<div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-md shadow-sm">
<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-variant ring-1 ring-primary/20">
<img alt="Vesper" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARJErOkKFlQl7Mef4kA92TOv9zfiG8EPWiOwAQR0cx5elr-jINIaoyePvZwfxbnA2DvqudoR6_pMV4hA0dBrkR87hr1n8amvZ4_WjmGbD5FCic6PanoNtWBXP9Nv7YSB2id_GZgxuE1rsIxQ7iO-vzhwHVEhvugPs125EyM6p3iSoLLqWY1fHGSr2BtrGpx-mHIsLnuQbKu5Hi3EN2vs5bcgI4Ij_fyQEz8X58FGYz1g6TRIRcw1G27Q"/>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between gap-space-xs">
<span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Vesper</span>
<span className="font-label-mono text-label-mono text-outline">4m ago</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                    Edited <Link className="text-secondary hover:underline font-medium" href="#">"Jinwoo&apos;s Monarch Dagger"</Link> in <span className="text-on-surface-variant">Solo Leveling</span>
</p>
<div className="flex items-center gap-space-sm mt-1.5 font-label-mono text-label-mono">
<span className="text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">+1,240 chars</span>
<span className="text-outline">Added Mythic tier relic stats</span>
</div>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-md shadow-sm">
<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-variant flex items-center justify-center bg-secondary-container text-on-secondary-container font-headline-sm">
                  R
                </div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between gap-space-xs">
<span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Ren-Kaelen</span>
<span className="font-label-mono text-label-mono text-outline">12m ago</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                    Uploaded 4 high-res vector maps to <Link className="text-secondary hover:underline font-medium" href="#">"Shadow Realm Cartography"</Link>
</p>
<div className="flex items-center gap-space-sm mt-1.5 font-label-mono text-label-mono">
<span className="text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">4 Media Files</span>
<span className="text-outline">Verified by Canon Council</span>
</div>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-md shadow-sm">
<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-variant flex items-center justify-center bg-primary-container text-on-primary-container font-headline-sm">
                  A
                </div>
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between gap-space-xs">
<span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Aethelgard</span>
<span className="font-label-mono text-label-mono text-outline">28m ago</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                    Published serialized critique: <Link className="text-secondary hover:underline font-medium" href="#">"The Economics of Piltover Hexgates"</Link>
</p>
<div className="flex items-center gap-space-sm mt-1.5 font-label-mono text-label-mono">
<span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">Story Serial</span>
<span className="text-outline">Chapter 3 of 5</span>
</div>
</div>
</div>
</div>
</div>
<div className="pt-space-md">
<Link className="inline-flex items-center gap-space-xs font-label-caps text-label-caps uppercase tracking-wider text-primary hover:text-on-surface transition-colors" href="#">
<span>View Full Global Audit Log</span>
<span className="material-symbols-outlined text-sm">open_in_new</span>
</Link>
</div>
</div>
{/*  Right Column: Grand Archivists Leaderboard (5 Cols)  */}
<div className="lg:col-span-5 p-space-lg rounded-xl bg-surface-container flex flex-col justify-between shadow-xl">
<div>
<div className="flex items-center justify-between mb-space-md">
<div>
<span className="font-label-caps text-label-caps uppercase text-tertiary tracking-widest block mb-0.5">PEER-RANKED REGISTRY</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Top Lore-Masters</h3>
</div>
<span className="px-2 py-1 rounded bg-surface-container-highest font-label-mono text-label-mono text-secondary">THIS CYCLE</span>
</div>
{/*  Leaderboard Items  */}
<div className="space-y-space-md">
{/*  Rank 1  */}
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low shadow-sm">
<div className="flex items-center gap-space-sm">
<span className="font-display-lg-mobile text-display-lg-mobile font-serif italic text-primary w-6 text-center">1</span>
<div className="w-11 h-11 rounded-full overflow-hidden bg-surface-variant ring-2 ring-primary/40">
<img className="w-full h-full object-cover" data-alt="Cyberpunk anime style character avatar with violet hair and neon visor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkFCZ6NGeaylWXRL0oIuoJCFwm35ONuPnxsC-owHhj1aZxx-0-2IPPFqTteVtmsem68p9J6TFzUyc6NqNraVObATdNbQBbXhxoH8F234xfAU0XF1FcNnK2hBEsJ5a0Flf3VYO8CJhmXABovdXfuFeuENSkjZVFozZzg2BJJXf0KgymdpN2sOQsaxFmXdsMrSdoSJ2_VLTSNQg1cR94hxee21-0z-8I528WMfyUFMiM-k0y0cEr1M-zqw"/>
</div>
<div>
<div className="flex items-center gap-1.5">
<h4 className="font-headline-sm text-headline-sm text-on-surface leading-none">Morpheus_X</h4>
<span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-caps text-label-caps text-[9px]">GRAND ARCHIVIST</span>
</div>
<span className="font-label-mono text-label-mono text-outline">18,490 Verified Revisions</span>
</div>
</div>
<span className="font-label-mono text-label-mono text-tertiary font-bold">+4,820 pts</span>
</div>
{/*  Rank 2  */}
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low shadow-sm">
<div className="flex items-center gap-space-sm">
<span className="font-display-lg-mobile text-display-lg-mobile font-serif italic text-secondary w-6 text-center">2</span>
<div className="w-11 h-11 rounded-full overflow-hidden bg-surface-variant ring-2 ring-secondary/30">
<img className="w-full h-full object-cover" data-alt="High fantasy wizard portrait with silver hair and glowing blue eyes avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOxK76cXX__vpPL8EzsyohHUtYJ-gQ-RdDMQpUzNTsUtVRDoyQwBavLXzSo0Sh1gt9PtWbmwLl7nBLRGHR1hlOrfYRu5AAekJ9uuwGRhrERVndwzh0BA5tXqfoMDgPe8gTYs7aogVLhM_KTce5dE10Dgbwn7JkKBBb9dWqSh4MY2UOucxtCmiNIPoN-gLE5zuk0X1sfqVmiQEsLfH-FxnZWL_L6ISB2jpJVWB7AxB2Fuzsx0UvY42W7w"/>
</div>
<div>
<div className="flex items-center gap-1.5">
<h4 className="font-headline-sm text-headline-sm text-on-surface leading-none">LadyCinder</h4>
<span className="px-1.5 py-0.5 rounded bg-secondary/20 text-secondary font-label-caps text-label-caps text-[9px]">LORE CHRONICLER</span>
</div>
<span className="font-label-mono text-label-mono text-outline">14,120 Verified Revisions</span>
</div>
</div>
<span className="font-label-mono text-label-mono text-tertiary font-bold">+3,190 pts</span>
</div>
{/*  Rank 3  */}
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low shadow-sm">
<div className="flex items-center gap-space-sm">
<span className="font-display-lg-mobile text-display-lg-mobile font-serif italic text-tertiary w-6 text-center">3</span>
<div className="w-11 h-11 rounded-full overflow-hidden bg-surface-variant ring-2 ring-tertiary/30">
<img className="w-full h-full object-cover" data-alt="Dark fantasy armored knight profile avatar with golden rim lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQJDagjYb3NjA9mkMMMT-yxlWQe9Gy6JpP064Li3EzmuzN_iybaLyTYO5JwSMXlHMwQHVl_0HGfYoy1iDgwRX0K_XUbOZCqsdOiKxlqjFntQCS7_8EvdvVK_C7gFW5h_orR3lZ8IqkVmwPN5FmtTSOAXYKp5sFjFTWOJoTPNdn3vBKpxNvRau6QExAwXuuPwhx5RnrKWiTcbBxJr0vkQssFdgwRdMoHiancSM-XiTaYZ7TRom1U_PDA"/>
</div>
<div>
<div className="flex items-center gap-1.5">
<h4 className="font-headline-sm text-headline-sm text-on-surface leading-none">VaelinAlSor</h4>
<span className="px-1.5 py-0.5 rounded bg-tertiary/20 text-tertiary font-label-caps text-label-caps text-[9px]">SCHOLAR</span>
</div>
<span className="font-label-mono text-label-mono text-outline">11,040 Verified Revisions</span>
</div>
</div>
<span className="font-label-mono text-label-mono text-tertiary font-bold">+2,410 pts</span>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-md bg-surface-container-high/40 rounded-lg p-space-sm flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Want to claim archivist status?</span>
<button className="px-space-md py-1 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors">
              Read Guidelines
            </button>
</div>
</div>
</div>
</div>
</section>
  );
}
