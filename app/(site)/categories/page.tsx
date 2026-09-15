import Link from 'next/link';
import { Category } from '@/src/lib/db/models';
import connectDB from '@/src/lib/db/connection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | MarcWiki',
  description: 'Browse all categories and universes on MarcWiki.',
};

export default async function CategoriesDirectoryPage() {
  await connectDB();
  
  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-20">
      <div className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden border-b border-outline-variant/30 mb-10 bg-surface-container-lowest">
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-primary/30 via-secondary-container/20 to-transparent blur-[140px] rounded-full"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(160,120,255,0.12),transparent)] pointer-events-none"></div>

        <div className="container max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-display-xl text-on-surface mb-4 drop-shadow-sm tracking-tight text-balance">
            Categories
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body-editorial bg-surface-container-high/50 backdrop-blur-xl py-4 px-6 rounded-2xl border border-outline-variant/30 shadow-xl mx-auto inline-block">
            Explore different universes, genres, and themes.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl">
        {categories.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any) => (
              <Link 
                key={category._id.toString()} 
                href={`/category/${category.slug}`} 
                className="group p-6 rounded-xl bg-surface-container-low shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col h-full backdrop-blur-sm"
              >
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-surface-variant">
                  {category.image && (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{category.name}</h2>
                </div>
                {category.description && <p className="text-on-surface-variant line-clamp-2">{category.description}</p>}
                
                <div className="mt-auto pt-4 text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform text-sm">
                  Explore <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
