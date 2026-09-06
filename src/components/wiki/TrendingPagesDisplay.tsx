'use client';

import Link from 'next/link';

interface TrendingPage {
  _id: string;
  slug: string;
  pageType: string;
  title: string;
  viewCount: number;
  searchCount: number;
}

export default function TrendingPagesDisplay({ wikiSlug, pages }: { wikiSlug: string; pages: TrendingPage[] }) {
  if (pages.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-4">🔥 Trending Pages</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <Link key={page._id} href={`/wiki/${wikiSlug}/${page.slug}`} className="card p-4 hover:border-accent group">
            <span className="text-xs text-accent font-medium capitalize">{page.pageType}</span>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mt-1">{page.title}</h3>
            <p className="text-sm text-foreground-muted mt-1">
              {page.viewCount.toLocaleString()} views
              {page.searchCount > 0 && ` · ${page.searchCount.toLocaleString()} searches`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
