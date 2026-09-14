'use client';

import { useEffect, useState } from 'react';

type EditorMode = 'block' | 'text';

export default function AdminSettingsPage() {
  const [editorMode, setEditorMode] = useState<EditorMode>('block');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(({ user }) => {
        if (user?.preferences?.editorMode) setEditorMode(user.preferences.editorMode);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (mode: EditorMode) => {
    setEditorMode(mode);
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editorMode: mode }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-on-surface-variant">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-on-surface mb-6">Settings</h1>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-on-surface mb-1">Default wiki page editor</h2>
        <p className="text-sm text-on-surface-variant mb-4">
          This is a per-account preference — it only changes which editor opens for you when creating or
          editing a wiki page. Both editors save the exact same page and render identically, so switching
          any time is safe.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <EditorOption
            active={editorMode === 'block'}
            title="Block editor"
            description="Discrete draggable blocks (Notion/Gutenberg-style) — add, reorder, and configure each piece of content as its own object."
            onSelect={() => save('block')}
          />
          <EditorOption
            active={editorMode === 'text'}
            title="Text editor"
            description="One continuous flowing document (Wikipedia/Word-style) — type directly, apply heading styles, infobox and contents live in a side panel."
            onSelect={() => save('text')}
          />
        </div>

        {saving && <p className="text-xs text-on-surface-variant mt-3">Saving…</p>}
        {saved && !saving && <p className="text-xs text-success mt-3">Saved.</p>}
      </div>
    </div>
  );
}

function EditorOption({
  active, title, description, onSelect,
}: { active: boolean; title: string; description: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left p-4 rounded-lg border transition-colors ${
        active ? 'border-accent bg-primary-muted' : 'border-outline-variant/30 hover:border-outline-variant/30-light hover:bg-surface-variant'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        {active && <span className="text-[10px] uppercase tracking-wide text-primary">Current</span>}
      </div>
      <p className="text-xs text-on-surface-variant">{description}</p>
    </button>
  );
}
