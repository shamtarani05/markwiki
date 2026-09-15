'use client';

import Link from 'next/link';

export interface Update {
  id: string;
  title: string;
  type: 'news' | 'wiki-update' | 'community' | 'announcement' | 'blog' | 'story';
  author: string;
  excerpt: string;
  date: string;
  readTime: number;
  featured: boolean;
  image: string;
  wiki?: string;
  url?: string;
}

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  'news': { bg: 'bg-[var(--tag-blue-bg)]', text: 'text-[var(--tag-blue)]', label: 'News' },
  'wiki-update': { bg: 'bg-[var(--tag-green-bg)]', text: 'text-[var(--tag-green)]', label: 'Wiki Update' },
  'community': { bg: 'bg-[var(--tag-purple-bg)]', text: 'text-[var(--tag-purple)]', label: 'Community' },
  'announcement': { bg: 'bg-[var(--tag-yellow-bg)]', text: 'text-[var(--tag-yellow)]', label: 'Announcement' },
  'blog': { bg: 'bg-[var(--tag-blue-bg)]', text: 'text-[var(--tag-blue)]', label: 'Blog' },
  'story': { bg: 'bg-[var(--tag-purple-bg)]', text: 'text-[var(--tag-purple)]', label: 'Story' },
};

export default function CommunitySection({ updates }: { updates: Update[] }) {
  const featuredPost = updates.find(p => p.featured);
  const otherPosts = updates.filter(p => !p.featured);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="section-subtitle">Stay Updated</span>
            <h2 className="section-title">Community News</h2>
          </div>
          <Link href="/news" className="btn btn-secondary hidden sm:flex">
            All Updates
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {updates.length === 0 ? (
          <p className="text-on-surface-variant text-center py-8">No community updates yet — check back soon.</p>
        ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          {featuredPost && (
            <Link href={featuredPost.url || `/news/${featuredPost.id}`} className="group rounded-xl bg-surface-container-low shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col h-full backdrop-blur-sm overflow-hidden lg:row-span-2">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 ${typeColors[featuredPost.type].bg} ${typeColors[featuredPost.type].text} rounded-full text-xs font-medium border border-accent/20`}>
                    {typeColors[featuredPost.type].label}
                  </span>
                  {featuredPost.wiki && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {featuredPost.wiki}
                    </span>
                  )}
                  <span className="text-on-surface-variant text-sm">{featuredPost.readTime} min read</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-on-surface-variant mb-4 flex-1">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
                  <p className="text-sm font-medium text-on-surface">
                    {featuredPost.author}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {new Date(featuredPost.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Other Posts */}
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <Link key={post.id} href={post.url || `/news/${post.id}`} className="group p-4 rounded-xl bg-surface-container-low shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/50 transition-all flex gap-4 backdrop-blur-sm items-start">
                <div className="w-28 h-28 shrink-0 relative rounded-lg overflow-hidden border border-outline-variant/20">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 ${typeColors[post.type].bg} ${typeColors[post.type].text} rounded text-xs font-medium`}>
                      {typeColors[post.type].label}
                    </span>
                    {post.wiki && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.wiki}
                      </span>
                    )}
                    <span className="text-on-surface-variant text-xs">{post.readTime} min</span>
                  </div>
                  <h3 className="font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/news" className="btn btn-secondary">
            View All Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
