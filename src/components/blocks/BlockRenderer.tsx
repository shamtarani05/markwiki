'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Block } from '@/src/lib/blocks/types';
import { BLOCK_LABELS } from '@/src/lib/blocks/types';
import { sanitizeHtml } from '@/src/lib/blocks/sanitize';
import { toEmbedUrl, isDirectVideoUrl } from '@/src/lib/blocks/embedUrl';
import AdBanner from '@/src/components/home/AdBanner';

// Only the infobox goes in the right sidebar (like a real wiki article).
// Table of contents is main-column content, not sidebar content — real
// wikis show it left-aligned, right after the page heading, before the
// first section, regardless of where its block happens to sit in the list.
const SIDEBAR_TYPES = new Set(['infobox']);

export function BlockListRenderer({
  blocks,
  renderOverride,
}: {
  blocks: Block[];
  // Lets a server-rendering caller (the wiki hub route) substitute live,
  // pre-computed content for specific blocks (wikiStats/trendingPages/
  // recentActivity) instead of the static editor-preview placeholder.
  // Returning null/undefined falls through to the generic BlockRenderer.
  renderOverride?: (block: Block) => React.ReactNode | null | undefined;
}) {
  const headings = blocks.filter((b) => b.type === 'heading');
  const sidebarBlocks = blocks.filter((b) => SIDEBAR_TYPES.has(b.type));
  const toc = blocks.find((b) => b.type === 'tableOfContents');
  const mainBlocks = blocks.filter((b) => !SIDEBAR_TYPES.has(b.type) && b.type !== 'tableOfContents');

  return (
    <div className="lg:flex lg:gap-8 lg:items-start">
      <div className="prose-wiki flex-1 min-w-0">
        {toc && (
          <div className="mb-6">
            {renderOverride?.(toc) ?? <BlockRenderer block={toc} headings={headings} />}
          </div>
        )}
        {mainBlocks.map((block) => (
          <div key={block.id} className="mb-6 last:mb-0">
            {renderOverride?.(block) ?? <BlockRenderer block={block} headings={headings} />}
          </div>
        ))}
      </div>
      {sidebarBlocks.length > 0 && (
        <div className="w-full lg:w-80 shrink-0 space-y-4 mb-6 lg:mb-0 lg:sticky lg:top-24">
          {sidebarBlocks.map((block) => (
            <div key={block.id}>
              {renderOverride?.(block) ?? <BlockRenderer block={block} headings={headings} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BlockRenderer({
  block,
  headings,
}: {
  block: Block;
  headings?: Extract<Block, { type: 'heading' }>[];
}) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.props.level === 2 ? 'h2' : 'h3';
      return (
        <Tag id={block.id} className="scroll-mt-24 border-b border-border pb-2">
          {block.props.text}
        </Tag>
      );
    }

    case 'richText':
      return (
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.props.html) }} />
      );

    case 'image':
      return (
        <figure>
          {block.props.src ? (
            <img
              src={block.props.src}
              alt={block.props.alt}
              className="w-full h-auto rounded-lg border border-border"
            />
          ) : (
            <EmptyMediaPlaceholder label="Image" />
          )}
          {block.props.caption && (
            <figcaption className="text-xs text-foreground-muted text-center mt-2">
              {block.props.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'gallery':
      return block.props.images.length === 0 ? (
        <EmptyMediaPlaceholder label="Gallery" />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${block.props.columns}, minmax(0, 1fr))` }}
        >
          {block.props.images.map((image, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg border border-border">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              {image.caption && (
                <p className="text-xs text-foreground-muted text-center mt-2">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      );

    case 'videoEmbed':
      return block.props.url ? (
        <figure>
          <div className="aspect-video rounded-lg overflow-hidden border border-border">
            {isDirectVideoUrl(block.props.url) ? (
              <video src={block.props.url} controls className="w-full h-full" />
            ) : (
              <iframe
                src={toEmbedUrl(block.props.url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          {block.props.caption && (
            <figcaption className="text-xs text-foreground-muted text-center mt-2">
              {block.props.caption}
            </figcaption>
          )}
        </figure>
      ) : (
        <EmptyMediaPlaceholder label="Video" />
      );

    case 'quote':
      return block.props.text ? (
        <blockquote className="border-l-4 border-accent bg-background-secondary p-4 rounded-r-lg not-italic">
          <p className="text-lg italic text-foreground m-0">&ldquo;{block.props.text}&rdquo;</p>
          {block.props.source && (
            <footer className="text-sm text-foreground-muted mt-2">— {block.props.source}</footer>
          )}
        </blockquote>
      ) : null;

    case 'infobox':
      // Deliberately not floated — a floated block inside a linear block
      // stack overlaps whatever comes after it in the editor canvas. A
      // sidebar-style infobox layout belongs at the page level (like
      // WikiPageLayout.tsx's flex layout), not on the block itself.
      return (
        <aside className="card overflow-hidden w-full sm:max-w-sm">
          <div className="bg-accent/20 p-3 text-center">
            <h3 className="font-bold text-foreground text-lg m-0">{block.props.title || 'Untitled'}</h3>
            {block.props.subtitle && (
              <p className="text-xs text-foreground-muted m-0">{block.props.subtitle}</p>
            )}
          </div>
          {block.props.image && (
            <div>
              <img src={block.props.image} alt={block.props.title} className="w-full h-auto" />
              {block.props.imageCaption && (
                <p className="text-xs text-center text-foreground-muted p-2 bg-background-secondary m-0">
                  {block.props.imageCaption}
                </p>
              )}
            </div>
          )}
          {block.props.fields.length > 0 && (
            <dl className="divide-y divide-border m-0">
              {block.props.fields.map((f, i) => (
                <div key={i} className="p-3">
                  <dt className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-foreground m-0">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      );

    case 'tableOfContents':
      return <TableOfContents title={block.props.title} headings={headings ?? []} />;

    case 'cardGrid':
      return (
        <div>
          {block.props.title && <h3 className="text-xl font-semibold mb-3">{block.props.title}</h3>}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${block.props.columns}, minmax(0, 1fr))` }}
          >
            {block.props.items.map((item, i) => (
              <CardGridItem key={i} item={item} />
            ))}
          </div>
        </div>
      );

    case 'carousel':
      return (
        <div>
          {block.props.title && <h3 className="text-xl font-semibold mb-3">{block.props.title}</h3>}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {block.props.items.map((item, i) => (
              <div key={i} className="w-48 shrink-0">
                <CardGridItem item={item} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'ctaButton': {
      const align = { left: 'text-left', center: 'text-center', right: 'text-right' }[block.props.align];
      return (
        <div className={align}>
          <Link href={block.props.href} className={`btn ${block.props.style === 'primary' ? 'btn-primary' : 'btn-secondary'}`}>
            {block.props.text}
          </Link>
        </div>
      );
    }

    case 'newsletter':
      return <NewsletterBlock title={block.props.title} subtitle={block.props.subtitle} />;

    case 'comments':
      return (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">{block.props.title || 'Comments'}</h3>
          <p className="text-sm text-foreground-muted">Comments open once this page is published.</p>
        </div>
      );

    case 'adSlot':
      return <AdBanner zone={block.props.zone} />;

    case 'wikiStats':
    case 'trendingPages':
    case 'recentActivity':
      return (
        <div className="ad-zone">
          <span>{BLOCK_LABELS[block.type]} — live on the published wiki cover page</span>
        </div>
      );

    default:
      return null;
  }
}

function EmptyMediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="ad-zone">
      <span>{label} — no source set</span>
    </div>
  );
}

function CardGridItem({ item }: { item: { title: string; subtitle?: string; image?: string; href?: string } }) {
  const content = (
    <div className="card overflow-hidden h-full">
      <div className="aspect-video bg-background-tertiary overflow-hidden">
        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-foreground text-sm m-0">{item.title}</h4>
        {item.subtitle && <p className="text-xs text-foreground-muted mt-1 m-0">{item.subtitle}</p>}
      </div>
    </div>
  );
  return item.href ? <Link href={item.href}>{content}</Link> : content;
}

function TableOfContents({ title, headings }: { title?: string; headings: Extract<Block, { type: 'heading' }>[] }) {
  const [open, setOpen] = useState(true);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (headings.length === 0) return null;

  return (
    <div className="card p-4 bg-background-secondary not-prose">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <h2 className="font-semibold text-foreground m-0">{title || 'Contents'}</h2>
        <button className="text-accent text-sm hover:underline">[{open ? 'hide' : 'show'}]</button>
      </div>
      {open && (
        <nav className="mt-3">
          <ol className="space-y-1 text-sm list-none pl-0">
            {headings.map((h, i) => (
              <li key={h.id} className={h.props.level === 3 ? 'ml-6' : ''}>
                <button onClick={() => scrollTo(h.id)} className="text-accent hover:underline flex items-start gap-2">
                  <span className="text-foreground-muted">{i + 1}</span>
                  <span>{h.props.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}

function NewsletterBlock({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="card p-6 bg-background-secondary text-center">
      <h3 className="text-xl font-semibold mb-1">{title || 'Subscribe for updates'}</h3>
      {subtitle && <p className="text-sm text-foreground-muted mb-4">{subtitle}</p>}
      {submitted ? (
        <p className="text-success text-sm">Thanks for subscribing!</p>
      ) : (
        <form
          className="flex gap-2 max-w-sm mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
          />
          <button type="submit" className="btn btn-primary">Subscribe</button>
        </form>
      )}
    </div>
  );
}
