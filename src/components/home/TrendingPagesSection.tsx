'use client';

import Link from 'next/link';

interface WikiPage {
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

const trendingPages: WikiPage[] = [
  {
    id: '1',
    title: 'Sung Jin-Woo',
    wiki: 'Solo Leveling',
    wikiSlug: 'solo-leveling',
    excerpt: 'Sung Jin-Woo is the main protagonist of Solo Leveling. Originally the weakest Hunter in all of Korea, he became a "Player" after surviving...',
    views: 45230,
    edits: 156,
    category: 'Character',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop&q=80',
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    title: 'Domain Expansion',
    wiki: 'Jujutsu Kaisen',
    wikiSlug: 'jujutsu-kaisen',
    excerpt: 'Domain Expansion is a technique where the user creates a pocket dimension using cursed energy. It is considered the pinnacle of jujutsu...',
    views: 38456,
    edits: 89,
    category: 'Ability',
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=300&fit=crop&q=80',
    lastUpdated: '5 hours ago',
  },
  {
    id: '3',
    title: 'Klein Moretti',
    wiki: 'Lord of the Mysteries',
    wikiSlug: 'lord-of-the-mysteries',
    excerpt: 'Klein Moretti, born Zhou Mingrui, is the main protagonist. A transmigrator from Earth who finds himself in a Victorian-era world filled with...',
    views: 28934,
    edits: 234,
    category: 'Character',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop&q=80',
    lastUpdated: '1 day ago',
  },
  {
    id: '4',
    title: 'Elden Beast',
    wiki: 'Elden Ring',
    wikiSlug: 'elden-ring',
    excerpt: 'The Elden Beast is the true final boss of Elden Ring. It is the physical form of the Elden Ring itself, sent to the Lands Between by the Greater Will...',
    views: 67890,
    edits: 312,
    category: 'Boss',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&q=80',
    lastUpdated: '3 hours ago',
  },
];

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

export default function TrendingPagesSection() {
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
        <div className="grid md:grid-cols-2 gap-6">
          {trendingPages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>

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
