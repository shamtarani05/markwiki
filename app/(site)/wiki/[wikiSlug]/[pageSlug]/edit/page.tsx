'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextEditor from '@/src/components/admin/builder/TextEditor';
import type { PageBuilderSaveData } from '@/src/lib/blocks/types';

interface PageDoc {
  _id: string;
  title: string;
  blocks: PageBuilderSaveData['blocks'];
  templateKey?: string;
  coverImage?: string;
}

export default function PublicEditPage() {
  const params = useParams<{ wikiSlug: string; pageSlug: string }>();
  const router = useRouter();
  const [page, setPage] = useState<PageDoc | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then(({ user }) => setLoggedIn(!!user));
  }, []);

  useEffect(() => {
    fetch(`/api/public/pages?wikiSlug=${params.wikiSlug}&pageSlug=${params.pageSlug}`)
      .then((r) => r.json())
      .then(({ page }) => setPage(page));
  }, [params.wikiSlug, params.pageSlug]);

  if (loggedIn === false) {
    return <p className="container py-16 text-on-surface-variant">You must be signed in to edit this page.</p>;
  }
  if (!page) return <p className="container py-16 text-on-surface-variant">Loading…</p>;

  const handleSave = async (data: PageBuilderSaveData) => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/pages/${page._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to save');
      if (res.status === 202) {
        setNotice('Your edit was submitted for admin review — it will go live once approved.');
      } else {
        router.push(`/wiki/${params.wikiSlug}/${params.pageSlug}`);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8">
      {notice && <div className="mb-4 px-4 py-2 rounded-lg bg-primary-muted text-primary text-sm">{notice}</div>}
      {/* Public contributors get the flowing, Wikipedia-style document
          editor — not the admin drag-and-drop block canvas. Paragraphs,
          headings-as-sections, images: the mental model a general
          audience already knows, not a block palette. Both editors read/
          write the same Page.blocks shape, so this is purely a UI choice. */}
      <TextEditor
        initialTitle={page.title}
        initialBlocks={page.blocks}
        initialTemplateKey={page.templateKey}
        initialCoverImage={page.coverImage}
        showEditSummary
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
