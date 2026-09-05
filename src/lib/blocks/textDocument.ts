import { Block, createBlock } from './types';
import { sanitizeHtml, sanitizeFlowHtml } from './sanitize';
import { toEmbedUrl } from './embedUrl';

// Converts between the block editor's discrete Block[] and the text editor's
// single flowing HTML document, so both editors read/write the exact same
// Page.blocks — same render output either way, and switching modes never
// loses content (round-trip safe), per client requirement.
//
// heading/richText/quote/image/videoEmbed are "flowing" content — they
// become part of one continuous HTML document (images and video embeds are
// inline nodes in that document, same as any rich text editor). infobox/
// tableOfContents are edited as side panels (that's how Wikipedia treats
// them too — not part of the flowing text). Everything else (gallery,
// cardGrid, carousel, ctaButton, newsletter, comments, adSlot) isn't part of
// the Text editor's authoring surface, but is preserved untouched and still
// renders — just edit those via the Block editor. Note: a `quote` block
// becomes a <blockquote> inside the flowing HTML and comes back as part of
// a richText block on the way back — it renders identically either way
// (prose-wiki styles blockquote regardless of which block type carries it),
// it just stops being its own discrete block after a trip through the Text
// editor.

const OTHER_TYPES = new Set(['gallery', 'cardGrid', 'carousel', 'ctaButton', 'newsletter', 'comments', 'adSlot']);

export interface TextDocument {
  html: string;
  infobox: Extract<Block, { type: 'infobox' }> | null;
  tocEnabled: boolean;
  tocTitle: string;
  otherBlocks: Block[];
}

export function blocksToDocument(blocks: Block[]): TextDocument {
  let infobox: Extract<Block, { type: 'infobox' }> | null = null;
  let tocEnabled = false;
  let tocTitle = 'Contents';
  const otherBlocks: Block[] = [];
  const htmlParts: string[] = [];

  for (const block of blocks) {
    if (block.type === 'infobox') {
      if (!infobox) infobox = block;
      else otherBlocks.push(block);
    } else if (block.type === 'tableOfContents') {
      tocEnabled = true;
      tocTitle = block.props.title || 'Contents';
    } else if (block.type === 'heading') {
      const tag = block.props.level === 2 ? 'h2' : 'h3';
      htmlParts.push(`<${tag}>${escapeHtml(block.props.text)}</${tag}>`);
    } else if (block.type === 'richText') {
      htmlParts.push(sanitizeHtml(block.props.html));
    } else if (block.type === 'quote') {
      const source = block.props.source ? `<footer>— ${escapeHtml(block.props.source)}</footer>` : '';
      htmlParts.push(`<blockquote><p>${escapeHtml(block.props.text)}</p>${source}</blockquote>`);
    } else if (block.type === 'image') {
      if (block.props.src) htmlParts.push(`<img src="${escapeAttr(block.props.src)}" alt="${escapeAttr(block.props.alt)}" />`);
    } else if (block.type === 'videoEmbed') {
      if (block.props.url) {
        htmlParts.push(
          `<div data-video-embed class="tiptap-video-embed"><iframe src="${escapeAttr(toEmbedUrl(block.props.url))}"></iframe></div>`
        );
      }
    } else if (OTHER_TYPES.has(block.type)) {
      otherBlocks.push(block);
    }
  }

  return {
    html: htmlParts.join('\n') || '<p></p>',
    infobox,
    tocEnabled,
    tocTitle,
    otherBlocks,
  };
}

export function documentToBlocks(doc: TextDocument): Block[] {
  const blocks: Block[] = [];

  if (doc.infobox) blocks.push(doc.infobox);
  if (doc.tocEnabled) blocks.push(createBlock('tableOfContents', { title: doc.tocTitle }));

  blocks.push(...parseFlowHtml(doc.html));
  blocks.push(...doc.otherBlocks);

  return blocks;
}

function parseFlowHtml(html: string): Block[] {
  const blocks: Block[] = [];
  if (typeof window === 'undefined') return blocks;

  const doc = new DOMParser().parseFromString(sanitizeFlowHtml(html), 'text/html');
  let buffer = '';

  const flush = () => {
    const trimmed = buffer.trim();
    if (trimmed) blocks.push(createBlock('richText', { html: trimmed }));
    buffer = '';
  };

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === 'h2' || tag === 'h3') {
        flush();
        blocks.push(createBlock('heading', { text: el.textContent?.trim() ?? '', level: tag === 'h2' ? 2 : 3 }));
        return;
      }
      if (tag === 'img') {
        flush();
        blocks.push(createBlock('image', { src: el.getAttribute('src') ?? '', alt: el.getAttribute('alt') ?? '' }));
        return;
      }
      if (tag === 'div' && el.hasAttribute('data-video-embed')) {
        flush();
        const src = el.querySelector('iframe')?.getAttribute('src') ?? '';
        blocks.push(createBlock('videoEmbed', { url: src }));
        return;
      }
    }
    buffer += (node as HTMLElement).outerHTML ?? node.textContent ?? '';
  });
  flush();

  return blocks;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(input: string): string {
  return escapeHtml(input).replace(/"/g, '&quot;');
}
