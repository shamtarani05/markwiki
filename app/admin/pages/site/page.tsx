'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Files } from 'lucide-react';

interface SitePage { _id: string; title: string; siteSlug: string; status: string; updatedAt: string; }

const STATUS_BADGE: Record<string, string> = {
  draft: 'badge-yellow',
  published: 'badge-green',
  archived: 'badge-gray',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

export default function SitePagesList() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/site-pages')
      .then((r) => r.json())
      .then(({ pages }) => setPages(pages ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Site pages</h1>
          <p className="admin-subtitle">
            Standalone pages such as About, published at the top level of the site.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="admin-panel h-[104px] opacity-40" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="admin-empty">
          <Files size={22} className="mx-auto text-on-surface-variant mb-3" aria-hidden="true" />
          <p className="text-[13px] text-on-surface mb-1">No site pages yet</p>
          <p className="admin-meta">
            Site pages are built with the same editor as wiki pages, but sit outside any wiki.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((p) => (
            <Link
              key={p._id}
              href={`/admin/pages/site/${p._id}/edit`}
              className="admin-tile no-underline group p-4 flex flex-col gap-3"
            >
              <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                  {p.title}
                </h2>
                {/* The slug is a literal URL the admin will type or share, so it
                    is set in the mono face — the one machine value on the screen. */}
                <p className="font-mono text-[11.5px] text-on-surface-variant mt-1 truncate">/{p.siteSlug}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2">
                <span className={`admin-chip ${STATUS_BADGE[p.status] ?? 'badge-gray'}`}>
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
                <span className="admin-meta admin-num">{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
