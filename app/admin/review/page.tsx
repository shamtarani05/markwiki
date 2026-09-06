'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReviewItem {
  kind: 'wiki' | 'page' | 'revision';
  id: string;
  title: string;
  submittedBy?: string;
  updatedAt: string;
}

export default function ReviewQueuePage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/review').then((r) => r.json()).then(({ items }) => setItems(items ?? [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const decide = async (item: ReviewItem, decision: 'approve' | 'decline') => {
    setBusyId(item.id);
    try {
      await fetch(`/api/admin/review/${item.kind}/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-foreground-muted">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Review Queue</h1>
      {items.length === 0 ? (
        <p className="text-foreground-muted">Nothing pending review.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wide text-accent font-medium">{item.kind}</span>
                <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                <p className="text-xs text-foreground-muted">
                  {item.submittedBy ?? 'Unknown'} · {new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/preview/${item.kind}/${item.id}`} className="btn btn-secondary text-sm py-1.5" target="_blank">
                  Preview
                </Link>
                <button disabled={busyId === item.id} onClick={() => decide(item, 'approve')} className="btn btn-primary text-sm py-1.5 disabled:opacity-60">
                  Approve
                </button>
                <button disabled={busyId === item.id} onClick={() => decide(item, 'decline')} className="btn btn-secondary text-sm py-1.5 disabled:opacity-60">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
