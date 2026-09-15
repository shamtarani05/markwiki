'use client';

import { useEffect, useState } from 'react';
import ImagePicker from './ImagePicker';

interface WikiOption {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string } | null;
  pageCount: number;
  coverImage?: string;
}

interface CategoryOption {
  _id: string;
  name: string;
}

export default function WikiPicker({ onSelect }: { onSelect: (wiki: WikiOption) => void }) {
  const [wikis, setWikis] = useState<WikiOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/wikis').then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ])
      .then(([wikisRes, categoriesRes]) => {
        setWikis(wikisRes.wikis ?? []);
        setCategories(categoriesRes.categories ?? []);
        if (categoriesRes.categories?.length) setCategoryId(categoriesRes.categories[0]._id);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !categoryId) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/wikis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), categoryId, description, coverImage }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create wiki');
      }
      const { wiki } = await res.json();
      const category = categories.find((c) => c._id === categoryId) ?? null;
      onSelect({ ...wiki, category });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create wiki');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <p className="text-[#706F78] py-12 text-center">Loading…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-[#F5F3EF] mb-1">Which wiki is this page for?</h2>
      <p className="text-[#706F78] mb-6">
        A wiki groups together every page about one series/game/book — Character, Location,
        Episode, and Overview pages all live under it. Pick an existing wiki or start a new one.
      </p>

      {wikis.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[#706F78] uppercase tracking-wide mb-3">
            Existing wikis
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {wikis.map((w) => (
              <button
                key={w._id}
                type="button"
                onClick={() => onSelect(w)}
                className="admin-tile overflow-hidden text-left hover:border-accent transition-colors"
              >
                <div className="aspect-[3/1] bg-[#181820] relative">
                  {w.coverImage && <>
                    <img src={w.coverImage} alt={w.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[#121218]" />
                  </>}
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-[#F5F3EF]">{w.name}</h4>
                  <p className="text-xs text-[#706F78] mt-1">
                    {w.category?.name ?? 'Uncategorized'} · {w.pageCount} page{w.pageCount === 1 ? '' : 's'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="admin-panel p-4">
        <h3 className="text-sm font-semibold text-[#706F78] uppercase tracking-wide mb-3">
          Start a new wiki
        </h3>
        {error && <p className="text-sm text-[var(--tag-red)] mb-3">{error}</p>}
        <div className="space-y-3">
          <label className="block">
            <span className="block text-xs text-[#706F78] mb-1">Wiki name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Solo Leveling"
              className="w-full px-3 py-2 text-sm bg-[#0B0B0F] border border-[rgba(255,255,255,0.09)] rounded-lg text-[#F5F3EF] focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-[#706F78] mb-1">Topic category</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#0B0B0F] border border-[rgba(255,255,255,0.09)] rounded-lg text-[#F5F3EF] focus:outline-none focus:border-accent transition-colors"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-[#706F78] mb-1">Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm bg-[#0B0B0F] border border-[rgba(255,255,255,0.09)] rounded-lg text-[#F5F3EF] focus:outline-none focus:border-accent transition-colors"
            />
          </label>
          <div>
            <span className="block text-xs text-[#706F78] mb-1">Cover image (optional)</span>
            {coverImage ? (
              <div className="relative">
                <>
                    <img src={coverImage} alt="" className="w-full aspect-[3/1] object-cover rounded-lg border border-[rgba(255,255,255,0.09)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[#121218]" />
                  </>
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded bg-[#0B0B0F]/80 text-[#706F78] hover:text-[var(--tag-red)]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCoverPickerOpen(true)}
                className="ad-zone w-full"
              >
                Add a cover image — shown on the homepage and this wiki's page
              </button>
            )}
          </div>
          <button
            type="button"
            disabled={creating || !name.trim()}
            onClick={handleCreate}
            className="btn btn-primary disabled:opacity-60"
          >
            {creating ? 'Creating…' : 'Create wiki & continue'}
          </button>
        </div>
      </div>

      {coverPickerOpen && (
        <ImagePicker
          onClose={() => setCoverPickerOpen(false)}
          onInsert={(url) => {
            setCoverImage(url);
            setCoverPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
