'use client';

import { PAGE_TEMPLATES, PageTemplate } from '@/src/lib/blocks/templates';

export default function TemplatePicker({ onSelect }: { onSelect: (template: PageTemplate) => void }) {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-foreground mb-1">Start a Wiki Page</h2>
      <p className="text-foreground-muted mb-6">
        Pick a starting layout — every block it adds can be moved, edited, or deleted afterward. Nothing here is locked in.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {PAGE_TEMPLATES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t)}
            className="card p-4 text-left hover:border-accent transition-colors"
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">{t.name}</h3>
            <p className="text-xs text-foreground-muted">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
