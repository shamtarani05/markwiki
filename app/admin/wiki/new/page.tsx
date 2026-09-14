'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageBuilder from '@/src/components/admin/builder/PageBuilder';
import TextEditor from '@/src/components/admin/builder/TextEditor';
import WikiPicker from '@/src/components/admin/builder/WikiPicker';
import type { PageBuilderSaveData } from '@/src/lib/blocks/types';

interface WikiOption {
  _id: string;
  name: string;
}

export default function NewWikiPage() {
  const router = useRouter();
  const [wiki, setWiki] = useState<WikiOption | null>(null);
  const [editorMode, setEditorMode] = useState<'block' | 'text'>('block');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(({ user }) => {
        if (user?.preferences?.editorMode) setEditorMode(user.preferences.editorMode);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (data: PageBuilderSaveData) => {
    if (!data.title.trim()) {
      setError('Give the page a title before saving.');
      return;
    }
    if (!wiki) return;
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, wikiId: wiki._id, pageType: data.templateKey }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save page');
      }
      const { page } = await res.json();
      router.push(`/admin/wiki/${page._id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-red-bg)] text-[var(--tag-red)] text-sm">
          {error}
        </div>
      )}
      {!wiki ? (
        <WikiPicker onSelect={setWiki} />
      ) : (
        <>
          <p className="text-sm text-on-surface-variant mb-2">
            Adding a page to <span className="text-primary font-medium">{wiki.name}</span> ·{' '}
            <button type="button" onClick={() => setWiki(null)} className="hover:underline">
              change wiki
            </button>
          </p>
          {editorMode === 'block' ? (
            <PageBuilder onSave={handleSave} saving={saving} />
          ) : (
            <TextEditor onSave={handleSave} saving={saving} />
          )}
        </>
      )}
    </div>
  );
}
