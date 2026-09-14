// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function PublishCTASection({ settings }: { settings?: HomepageSectionSettings | any }) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl">
<div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg flex flex-col gap-space-xl">
{/*  Random Lore Rolling Card  */}
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high p-space-xl shadow-2xl">
<div className="absolute -right-12 -bottom-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-space-lg">
<div className="flex items-center gap-space-md">
<div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-lg">
<span className="material-symbols-outlined text-3xl">casino</span>
</div>
<div>
<span className="font-label-caps text-label-caps uppercase tracking-widest text-primary">Serendipitous Exploration</span>
<h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mt-0.5">
                Don&apos;t know what to explore?
              </h3>
<p className="font-body-default text-body-default text-on-surface-variant mt-1 max-w-xl">
                Dive headfirst into an obscure corner of fiction. Let our algorithmic dice drop you directly inside one of 482,000+ deep lore entries.
              </p>
</div>
</div>
<Link href="/trending" className="w-full md:w-auto shrink-0 px-space-xl py-space-md rounded-xl bg-surface-bright hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-space-xs active:scale-95">
<span className="material-symbols-outlined text-xl">shuffle</span>
<span>Roll Random Lore Page</span>
</Link>
</div>
</div>
{/*  Massive Publish & Curate Call To Action  */}
<div className="relative rounded-2xl bg-surface-container-lowest overflow-hidden shadow-2xl p-space-xl lg:p-space-2xl flex flex-col items-center text-center">
{/*  Ambient Backdrop Gradients  */}
<div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-surface-container-low to-surface-container-lowest pointer-events-none"></div>
<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/20 blur-[130px] rounded-full pointer-events-none"></div>
<div className="relative z-10 max-w-3xl flex flex-col items-center">
<span className="font-label-mono text-label-mono text-tertiary uppercase tracking-[0.25em] mb-space-sm">
            CONTRIBUTE TO HUMAN FICTION HERITAGE
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            {settings?.title || "Know something worth remembering?"}
          </h2>
<p className="font-body-editorial text-body-editorial text-on-surface-variant mt-space-sm max-w-2xl">
            Build a page. Share serialized fan fiction. Annotate the canon. Keep your beloved universe alive for future generations of lore-masters.
          </p>
<div className="flex flex-col sm:flex-row items-center gap-space-md mt-space-xl w-full sm:w-auto">
<Link className="w-full sm:w-auto px-space-xl py-space-sm rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-caps text-label-caps uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(160,120,255,0.4)] flex items-center justify-center gap-space-xs active:scale-95" href="/admin/wiki/new">
<span className="material-symbols-outlined text-lg">post_add</span>
<span>Create a Wiki</span>
</Link>
<Link className="w-full sm:w-auto px-space-xl py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-space-xs" href="/admin/short-stories">
<span className="material-symbols-outlined text-lg">history_edu</span>
<span>Publish a Story</span>
</Link>
</div>
{/*  Minimalist Newsletter Dispatch Subscription  */}
<div className="w-full max-w-md mt-space-2xl pt-space-xl">
<div className="flex items-center justify-between mb-2">
<span className="font-label-caps text-label-caps uppercase text-outline">The Lore Dispatch</span>
<span className="font-label-mono text-label-mono text-secondary">Weekly Digest</span>
</div>
<form action="#" className="relative flex items-center bg-surface-container rounded-xl p-1 shadow-md">
<input name="email" className="w-full bg-transparent px-space-md py-space-xs text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none" placeholder="Enter your email to stay in the loop..." type="email"/>
<button type="submit" className="px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider shrink-0 hover:bg-primary-container transition-all">
                Join
              </button>
</form>
<span className="font-label-mono text-label-mono text-outline block text-center mt-2">Zero spam. Pure fictional analysis curated by Grand Archivists.</span>
</div>
</div>
</div>
</div>
    </section>
  );
}
