export function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}

// A directly-uploaded video file (e.g. an ImageKit-hosted mp4) should render
// with a native <video> player, not the iframe used for embed providers
// (YouTube, Vimeo, ...) — those don't accept a raw file URL as a src.
export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}
