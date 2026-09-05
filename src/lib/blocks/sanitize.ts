// Allowlist sanitizer for block-stored HTML. Two allowlists:
//  - the base one (richText/quote blocks — produced by the constrained
//    toolbar in RichTextEditor, not free-form paste)
//  - the "flow" one (the Text editor's continuous TipTap document), which
//    additionally allows headings, images, the custom video-embed wrapper,
//    and font-size spans, since those are legitimate TipTap output.
// Either way this strips anything that could execute script or load remote
// code, since the result runs through dangerouslySetInnerHTML on both the
// admin preview and the public site.

const BASE_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'cite', 'h4', 'h5', 'code',
]);

const FLOW_TAGS = new Set([...BASE_TAGS, 'h2', 'h3', 'img', 'div', 'iframe', 'span']);

const SAFE_URL = /^(https?:|\/|#)/i;
const FONT_SIZE = /^font-size:\s*[\d.]+(px|rem|em|%)\s*;?$/i;

function sanitize(input: string, allowedTags: Set<string>): string {
  if (!input) return '';

  const doc = typeof window !== 'undefined'
    ? new DOMParser().parseFromString(input, 'text/html')
    : null;

  // Server-side (no DOM available): fall back to a conservative regex strip
  // of the dangerous constructs. Full sanitization happens client-side too
  // before anything is saved, so this is a second layer, not the only one.
  if (!doc) {
    return input
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/ on\w+="[^"]*"/gi, '')
      .replace(/ on\w+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }

  const clean = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode();
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      const frag = document.createDocumentFragment();
      el.childNodes.forEach((child) => {
        const cleaned = clean(child);
        if (cleaned) frag.appendChild(cleaned);
      });
      return frag;
    }

    const out = document.createElement(tag);

    if (tag === 'a') {
      const href = el.getAttribute('href') || '';
      if (SAFE_URL.test(href)) {
        out.setAttribute('href', href);
        out.setAttribute('rel', 'noopener noreferrer');
      }
    } else if (tag === 'img') {
      const src = el.getAttribute('src') || '';
      if (SAFE_URL.test(src)) out.setAttribute('src', src);
      const alt = el.getAttribute('alt');
      if (alt) out.setAttribute('alt', alt);
      return out; // void element, no children
    } else if (tag === 'iframe') {
      const src = el.getAttribute('src') || '';
      if (SAFE_URL.test(src)) out.setAttribute('src', src);
      out.setAttribute('frameborder', '0');
      out.setAttribute('allowfullscreen', 'true');
      return out;
    } else if (tag === 'div') {
      if (el.hasAttribute('data-video-embed')) out.setAttribute('data-video-embed', '');
      if (el.classList.contains('tiptap-video-embed')) out.className = 'tiptap-video-embed';
    } else if (tag === 'span') {
      const style = el.getAttribute('style') || '';
      if (FONT_SIZE.test(style.trim())) out.setAttribute('style', style.trim());
    }

    el.childNodes.forEach((child) => {
      const cleaned = clean(child);
      if (cleaned) out.appendChild(cleaned);
    });
    return out;
  };

  const container = document.createElement('div');
  doc.body.childNodes.forEach((child) => {
    const cleaned = clean(child);
    if (cleaned) container.appendChild(cleaned);
  });

  return container.innerHTML;
}

export function sanitizeHtml(input: string): string {
  return sanitize(input, BASE_TAGS);
}

export function sanitizeFlowHtml(input: string): string {
  return sanitize(input, FLOW_TAGS);
}
