'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReadingItem {
  pageTitle: string; pageSlug: string; coverImage?: string; wikiName: string; wikiSlug: string; lastReadAt: string;
}
interface Contributions {
  wikis: { _id: string; name: string; slug: string; status: string; coverImage?: string; reviewNote?: string }[];
  pages: { _id: string; title: string; slug: string; status: string; coverImage?: string; reviewNote?: string; wiki: { slug: string } }[];
  revisions: { _id: string; title: string; status: string; createdAt: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-background-tertiary text-foreground-muted',
  pending: 'bg-accent-muted text-accent',
  approved: 'bg-[var(--tag-green-bg,theme(colors.emerald.500/0.15))] text-[var(--tag-green,theme(colors.emerald.600))]',
  published: 'bg-[var(--tag-green-bg,theme(colors.emerald.500/0.15))] text-[var(--tag-green,theme(colors.emerald.600))]',
  rejected: 'bg-[var(--tag-red-bg)] text-[var(--tag-red)]',
};

export default function AccountDashboard() {
  const [reading, setReading] = useState<ReadingItem[]>([]);
  const [contributions, setContributions] = useState<Contributions | null>(null);

  useEffect(() => {
    fetch('/api/account/reading-progress').then((r) => r.json()).then(({ items }) => setReading(items ?? []));
    fetch('/api/account/contributions').then((r) => r.json()).then(setContributions);
  }, []);

  return (
    <div className="container py-10 space-y-12">
      <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Continue Reading</h2>
        {reading.length === 0 ? (
          <p className="text-foreground-muted">Pages you read will show up here.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reading.map((item) => (
              <Link key={`${item.wikiSlug}-${item.pageSlug}`} href={`/wiki/${item.wikiSlug}/${item.pageSlug}`} className="card overflow-hidden group">
                <div className="aspect-video bg-background-tertiary overflow-hidden relative">
                  {item.coverImage && (
                    <Image src={item.coverImage} alt={item.pageTitle} fill className="object-cover group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-accent">{item.wikiName}</p>
                  <h3 className="font-semibold text-foreground text-sm">{item.pageTitle}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">My Contributions</h2>
        {!contributions || (contributions.wikis.length === 0 && contributions.pages.length === 0 && contributions.revisions.length === 0) ? (
          <p className="text-foreground-muted">Wikis and pages you create or edit will show up here with their review status.</p>
        ) : (
          <div className="space-y-2">
            {contributions.wikis.map((w) => (
              <div key={w._id} className="card p-3 flex items-center justify-between">
                <span className="text-foreground">{w.name} <span className="text-foreground-muted text-xs">(wiki)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[w.status]}`}>{w.status}</span>
              </div>
            ))}
            {contributions.pages.map((p) => (
              <div key={p._id} className="card p-3 flex items-center justify-between">
                <span className="text-foreground">{p.title} <span className="text-foreground-muted text-xs">(page)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[p.status]}`}>{p.status}</span>
              </div>
            ))}
            {contributions.revisions.map((r) => (
              <div key={r._id} className="card p-3 flex items-center justify-between">
                <span className="text-foreground">{r.title} <span className="text-foreground-muted text-xs">(edit)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
