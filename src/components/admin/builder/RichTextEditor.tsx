'use client';

import { useRef } from 'react';
import { sanitizeHtml } from '@/src/lib/blocks/sanitize';

// Constrained WYSIWYG: a fixed toolbar (bold/italic/link/list/quote), not a
// free HTML textarea — matches the "no raw CSS/HTML" decision while still
// letting editors format text freely within that toolbar.
export default function RichTextEditor({
  html,
  onChange,
}: {
  html: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const exec = (command: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInput = () => {
    if (ref.current) {
      onChange(sanitizeHtml(ref.current.innerHTML));
    }
  };

  const insertLink = () => {
    const url = window.prompt('Link URL');
    if (url) exec('createLink', url);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border bg-background-secondary p-1.5">
        <ToolbarButton label="Bold" onClick={() => exec('bold')}><strong>B</strong></ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => exec('italic')}><em>I</em></ToolbarButton>
        <ToolbarButton label="Bullet list" onClick={() => exec('insertUnorderedList')}>&bull; List</ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => exec('insertOrderedList')}>1. List</ToolbarButton>
        <ToolbarButton label="Link" onClick={insertLink}>Link</ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => exec('formatBlock', 'blockquote')}>&ldquo;&rdquo;</ToolbarButton>
        <ToolbarButton label="Clear formatting" onClick={() => exec('removeFormat')}>Clear</ToolbarButton>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        className="p-3 min-h-[120px] text-sm text-foreground focus:outline-none prose-wiki"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="px-2 py-1 text-xs rounded hover:bg-background-tertiary text-foreground-muted hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}
