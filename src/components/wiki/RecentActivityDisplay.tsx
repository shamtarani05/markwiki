'use client';

import Link from 'next/link';

interface ActivityItem {
  _id: string;
  title: string;
  editSummary?: string;
  editorName: string;
  createdAt: string;
  pageSlug?: string;
}

export default function RecentActivityDisplay({ wikiSlug, items }: { wikiSlug: string; items: ActivityItem[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-on-surface mb-4">Recent Activity</h2>
      <div className="card divide-y divide-border">
        {items.map((item) => (
          <div key={item._id} className="p-4 flex items-start justify-between">
            <div>
              {item.pageSlug ? (
                <Link href={`/wiki/${wikiSlug}/${item.pageSlug}`} className="font-medium text-on-surface hover:text-primary transition-colors">
                  {item.title}
                </Link>
              ) : (
                <span className="font-medium text-on-surface">{item.title}</span>
              )}
              {item.editSummary && <p className="text-sm text-on-surface-variant mt-1">{item.editSummary}</p>}
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-sm text-primary">{item.editorName}</p>
              <p className="text-xs text-on-surface-variant">{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
