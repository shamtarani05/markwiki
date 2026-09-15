'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import PageBuilder from '@/src/components/admin/builder/PageBuilder';
import TextEditor from '@/src/components/admin/builder/TextEditor';
import type { Block, PageBuilderSaveData } from '@/src/lib/blocks/types';
import type { PageStatus } from '@/src/lib/db/models/Page';

interface LoadedPage {
  _id: string;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: Block[];
  templateKey?: string;
  coverImage?: string;
  wiki?: { name: string; slug: string };
}

export default function EditWikiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState<LoadedPage | null>(null);
  const [editorMode, setEditorMode] = useState<'block' | 'text'>('block');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/pages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Page not found');
        return res.json();
      })
      .then(({ page }) => setPage(page))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load page'));

    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(({ user }) => {
        if (user?.preferences?.editorMode) setEditorMode(user.preferences.editorMode);
      })
      .catch(() => {});
  }, [id]);

  const handleSave = async (data: PageBuilderSaveData) => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save page');
      const { page: updated } = await res.json();
      setPage((prev) => (prev ? { ...prev, title: updated.title, blocks: updated.blocks, coverImage: updated.coverImage } : prev));
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    if (!page) return;
    const nextStatus: PageStatus = page.status === 'published' ? 'draft' : 'published';
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setPage((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-red-bg)] text-[var(--tag-red)] text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--tag-green-bg)] text-[var(--tag-green)] text-sm">
          Saved.
        </div>
      )}
      {page ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#706F78]">
              {page.wiki && <>In <span className="text-[#8B5CF6] font-medium">{page.wiki.name}</span></>}
              {' · '}
              <button
                type="button"
                onClick={() => setEditorMode((m) => (m === 'block' ? 'text' : 'block'))}
                className="hover:underline"
                title="Switches the editor for this session — save first if you have unsaved changes, both editors read/write the same saved page"
              >
                switch to {editorMode === 'block' ? 'Text' : 'Block'} editor
              </button>
            </p>
            <div className="flex items-center gap-3">
              {page.status === 'published' && page.wiki && (
                <a
                  href={`/wiki/${page.wiki.slug}/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#706F78] hover:text-[#8B5CF6]"
                >
                  View live ↗
                </a>
              )}
              <Link href={`/admin/preview/page/${id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#706F78] hover:text-[#8B5CF6]">
                Preview
              </Link>
              <Link href={`/admin/wiki/${id}/history`} className="text-sm text-[#706F78] hover:text-[#8B5CF6]">
                View history
              </Link>
              <button
                type="button"
                disabled={publishing}
                onClick={togglePublish}
                className={`text-xs px-2.5 py-1 rounded-md font-medium disabled:opacity-60 ${
                  page.status === 'published' ? 'badge-green' : 'badge-yellow'
                }`}
              >
                {publishing ? '…' : page.status === 'published' ? 'Published — unpublish' : 'Draft — publish'}
              </button>
            </div>
          </div>
          {editorMode === 'block' ? (
            <PageBuilder
              key="block"
              initialTitle={page.title}
              initialBlocks={page.blocks}
              initialTemplateKey={page.templateKey}
              initialCoverImage={page.coverImage}
              showEditSummary
              onSave={handleSave}
              saving={saving}
            />
          ) : (
            <TextEditor
              key="text"
              initialTitle={page.title}
              initialBlocks={page.blocks}
              initialTemplateKey={page.templateKey}
              initialCoverImage={page.coverImage}
              showEditSummary
              onSave={handleSave}
              saving={saving}
            />
          )}
        </>
      ) : !error ? (
        <p className="text-[#706F78]">Loading…</p>
      ) : null}
    </div>
  );
}
