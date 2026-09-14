'use client';

import { useEffect, useState } from 'react';
import { ContinueReadingSection, type ReadingItem } from '@/src/components/home';

interface Contributions {
  wikis: { _id: string; name: string; slug: string; status: string; coverImage?: string; reviewNote?: string }[];
  pages: { _id: string; title: string; slug: string; status: string; coverImage?: string; reviewNote?: string; wiki: { slug: string } }[];
  revisions: { _id: string; title: string; status: string; createdAt: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-surface-variant text-on-surface-variant',
  pending: 'bg-primary-muted text-primary',
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
      <h1 className="text-3xl font-bold text-on-surface">Your Dashboard</h1>

      {reading.length === 0 ? (
        <section>
          <h2 className="text-xl font-bold text-on-surface mb-4">Continue Reading</h2>
          <p className="text-on-surface-variant">Pages you read will show up here.</p>
        </section>
      ) : (
        <ContinueReadingSection settings={{}} items={reading} />
      )}

      <section>
        <h2 className="text-xl font-bold text-on-surface mb-4">My Contributions</h2>
        {!contributions || (contributions.wikis.length === 0 && contributions.pages.length === 0 && contributions.revisions.length === 0) ? (
          <p className="text-on-surface-variant">Wikis and pages you create or edit will show up here with their review status.</p>
        ) : (
          <div className="space-y-2">
            {contributions.wikis.map((w) => (
              <div key={w._id} className="card p-3 flex items-center justify-between">
                <span className="text-on-surface">{w.name} <span className="text-on-surface-variant text-xs">(wiki)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[w.status]}`}>{w.status}</span>
              </div>
            ))}
            {contributions.pages.map((p) => (
              <div key={p._id} className="card p-3 flex items-center justify-between">
                <span className="text-on-surface">{p.title} <span className="text-on-surface-variant text-xs">(page)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[p.status]}`}>{p.status}</span>
              </div>
            ))}
            {contributions.revisions.map((r) => (
              <div key={r._id} className="card p-3 flex items-center justify-between">
                <span className="text-on-surface">{r.title} <span className="text-on-surface-variant text-xs">(edit)</span></span>
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
