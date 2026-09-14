import { notFound } from 'next/navigation';
import connectDB from '@/src/lib/db/connection';
import { Category, Wiki } from '@/src/lib/db/models';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  const category = await Category.findOne({ slug }).lean();
  if (!category) return notFound();

  const wikis = await Wiki.find({ category: category._id, status: 'approved' }).lean();

  return (
    <main className="min-h-screen bg-surface-container-lowest pt-32 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-12">
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-[0.25em] block mb-2">DOMAIN</span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">{category.name}</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wikis.map((wiki: any) => (
            <Link key={wiki._id.toString()} href={`/wiki/${wiki.slug}`} className="group p-6 rounded-xl bg-surface-container-low shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col h-full">
              {wiki.coverImage && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                  <img src={wiki.coverImage} alt={wiki.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <h2 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{wiki.name}</h2>
              {wiki.description && <p className="text-on-surface-variant mt-2 line-clamp-2">{wiki.description}</p>}
              <div className="mt-auto pt-4 flex items-center justify-between text-sm text-outline">
                <span>{wiki.pageCount || 0} Pages</span>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
          {wikis.length === 0 && (
            <div className="col-span-full py-12 text-center bg-surface-container rounded-xl border border-outline-variant/30">
              <p className="text-on-surface-variant text-lg">No wikis exist in this domain yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
