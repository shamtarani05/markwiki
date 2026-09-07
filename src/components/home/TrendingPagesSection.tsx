'use client';

import Link from 'next/link';

export interface WikiPage {
  id: string;
  title: string;
  wiki: string;
  wikiSlug: string;
  excerpt: string;
  views: number;
  edits: number;
  category: string;
  image: string;
  lastUpdated: string;
}

const categoryColors: Record<string, string> = {
  'Character': 'badge-blue',
  'Ability': 'badge-purple',
  'Boss': 'badge-red',
  'Location': 'badge-green',
  'Item': 'badge-yellow',
};

function PageCard({ page }: { page: WikiPage }) {
  return (
    <Link href={`/wiki/${page.wikiSlug}/${page.id}`} className="card group overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative shrink-0 overflow-hidden">
          <img
            src={page.image}
            alt={page.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[page.category] || 'badge-gray'}`}>
              {page.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1">
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/wiki/${page.wikiSlug}`}
              className="text-accent text-sm font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {page.wiki}
            </Link>
            <span className="text-foreground-muted text-xs">{page.lastUpdated}</span>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
            {page.title}
          </h3>

          <p className="text-foreground-muted mb-4 line-clamp-2 text-sm">
            {page.excerpt}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-foreground-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{page.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1 text-foreground-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{page.edits} edits</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function TrendingPagesSection({ pages }: { pages: WikiPage[] }) {
  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="section-subtitle">Hot Right Now</span>
            <h2 className="section-title">Trending Wiki Pages</h2>
          </div>
          <Link href="/trending" className="btn btn-secondary hidden sm:flex">
            View All Trending
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Pages Grid */}
        {pages.length === 0 ? (
          <p className="text-foreground-muted text-center py-8">No trending pages yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pages.map((page) => (
              <PageCard key={`${page.wikiSlug}/${page.id}`} page={page} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/trending" className="btn btn-secondary">
            View All Trending
          </Link>
        </div>
      </div>
    </section>
  );
}
