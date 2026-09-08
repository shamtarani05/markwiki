import ImageKit from '@imagekit/nodejs';

// Server-side client only — IMAGEKIT_PRIVATE_KEY must never reach the browser.
// The SDK reads it from process.env['IMAGEKIT_PRIVATE_KEY'] by default; passed
// explicitly here so a missing env var fails loudly instead of silently.
export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
