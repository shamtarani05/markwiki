'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Inbox, ExternalLink } from 'lucide-react';

interface ReviewItem {
  kind: 'wiki' | 'page' | 'revision';
  id: string;
  title: string;
  submittedBy?: string;
  updatedAt: string;
}

// What the contributor actually did, named the way an admin would say it —
// not the record type the queue happens to be built from.
const KIND_LABEL: Record<ReviewItem['kind'], string> = {
  wiki: 'New wiki',
  page: 'New page',
  revision: 'Page edit',
};

const KIND_BADGE: Record<ReviewItem['kind'], string> = {
  wiki: 'badge-purple',
  page: 'badge-blue',
  revision: 'badge-yellow',
};

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

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Review queue</h1>
          <p className="admin-subtitle">
            {loading
              ? 'Checking for contributions…'
              : items.length === 0
                ? 'Contributions from readers land here before they go live.'
                : `${items.length} contribution${items.length === 1 ? '' : 's'} waiting on you.`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1].map((i) => (
            <div key={i} className="admin-panel h-[74px] opacity-40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <Inbox size={22} className="mx-auto text-on-surface-variant mb-3" aria-hidden="true" />
          <p className="text-[13px] text-on-surface mb-1">Nothing waiting</p>
          <p className="admin-meta">
            When a reader submits a wiki, a page or an edit, it appears here for you to preview and decide on.
          </p>
        </div>
      ) : (
        // The only raised surface in the admin portal: elevation plus an accent
        // rail marks the one thing that is genuinely blocked on the admin.
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.kind}-${item.id}`}
              className="admin-raised flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`admin-chip ${KIND_BADGE[item.kind]}`}>{KIND_LABEL[item.kind]}</span>
                </div>
                <h2 className="text-[15px] font-semibold text-on-surface truncate">{item.title}</h2>
                <p className="admin-meta mt-0.5 truncate">
                  {item.submittedBy ?? 'Unknown contributor'}
                  <span aria-hidden="true" className="inline-block w-px h-3 align-middle bg-border mx-2" />
                  <span className="admin-num">{new Date(item.updatedAt).toLocaleString()}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/preview/${item.kind}/${item.id}`}
                  className="btn btn-secondary text-[13px] py-1.5 px-3 no-underline"
                  target="_blank"
                >
                  Preview <ExternalLink size={13} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => decide(item, 'approve')}
                  className="btn btn-primary text-[13px] py-1.5 px-3 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => decide(item, 'decline')}
                  className="btn btn-secondary text-[13px] py-1.5 px-3 disabled:opacity-60"
                >
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
