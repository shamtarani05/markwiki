import ImageKit from '@imagekit/nodejs';

// Server-side client only — IMAGEKIT_PRIVATE_KEY must never reach the browser.
// Lazily constructed (not at module scope) so importing this file never
// throws just because the env var is unset at build time (e.g. `next build`
// in an environment without secrets) — the error only surfaces if a route
// actually tries to use ImageKit without the key configured.
let client: ImageKit | null = null;

export function getImagekit(): ImageKit {
  if (!client) {
    client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
  }
  return client;
}

export const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
