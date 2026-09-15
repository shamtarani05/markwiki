'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface RevisionRow {
  _id: string;
  version: number;
  title: string;
  editSummary?: string;
  editedBy?: { name?: string; email?: string };
  createdAt: string;
}

export default function PageHistory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [revisions, setRevisions] = useState<RevisionRow[] | null>(null);
  const [rollingBack, setRollingBack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch(`/api/admin/pages/${id}/revisions`)
      .then((r) => r.json())
      .then(({ revisions }) => setRevisions(revisions))
      .catch(() => setError('Failed to load history'));
  };

  useEffect(load, [id]);

  const rollback = async (revisionId: string) => {
    if (!window.confirm('Restore the page to this version? The current version will be saved to history first, so this can be undone.')) {
      return;
    }
    setRollingBack(revisionId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pages/${id}/revisions/${revisionId}/rollback`, { method: 'POST' });
      if (!res.ok) throw new Error('Rollback failed');
      load();
    } catch {
      setError('Rollback failed');
    } finally {
      setRollingBack(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#F5F3EF]">Edit History</h1>
        <Link href={`/admin/wiki/${id}/edit`} className="btn btn-secondary">Back to editor</Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-red-bg)] text-[var(--tag-red)] text-sm">{error}</div>
      )}

      {revisions === null ? (
        <p className="text-[#706F78]">Loading…</p>
      ) : revisions.length === 0 ? (
        <p className="text-[#706F78]">No edits yet — history starts after the first save to this page.</p>
      ) : (
        <div className="card divide-y divide-[rgba(255,255,255,0.09)] overflow-hidden">
          {revisions.map((rev) => (
            <div key={rev._id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#F5F3EF]">
                  v{rev.version} · {rev.title}
                </p>
                <p className="text-xs text-[#706F78] mt-0.5">
                  {new Date(rev.createdAt).toLocaleString()} by {rev.editedBy?.name ?? 'Unknown'}
                </p>
                {rev.editSummary && (
                  <p className="text-xs text-[#706F78] mt-1 italic">&ldquo;{rev.editSummary}&rdquo;</p>
                )}
              </div>
              <button
                type="button"
                disabled={rollingBack === rev._id}
                onClick={() => rollback(rev._id)}
                className="btn btn-secondary shrink-0 disabled:opacity-60"
              >
                {rollingBack === rev._id ? 'Restoring…' : 'Restore this version'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
