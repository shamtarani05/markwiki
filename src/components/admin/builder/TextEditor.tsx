'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImage from '@tiptap/extension-image';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { Block, BLOCK_LABELS, InfoboxField, PageBuilderSaveData, createBlock } from '@/src/lib/blocks/types';
import { PageTemplate } from '@/src/lib/blocks/templates';
import { blocksToDocument, documentToBlocks, TextDocument } from '@/src/lib/blocks/textDocument';
import { toEmbedUrl } from '@/src/lib/blocks/embedUrl';
import { VideoEmbed } from '@/src/lib/tiptap/VideoEmbed';
import TemplatePicker from './TemplatePicker';
import ImagePicker from './ImagePicker';
import VideoPicker from './VideoPicker';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';

const FONT_SIZES = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: '' },
  { label: 'Medium', value: '1.125rem' },
  { label: 'Large', value: '1.5rem' },
  { label: 'X-Large', value: '2rem' },
];

// Continuous, Wikipedia/Word-style document editor — one flowing surface you
// type into directly, headings are a paragraph style (not a draggable
// object), infobox/TOC are side panels. Reads/writes the same Page.blocks
// as PageBuilder (via blocksToDocument/documentToBlocks) so the two editors
// are interchangeable: same final render, no data lost switching modes.
export default function TextEditor({
  initialTitle = '',
  initialBlocks = [],
  initialTemplateKey,
  initialCoverImage = '',
  showEditSummary = false,
  onSave,
  saving = false,
}: {
  initialTitle?: string;
  initialBlocks?: Block[];
  initialTemplateKey?: string;
  initialCoverImage?: string;
  showEditSummary?: boolean;
  onSave: (data: PageBuilderSaveData) => void | Promise<void>;
  saving?: boolean;
}) {
  const [started, setStarted] = useState(initialBlocks.length > 0);
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [templateKey, setTemplateKey] = useState<string | undefined>(initialTemplateKey);
  const [editSummary, setEditSummary] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const [doc, setDoc] = useState<TextDocument>(() => blocksToDocument(initialBlocks));
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [videoPickerOpen, setVideoPickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
      TiptapImage,
      TextStyle,
      FontSize,
      VideoEmbed,
    ],
    content: doc.html,
    editorProps: {
      attributes: { class: 'prose-wiki tiptap-editor focus:outline-none min-h-[50vh]' },
    },
  });

  // Reset the editor's content when a template is picked / a different
  // page is loaded (not on every keystroke — editor owns its own state
  // while typing).
  useEffect(() => {
    if (editor && doc.html !== editor.getHTML()) {
      editor.commands.setContent(doc.html);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, started]);

  if (!started) {
    return (
      <TemplatePicker
        onSelect={(t: PageTemplate) => {
          const built = blocksToDocument(t.build());
          setDoc(built);
          setTemplateKey(t.key);
          setStarted(true);
        }}
      />
    );
  }

  const currentBlocks = () => {
    if (!editor) return documentToBlocks(doc);
    return documentToBlocks({ ...doc, html: editor.getHTML() });
  };

  const handleSave = () => {
    onSave({ title, blocks: currentBlocks(), templateKey, editSummary, coverImage });
  };

  const updateInfoboxField = (index: number, patch: Partial<InfoboxField>) => {
    setDoc((prev) => {
      if (!prev.infobox) return prev;
      const fields = prev.infobox.props.fields.map((f, i) => (i === index ? { ...f, ...patch } : f));
      return { ...prev, infobox: { ...prev.infobox, props: { ...prev.infobox.props, fields } } };
    });
  };

  const toggleInfobox = () => {
    setDoc((prev) => ({
      ...prev,
      infobox: prev.infobox ?? createBlock('infobox', { title: title || 'Untitled', fields: [] }),
    }));
  };

  return (
    <div>
      {/* Toolbar — same ribbon language as the block editor */}
      <div className="flex items-center gap-1 mb-3 px-2 py-1.5 border border-border rounded-lg bg-background-secondary flex-wrap">
        <ToolbarIconButton label="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>↺</ToolbarIconButton>
        <ToolbarIconButton label="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>↻</ToolbarIconButton>
        <Divider />
        <select
          value={editor?.isActive('heading', { level: 2 }) ? 'h2' : editor?.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'p') editor?.chain().focus().setParagraph().run();
            else editor?.chain().focus().toggleHeading({ level: v === 'h2' ? 2 : 3 }).run();
          }}
          className="h-7 px-2 text-xs bg-background border border-border rounded-md text-foreground"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
          <option value="h3">Sub-heading</option>
        </select>
        <Divider />
        <select
          value={editor?.getAttributes('textStyle').fontSize || ''}
          onChange={(e) => {
            if (e.target.value) editor?.chain().focus().setFontSize(e.target.value).run();
            else editor?.chain().focus().unsetFontSize().run();
          }}
          className="h-7 px-2 text-xs bg-background border border-border rounded-md text-foreground"
          title="Font size"
        >
          {FONT_SIZES.map((s) => (
            <option key={s.label} value={s.value}>{s.label}</option>
          ))}
        </select>
        <Divider />
        <ToolbarIconButton label="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}><strong>B</strong></ToolbarIconButton>
        <ToolbarIconButton label="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}><em>I</em></ToolbarIconButton>
        <ToolbarIconButton
          label="Link"
          active={editor?.isActive('link')}
          onClick={() => {
            const url = window.prompt('Link URL', editor?.getAttributes('link').href ?? '');
            if (url === null) return;
            if (url === '') editor?.chain().focus().unsetLink().run();
            else editor?.chain().focus().setLink({ href: url }).run();
          }}
        >
          🔗
        </ToolbarIconButton>
        <ToolbarIconButton label="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>•≡</ToolbarIconButton>
        <ToolbarIconButton label="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')}>1≡</ToolbarIconButton>
        <ToolbarIconButton label="Quote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')}>&ldquo;&rdquo;</ToolbarIconButton>
        <Divider />
        <ToolbarIconButton label="Insert image" onClick={() => setImagePickerOpen(true)}>🖼</ToolbarIconButton>
        <ToolbarIconButton label="Insert video" onClick={() => setVideoPickerOpen(true)}>▶</ToolbarIconButton>
        <Divider />
        <button type="button" onClick={toggleInfobox} className="px-2 py-1 text-xs rounded-md text-foreground-muted hover:text-foreground hover:bg-background-tertiary">
          Infobox
        </button>
        <button
          type="button"
          onClick={() => setDoc((prev) => ({ ...prev, tocEnabled: !prev.tocEnabled }))}
          className={`px-2 py-1 text-xs rounded-md ${doc.tocEnabled ? 'text-accent' : 'text-foreground-muted hover:text-foreground hover:bg-background-tertiary'}`}
        >
          Contents
        </button>
        <Divider />
        <div className="flex rounded-md border border-border overflow-hidden">
          <button type="button" onClick={() => setMode('edit')} className={`px-2.5 py-1 text-xs ${mode === 'edit' ? 'bg-accent text-accent-contrast' : 'text-foreground-muted hover:bg-background-tertiary'}`}>Edit</button>
          <button type="button" onClick={() => setMode('preview')} className={`px-2.5 py-1 text-xs ${mode === 'preview' ? 'bg-accent text-accent-contrast' : 'text-foreground-muted hover:bg-background-tertiary'}`}>Preview</button>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          disabled={saving || (showEditSummary && !editSummary.trim())}
          title={showEditSummary && !editSummary.trim() ? 'Enter an edit summary describing what you changed before saving' : undefined}
          onClick={handleSave}
          className="btn btn-primary text-sm py-1.5 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => setCoverPickerOpen(true)}
          className="w-16 h-10 rounded-md border border-border bg-background-secondary overflow-hidden shrink-0 flex items-center justify-center text-foreground-muted hover:border-accent transition-colors"
          title={coverImage ? 'Change cover image' : 'Add a cover image'}
        >
          {coverImage ? <img src={coverImage} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">+</span>}
        </button>
        <span className="text-xs text-foreground-muted">
          {coverImage ? 'Cover image set' : 'No cover image — used as the card thumbnail and social preview'}
        </span>
        {coverImage && (
          <button type="button" onClick={() => setCoverImage('')} className="text-xs text-[var(--tag-red)] hover:underline">
            Remove
          </button>
        )}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled page"
        className="w-full text-4xl font-bold bg-transparent text-foreground focus:outline-none mb-1 pb-2 border-b border-border"
      />

      {showEditSummary && (
        <input
          type="text"
          required
          value={editSummary}
          onChange={(e) => setEditSummary(e.target.value)}
          placeholder="Edit summary (required) — briefly describe what you changed"
          maxLength={500}
          className="w-full mt-3 mb-1 px-3 py-2 text-sm bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent transition-colors"
        />
      )}

      <div className="mt-6">
        {mode === 'preview' ? (
          <BlockListRenderer blocks={currentBlocks()} />
        ) : (
          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="flex-1 min-w-0">
              <EditorContent editor={editor} />

              {doc.otherBlocks.length > 0 && (
                <div className="mt-8 pt-4 border-t border-border">
                  <p className="text-[11px] font-semibold text-foreground-muted/70 uppercase tracking-wider mb-2">
                    Other blocks on this page (edit these in the Block editor)
                  </p>
                  <div className="space-y-1">
                    {doc.otherBlocks.map((b) => (
                      <div key={b.id} className="flex items-center justify-between px-2 py-1.5 rounded-md bg-background-secondary text-sm">
                        <span className="text-foreground-muted">{BLOCK_LABELS[b.type]}</span>
                        <button
                          type="button"
                          onClick={() => setDoc((prev) => ({ ...prev, otherBlocks: prev.otherBlocks.filter((x) => x.id !== b.id) }))}
                          className="text-xs text-foreground-muted hover:text-[var(--tag-red)]"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(doc.infobox || doc.tocEnabled) && (
              <div className="w-full lg:w-80 shrink-0 space-y-3 mt-6 lg:mt-0">
                {doc.infobox && (
                  <div className="card p-3">
                    <p className="text-[11px] font-semibold text-foreground-muted/70 uppercase tracking-wider mb-2">Infobox</p>
                    <input
                      type="text"
                      value={doc.infobox.props.title}
                      onChange={(e) => setDoc((prev) => (prev.infobox ? { ...prev, infobox: { ...prev.infobox, props: { ...prev.infobox.props, title: e.target.value } } } : prev))}
                      placeholder="Infobox title"
                      className="w-full mb-2 px-2 py-1.5 text-sm bg-background border border-border rounded-md text-foreground"
                    />
                    <input
                      type="text"
                      value={doc.infobox.props.image ?? ''}
                      onChange={(e) => setDoc((prev) => (prev.infobox ? { ...prev, infobox: { ...prev.infobox, props: { ...prev.infobox.props, image: e.target.value } } } : prev))}
                      placeholder="Image URL"
                      className="w-full mb-2 px-2 py-1.5 text-sm bg-background border border-border rounded-md text-foreground"
                    />
                    <div className="space-y-1.5">
                      {doc.infobox.props.fields.map((f, i) => (
                        <div key={i} className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={f.label}
                            onChange={(e) => updateInfoboxField(i, { label: e.target.value })}
                            placeholder="Label"
                            className="px-2 py-1 text-xs bg-background border border-border rounded"
                          />
                          <input
                            type="text"
                            value={f.value}
                            onChange={(e) => updateInfoboxField(i, { value: e.target.value })}
                            placeholder="Value"
                            className="px-2 py-1 text-xs bg-background border border-border rounded"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDoc((prev) => (prev.infobox ? { ...prev, infobox: { ...prev.infobox, props: { ...prev.infobox.props, fields: [...prev.infobox.props.fields, { label: '', value: '' }] } } } : prev))}
                      className="mt-2 text-xs text-accent hover:underline"
                    >
                      + Add field
                    </button>
                    <button
                      type="button"
                      onClick={() => setDoc((prev) => ({ ...prev, infobox: null }))}
                      className="mt-2 ml-3 text-xs text-[var(--tag-red)] hover:underline"
                    >
                      Remove infobox
                    </button>
                  </div>
                )}
                {doc.tocEnabled && (
                  <div className="card p-3 text-xs text-foreground-muted">
                    Table of contents — auto-built from your headings, shown to readers.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {imagePickerOpen && (
        <ImagePicker
          onClose={() => setImagePickerOpen(false)}
          onInsert={(url, alt) => {
            editor?.chain().focus().setImage({ src: url, alt }).run();
            setImagePickerOpen(false);
          }}
        />
      )}

      {coverPickerOpen && (
        <ImagePicker
          onClose={() => setCoverPickerOpen(false)}
          onInsert={(url) => {
            setCoverImage(url);
            setCoverPickerOpen(false);
          }}
        />
      )}

      {videoPickerOpen && (
        <VideoPicker
          onClose={() => setVideoPickerOpen(false)}
          onInsert={(url) => {
            editor?.chain().focus().setVideoEmbed({ src: toEmbedUrl(url) }).run();
            setVideoPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ToolbarIconButton({
  label, onClick, disabled, active, children,
}: { label: string; onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`min-w-7 h-7 px-1.5 flex items-center justify-center rounded-md text-sm transition-colors disabled:opacity-30 disabled:hover:bg-transparent ${
        active ? 'bg-accent-muted text-accent' : 'text-foreground-muted hover:text-foreground hover:bg-background-tertiary'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-1 shrink-0" />;
}
