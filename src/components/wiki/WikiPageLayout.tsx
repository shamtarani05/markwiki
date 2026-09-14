'use client';

import Link from 'next/link';
import { useState } from 'react';

interface InfoboxData {
  label: string;
  value: string;
}

interface Infobox {
  image: string;
  imageCaption?: string;
  title: string;
  type: string;
  data: InfoboxData[];
}

interface GalleryImage {
  src: string;
  caption: string;
}

interface WikiSection {
  id: string;
  title: string;
  content?: string;
  type?: 'gallery' | 'references';
  images?: GalleryImage[];
  subsections?: WikiSection[];
}

interface WikiPageData {
  id: string;
  title: string;
  wikiName: string;
  wikiSlug: string;
  lastEdited: string;
  lastEditedBy: string;
  views: number;
  quote?: {
    text: string;
    source: string;
    chapter?: string;
  };
  infobox: Infobox;
  sections: WikiSection[];
  categories: string[];
}

interface WikiPageLayoutProps {
  page: WikiPageData;
}

export default function WikiPageLayout({ page }: WikiPageLayoutProps) {
  const [tocOpen, setTocOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'read' | 'discussion' | 'history'>('read');

  // Generate TOC from sections
  const generateTOC = (sections: WikiSection[]) => {
    return sections.map((section, index) => ({
      id: section.id,
      title: section.title,
      number: `${index + 1}`,
      subsections: section.subsections?.map((sub, subIndex) => ({
        id: sub.id,
        title: sub.title,
        number: `${index + 1}.${subIndex + 1}`,
      })),
    }));
  };

  const toc = generateTOC(page.sections);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-16">
      {/* Wiki Header Bar */}
      <div className="border-b border-outline-variant/30 bg-surface-container-low">
        <div className="container">
          {/* Wiki Name & Navigation */}
          <div className="flex items-center justify-between py-2 text-sm">
            <Link href={`/wiki/${page.wikiSlug}`} className="text-primary hover:underline font-medium">
              {page.wikiName} Wiki
            </Link>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span>{page.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="border-b border-outline-variant/30 bg-surface-container-lowest">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Left Tabs */}
            <div className="flex">
              <button
                onClick={() => setActiveTab('read')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'read'
                    ? 'border-accent text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Page
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'discussion'
                    ? 'border-accent text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Discussion
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                Read
              </button>
              <button className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                View source
              </button>
              <button className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                View history
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="flex gap-6">
          {/* Main Article */}
          <article className="flex-1 min-w-0">
            {/* Page Title */}
            <header className="mb-6">
              <h1 className="text-4xl font-bold text-on-surface mb-2">{page.title}</h1>
              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <span>
                  Last edited by <Link href={`/user/${page.lastEditedBy}`} className="text-primary hover:underline">{page.lastEditedBy}</Link>
                </span>
                <span>•</span>
                <span>{new Date(page.lastEdited).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </header>

            {/* Quote (if exists) */}
            {page.quote && (
              <blockquote className="border-l-4 border-accent bg-surface-container-low p-4 mb-6 rounded-r-lg">
                <p className="text-lg italic text-on-surface mb-2">"{page.quote.text}"</p>
                <footer className="text-sm text-on-surface-variant">
                  — {page.quote.source}
                  {page.quote.chapter && <span>, {page.quote.chapter}</span>}
                </footer>
              </blockquote>
            )}

            {/* Content with Infobox */}
            <div className="flex gap-6">
              {/* Article Content */}
              <div className="flex-1 wiki-content">
                {/* Table of Contents */}
                <div className="card p-4 mb-6 bg-surface-container-low">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setTocOpen(!tocOpen)}
                  >
                    <h2 className="font-semibold text-on-surface">Contents</h2>
                    <button className="text-primary text-sm hover:underline">
                      [{tocOpen ? 'hide' : 'show'}]
                    </button>
                  </div>

                  {tocOpen && (
                    <nav className="mt-3">
                      <ol className="space-y-1 text-sm">
                        {toc.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => scrollToSection(item.id)}
                              className="text-primary hover:underline flex items-start gap-2"
                            >
                              <span className="text-on-surface-variant">{item.number}</span>
                              <span>{item.title}</span>
                            </button>
                            {item.subsections && (
                              <ol className="ml-6 mt-1 space-y-1">
                                {item.subsections.map((sub) => (
                                  <li key={sub.id}>
                                    <button
                                      onClick={() => scrollToSection(sub.id)}
                                      className="text-primary hover:underline flex items-start gap-2"
                                    >
                                      <span className="text-on-surface-variant">{sub.number}</span>
                                      <span>{sub.title}</span>
                                    </button>
                                  </li>
                                ))}
                              </ol>
                            )}
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}
                </div>

                {/* Sections */}
                {page.sections.map((section, index) => (
                  <WikiSection key={section.id} section={section} number={index + 1} />
                ))}

                {/* Categories */}
                <div className="mt-8 pt-6 border-t border-outline-variant/30">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-on-surface-variant text-sm">Categories:</span>
                    {page.categories.map((category) => (
                      <Link
                        key={category}
                        href={`/wiki/${page.wikiSlug}/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-2 py-0.5 text-sm bg-surface-container-low text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Infobox (Right Sidebar) */}
              <aside className="w-80 shrink-0 hidden lg:block">
                <div className="card overflow-hidden sticky top-24">
                  {/* Infobox Header */}
                  <div className="bg-primary/20 p-3 text-center">
                    <h3 className="font-bold text-on-surface text-lg">{page.infobox.title}</h3>
                  </div>

                  {/* Main Image */}
                  <div className="relative">
                    <img
                      src={page.infobox.image}
                      alt={page.infobox.title}
                      className="w-full h-auto"
                    />
                    {page.infobox.imageCaption && (
                      <p className="text-xs text-center text-on-surface-variant p-2 bg-surface-container-low">
                        {page.infobox.imageCaption}
                      </p>
                    )}
                  </div>

                  {/* Info Data */}
                  <div className="divide-y divide-border">
                    {page.infobox.data.map((item, index) => (
                      <div key={index} className="p-3">
                        <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                          {item.label}
                        </dt>
                        <dd className="text-sm text-on-surface">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

// Wiki Section Component
function WikiSection({ section, number }: { section: WikiSection; number: number }) {
  if (section.type === 'gallery') {
    return (
      <section id={section.id} className="mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-on-surface">{section.title}</h2>
          <button className="text-primary text-sm hover:underline">[edit]</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {section.images?.map((image, index) => (
            <div key={index} className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg border border-outline-variant/30">
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs text-on-surface-variant text-center mt-2">{image.caption}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className="mb-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/30 pb-2">
        <h2 className="text-2xl font-bold text-on-surface">{section.title}</h2>
        <button className="text-primary text-sm hover:underline">[edit]</button>
      </div>

      {section.content && (
        <div
          className="prose prose-wiki"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}

      {/* Subsections */}
      {section.subsections?.map((sub, index) => (
        <div key={sub.id} id={sub.id} className="mt-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold text-on-surface">{sub.title}</h3>
            <button className="text-primary text-xs hover:underline">[edit]</button>
          </div>
          {sub.content && (
            <div
              className="prose prose-wiki"
              dangerouslySetInnerHTML={{ __html: sub.content }}
            />
          )}
        </div>
      ))}
    </section>
  );
}
