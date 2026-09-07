'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SitePage { _id: string; title: string; siteSlug: string; status: string; updatedAt: string; }

export default function SitePagesList() {
  const [pages, setPages] = useState<SitePage[]>([]);
  useEffect(() => {
    fetch('/api/admin/site-pages').then((r) => r.json()).then(({ pages }) => setPages(pages ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Site Pages</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <Link key={p._id} href={`/admin/pages/site/${p._id}/edit`} className="card p-4 hover:border-accent">
            <h3 className="font-semibold text-foreground">{p.title}</h3>
            <p className="text-xs text-foreground-muted mt-1">/{p.siteSlug} · {p.status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
