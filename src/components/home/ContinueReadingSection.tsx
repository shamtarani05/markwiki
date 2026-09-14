// @ts-nocheck
import Link from 'next/link';
import type { HomepageSectionSettings } from '@/src/lib/db/homepageSections';

export default function ContinueReadingSection({ settings, items }: { settings, items?: HomepageSectionSettings | any }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full bg-surface-container-lowest py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin-sm md:px-margin lg:px-margin-lg">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl">history_toggle_off</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{settings?.title || "Pick up where you left off"}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {items.map((item: any, index: number) => (
            <div key={item.id || index} className="group p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex gap-space-md shadow-sm border border-outline-variant/30">
              <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-variant relative shadow-md">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} src={item.image}/>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <h4 className="font-label-mono text-label-mono text-secondary truncate mb-0.5">{item.type?.toUpperCase() || 'STORY'}</h4>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {item.title} {item.chapter && <span className="text-on-surface-variant font-normal text-sm block mt-0.5">{item.chapter}</span>}
                  </h3>
                </div>
                <div className="mt-space-sm">
                  <div className="w-full h-1.5 rounded-full bg-surface-variant overflow-hidden mb-space-sm">
                    <div className="h-full bg-gradient-to-r from-secondary to-primary-container rounded-full" style={{width: `${item.progress}%`}}></div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-label-mono text-label-mono text-outline truncate flex-shrink">Last read {item.lastRead}</span>
                    <button className="flex-shrink-0 px-3 py-1 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm transition-all flex items-center gap-1">
                      <span>Resume</span>
                      <span className="material-symbols-outlined text-xs">play_arrow</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
