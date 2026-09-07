import Image from 'next/image';
import Link from 'next/link';

export interface ReadingItem {
  pageTitle: string;
  pageSlug: string;
  coverImage?: string;
  wikiName: string;
  wikiSlug: string;
  lastReadAt: string;
}

export default function ContinueReadingSection({
  items,
  heading = 'Continue Reading',
}: {
  items: ReadingItem[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-4">{heading}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={`${item.wikiSlug}-${item.pageSlug}`}
            href={`/wiki/${item.wikiSlug}/${item.pageSlug}`}
            className="card overflow-hidden group"
          >
            <div className="aspect-video bg-background-tertiary overflow-hidden relative">
              {item.coverImage && (
                <Image
                  src={item.coverImage}
                  alt={item.pageTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-accent">{item.wikiName}</p>
              <h3 className="font-semibold text-foreground text-sm">{item.pageTitle}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
