'use client';

import { useState } from 'react';

// Shared "insert an image" dialog — used by both editors. Two ways in,
// always both offered: upload a file (saved via /api/admin/media) or paste
// an existing URL.
export default function ImagePicker({
  onInsert,
  onClose,
}: {
  onInsert: (url: string, alt: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Upload failed');
      }
      const { media } = await res.json();
      onInsert(media.url, alt || media.originalFilename);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="card w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Insert image</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-foreground-muted hover:text-foreground">✕</button>
        </div>

        <div className="flex rounded-md border border-border overflow-hidden mb-3 w-fit">
          <button type="button" onClick={() => setTab('upload')} className={`px-3 py-1 text-xs ${tab === 'upload' ? 'bg-accent text-accent-contrast' : 'text-foreground-muted hover:bg-background-tertiary'}`}>Upload</button>
          <button type="button" onClick={() => setTab('url')} className={`px-3 py-1 text-xs ${tab === 'url' ? 'bg-accent text-accent-contrast' : 'text-foreground-muted hover:bg-background-tertiary'}`}>URL</button>
        </div>

        {error && <p className="text-xs text-[var(--tag-red)] mb-2">{error}</p>}

        {tab === 'upload' ? (
          <label className="ad-zone cursor-pointer block">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <span>{uploading ? 'Uploading…' : 'Click to choose a file (JPEG, PNG, GIF, WebP, SVG — max 8MB)'}</span>
          </label>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Alt text (for accessibility)"
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled={!url.trim()}
              onClick={() => onInsert(url.trim(), alt.trim())}
              className="btn btn-primary text-sm py-1.5 disabled:opacity-60"
            >
              Insert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
