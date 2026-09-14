// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function RecentActivitySection({ settings, activity, contributors }: { settings?: HomepageSectionSettings | any, activity?: any, contributors?: any }) {
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
  {activity?.map((item: any, index: number) => (
    <div key={item.id || index} className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-md shadow-sm">
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-variant flex items-center justify-center bg-primary-container text-on-primary-container font-headline-sm">
        {item.userAvatar ? (
          <img alt={item.user} className="w-full h-full object-cover" src={item.userAvatar}/>
        ) : (
          item.user.charAt(0)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-space-xs">
          <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">{item.user}</span>
          <span className="font-label-mono text-label-mono text-outline">{item.time}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
          {item.action === 'updated' ? 'Edited ' : item.action === 'created' ? 'Created ' : item.action === 'approved' ? 'Approved ' : item.action === 'commented on' ? 'Commented on ' : 'Reverted '}
          <Link className="text-secondary hover:underline font-medium" href="#">"{item.target}"</Link> in <span className="text-on-surface-variant">{item.wiki}</span>
        </p>
        <div className="flex items-center gap-space-sm mt-1.5 font-label-mono text-label-mono">
          <span className="text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded flex items-center gap-1"><span className="material-symbols-outlined text-xs">{item.icon}</span> {item.tag}</span>
        </div>
      </div>
    </div>
  ))}
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
  {contributors?.map((contributor: any, index: number) => {
    const isTop = index === 0;
    const isSecond = index === 1;
    const isThird = index === 2;
    const colorClass = isTop ? 'primary' : isSecond ? 'secondary' : 'tertiary';
    
    return (
      <div key={contributor.id || index} className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low shadow-sm">
        <div className="flex items-center gap-space-sm">
          <span className={`font-display-lg-mobile text-display-lg-mobile font-serif italic text-${colorClass} w-6 text-center`}>{index + 1}</span>
          <div className={`w-11 h-11 rounded-full overflow-hidden bg-surface-variant ring-2 ring-${colorClass}/40`}>
            {contributor.userAvatar ? (
              <img className="w-full h-full object-cover" alt={contributor.user} src={contributor.userAvatar}/>
            ) : (
              <div className="w-full h-full flex items-center justify-center font-headline-sm">{contributor.user.charAt(0)}</div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-headline-sm text-headline-sm text-on-surface leading-none">{contributor.user}</h4>
              <span className={`px-1.5 py-0.5 rounded bg-${colorClass}/20 text-${colorClass} font-label-caps text-label-caps text-[9px]`}>{contributor.title}</span>
            </div>
            <span className="font-label-mono text-label-mono text-outline">{contributor.revisions}</span>
          </div>
        </div>
        <span className="font-label-mono text-label-mono text-tertiary font-bold">{contributor.points}</span>
      </div>
    );
  })}
</div>
</div>
<div className="mt-space-lg pt-space-md bg-surface-container-high/40 rounded-lg p-space-sm flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Want to claim archivist status?</span>
<Link href="/guidelines" className="px-space-md py-1 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors">
              Read Guidelines
            </Link>
</div>
</div>
</div>
</div>
</section>
  );
}
