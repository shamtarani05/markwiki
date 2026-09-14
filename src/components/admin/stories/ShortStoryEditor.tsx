'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';
import PageBuilder from '@/src/components/admin/builder/PageBuilder';
import { Block, PageBuilderSaveData } from '@/src/lib/blocks/types';

export default function ShortStoryEditor({ storyId }: { storyId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(storyId ? true : false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [initialTitle, setInitialTitle] = useState('');
  const [initialCoverImage, setInitialCoverImage] = useState('');
  const [slug, setSlug] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [tags, setTags] = useState('');
  const [genres, setGenres] = useState('');
  const [status, setStatus] = useState('draft');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (storyId) {
      async function loadData() {
        try {
          const res = await fetch(`/api/admin/short-stories/${storyId}`);
          if (res.ok) {
            const data = await res.json();
            const s = data.story;
            setInitialTitle(s.title || '');
            setInitialCoverImage(s.coverImage || '');
            setBlocks(s.blocks || []);
            setSlug(s.slug || '');
            setSynopsis(s.synopsis || '');
            setTags((s.tags || []).join(', '));
            setGenres((s.genres || []).join(', '));
            setStatus(s.status || 'draft');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }
  }, [storyId]);

  const handleSave = async (data: PageBuilderSaveData) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        slug: slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        synopsis,
        blocks: data.blocks,
        coverImage: data.coverImage,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        genres: genres.split(',').map(g => g.trim()).filter(Boolean),
        status,
      };

      const url = storyId ? `/api/admin/short-stories/${storyId}` : '/api/admin/short-stories';
      const method = storyId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save story');
      } else {
        const resData = await res.json();
        if (!storyId) {
          router.push(`/admin/short-stories/${resData.story._id}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!storyId) return;
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/short-stories/${storyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/short-stories');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/short-stories" className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-on-surface">
            {storyId ? 'Edit Story' : 'New Story'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {storyId && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded"
              title="Delete Story"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded transition-colors ${showSettings ? 'bg-surface-container-low text-on-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
            title="Story Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
          <PageBuilder
            initialTitle={initialTitle}
            initialBlocks={blocks}
            initialCoverImage={initialCoverImage}
            onSave={handleSave}
            saving={saving}
          />
        </div>

        {showSettings && (
          <div className="w-80 shrink-0 space-y-6 overflow-y-auto">
            <div className="card p-5 space-y-4">
              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Story Settings</h2>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Slug (URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Synopsis</label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Brief summary..."
                  className="w-full h-24 bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent resize-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Genres (comma separated)</label>
                <input
                  type="text"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="fantasy, sci-fi, horror"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="featured, winner"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
