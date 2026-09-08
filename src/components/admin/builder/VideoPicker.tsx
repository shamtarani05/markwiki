'use client';

import { useState } from 'react';

// Shared "insert a video" dialog — same shape as ImagePicker: upload a file
// (saved via /api/admin/media, which routes video uploads to ImageKit) or
// paste an existing URL (e.g. a YouTube link).
export default function VideoPicker({
  onInsert,
  onClose,
}: {
  onInsert: (url: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');

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
      onInsert(media.url);
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
          <h3 className="text-sm font-semibold text-foreground">Insert video</h3>
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
              accept="video/mp4,video/webm,video/quicktime,video/ogg"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <span>{uploading ? 'Uploading…' : 'Click to choose a file (MP4, WebM, MOV, OGG — max 100MB)'}</span>
          </label>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or a direct video URL"
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled={!url.trim()}
              onClick={() => onInsert(url.trim())}
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
