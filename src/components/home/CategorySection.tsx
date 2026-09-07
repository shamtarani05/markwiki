'use client';

import Link from 'next/link';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  description: string;
  image: string;
  color: string;
}

export default function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="section-subtitle">Browse by Type</span>
          <h2 className="section-title">Explore Wiki Categories</h2>
          <p className="text-foreground-muted mt-3 max-w-2xl mx-auto">
            Dive into comprehensive wikis across anime, games, web novels, and more
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent hover:shadow-lg h-[200px]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} via-card/90 to-card/70`} />
              </div>

              <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                <span className="text-4xl mb-2">{category.icon}</span>
                <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-accent transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-foreground-muted mb-1">{category.description}</p>
                <p className="text-sm text-accent font-medium">{category.count.toLocaleString()} wikis</p>
              </div>

              <svg
                className="absolute bottom-4 right-4 w-5 h-5 text-foreground-muted opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link href="/categories" className="btn btn-secondary">
            Browse All Categories
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
