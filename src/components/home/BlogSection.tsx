'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: string;
  featured: boolean;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of World-Building: Creating Immersive Fantasy Realms',
    author: 'Emily Watson',
    excerpt: 'Learn the secrets behind crafting believable fantasy worlds that captivate readers and stand the test of time.',
    date: '2024-01-15',
    readTime: 8,
    category: 'Writing Tips',
    featured: true,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop&q=80',
  },
  {
    id: '2',
    title: '10 Books That Changed How I See the World',
    author: 'Marcus Lee',
    excerpt: 'A curated list of transformative reads that offer fresh perspectives on life, society, and human nature.',
    date: '2024-01-12',
    readTime: 6,
    category: 'Book Lists',
    featured: false,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop&q=80',
  },
  {
    id: '3',
    title: 'From Reader to Writer: My Publishing Journey',
    author: 'Anna Rodriguez',
    excerpt: 'How I went from devouring books to writing my own bestseller—the challenges, lessons, and breakthroughs.',
    date: '2024-01-10',
    readTime: 10,
    category: 'Author Stories',
    featured: false,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&q=80',
  },
];

export default function BlogSection() {
  const featuredPost = blogPosts.find(p => p.featured);
  const otherPosts = blogPosts.filter(p => !p.featured);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="section-subtitle">Insights & Updates</span>
            <h2 className="section-title">From Our Blog</h2>
          </div>
          <Link href="/blogs" className="btn btn-secondary hidden sm:flex">
            All Articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.id}`} className="card group lg:row-span-2 overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="text-on-surface-variant text-sm">{featuredPost.readTime} min read</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-on-surface-variant mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-on-surface-variant">
                    by <span className="text-on-surface">{featuredPost.author}</span>
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
          <div className="space-y-6">
            {otherPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="card p-4 group flex gap-4 overflow-hidden">
                <div className="w-24 h-24 shrink-0 relative rounded-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                      {post.category}
                    </span>
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

        {/* Mobile View All */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/blogs" className="btn btn-secondary">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
