'use client';

import { useState } from 'react';
import type { Block, CardGridItem, GalleryProps, InfoboxField, VideoEmbedProps } from '@/src/lib/blocks/types';
import RichTextEditor from './RichTextEditor';
import VideoPicker from './VideoPicker';

type OnChange<T extends Block> = (props: T['props']) => void;

export default function PropertiesPanel({
  block,
  onChange,
}: {
  block: Block;
  onChange: (props: Block['props']) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide pr-6">
        {block.type} settings
      </h3>
      {renderFields(block, onChange)}
    </div>
  );
}

function renderFields(block: Block, onChange: (props: Block['props']) => void) {
  switch (block.type) {
    case 'heading':
      return (
        <>
          <TextField label="Text" value={block.props.text} onChange={(text) => onChange({ ...block.props, text })} />
          <SelectField
            label="Level"
            value={String(block.props.level)}
            options={[{ value: '2', label: 'Section (H2)' }, { value: '3', label: 'Sub-section (H3)' }]}
            onChange={(v) => onChange({ ...block.props, level: Number(v) as 2 | 3 })}
          />
        </>
      );

    case 'richText':
      return (
        <RichTextEditor html={block.props.html} onChange={(html) => onChange({ ...block.props, html })} />
      );

    case 'image':
      return (
        <>
          <TextField label="Image URL" value={block.props.src} onChange={(src) => onChange({ ...block.props, src })} />
          <TextField label="Alt text" value={block.props.alt} onChange={(alt) => onChange({ ...block.props, alt })} />
          <TextField label="Caption" value={block.props.caption ?? ''} onChange={(caption) => onChange({ ...block.props, caption })} />
        </>
      );

    case 'gallery':
      return <GalleryFields props={block.props} onChange={onChange as OnChange<Extract<Block, { type: 'gallery' }>>} />;

    case 'videoEmbed':
      return <VideoEmbedFields props={block.props} onChange={onChange as OnChange<Extract<Block, { type: 'videoEmbed' }>>} />;

    case 'quote':
      return (
        <>
          <TextAreaField label="Quote" value={block.props.text} onChange={(text) => onChange({ ...block.props, text })} />
          <TextField label="Source" value={block.props.source ?? ''} onChange={(source) => onChange({ ...block.props, source })} />
        </>
      );

    case 'infobox':
      return (
        <>
          <TextField label="Title" value={block.props.title} onChange={(title) => onChange({ ...block.props, title })} />
          <TextField label="Subtitle" value={block.props.subtitle ?? ''} onChange={(subtitle) => onChange({ ...block.props, subtitle })} />
          <TextField label="Image URL" value={block.props.image ?? ''} onChange={(image) => onChange({ ...block.props, image })} />
          <TextField label="Image caption" value={block.props.imageCaption ?? ''} onChange={(imageCaption) => onChange({ ...block.props, imageCaption })} />
          <FieldListEditor
            label="Fields"
            items={block.props.fields}
            onChange={(fields) => onChange({ ...block.props, fields })}
          />
        </>
      );

    case 'tableOfContents':
      return <TextField label="Title" value={block.props.title ?? ''} onChange={(title) => onChange({ ...block.props, title })} />;

    case 'cardGrid':
      return (
        <>
          <TextField label="Title" value={block.props.title ?? ''} onChange={(title) => onChange({ ...block.props, title })} />
          <SelectField
            label="Columns"
            value={String(block.props.columns)}
            options={[2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
            onChange={(v) => onChange({ ...block.props, columns: Number(v) as 2 | 3 | 4 })}
          />
          <CardItemListEditor items={block.props.items} onChange={(items) => onChange({ ...block.props, items })} />
        </>
      );

    case 'carousel':
      return (
        <>
          <TextField label="Title" value={block.props.title ?? ''} onChange={(title) => onChange({ ...block.props, title })} />
          <CardItemListEditor items={block.props.items} onChange={(items) => onChange({ ...block.props, items })} />
        </>
      );

    case 'ctaButton':
      return (
        <>
          <TextField label="Button text" value={block.props.text} onChange={(text) => onChange({ ...block.props, text })} />
          <TextField label="Link URL" value={block.props.href} onChange={(href) => onChange({ ...block.props, href })} />
          <SelectField
            label="Style"
            value={block.props.style}
            options={[{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }]}
            onChange={(v) => onChange({ ...block.props, style: v as 'primary' | 'secondary' })}
          />
          <SelectField
            label="Alignment"
            value={block.props.align}
            options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
            onChange={(v) => onChange({ ...block.props, align: v as 'left' | 'center' | 'right' })}
          />
        </>
      );

    case 'newsletter':
      return (
        <>
          <TextField label="Title" value={block.props.title ?? ''} onChange={(title) => onChange({ ...block.props, title })} />
          <TextField label="Subtitle" value={block.props.subtitle ?? ''} onChange={(subtitle) => onChange({ ...block.props, subtitle })} />
        </>
      );

    case 'comments':
      return <TextField label="Title" value={block.props.title ?? ''} onChange={(title) => onChange({ ...block.props, title })} />;

    case 'adSlot':
      return (
        <SelectField
          label="Ad zone"
          value={block.props.zone}
          options={[
            'homepage-hero', 'homepage-sidebar', 'homepage-feed',
            'article-top', 'article-sidebar', 'article-bottom',
            'chapter-between', 'chapter-sidebar', 'navigation', 'footer',
          ].map((z) => ({ value: z, label: z }))}
          onChange={(zone) => onChange({ ...block.props, zone })}
        />
      );

    default:
      return null;
  }
}

function VideoEmbedFields({ props, onChange }: { props: VideoEmbedProps; onChange: OnChange<Extract<Block, { type: 'videoEmbed' }>> }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  return (
    <>
      <TextField label="Video URL" value={props.url} onChange={(url) => onChange({ ...props, url })} />
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="text-xs text-primary hover:underline"
      >
        Upload a video file instead
      </button>
      <TextField label="Caption" value={props.caption ?? ''} onChange={(caption) => onChange({ ...props, caption })} />
      {pickerOpen && (
        <VideoPicker
          onClose={() => setPickerOpen(false)}
          onInsert={(url) => {
            onChange({ ...props, url });
            setPickerOpen(false);
          }}
        />
      )}
    </>
  );
}

function GalleryFields({ props, onChange }: { props: GalleryProps; onChange: OnChange<Extract<Block, { type: 'gallery' }>> }) {
  const update = (i: number, patch: Partial<GalleryProps['images'][number]>) => {
    const images = props.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img));
    onChange({ ...props, images });
  };
  return (
    <>
      <SelectField
        label="Columns"
        value={String(props.columns)}
        options={[2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
        onChange={(v) => onChange({ ...props, columns: Number(v) as 2 | 3 | 4 })}
      />
      <div className="space-y-2">
        <span className="text-xs text-on-surface-variant">Images</span>
        {props.images.map((img, i) => (
          <div key={i} className="border border-outline-variant/30 rounded-lg p-2 space-y-1">
            <TextField label="URL" value={img.src} onChange={(src) => update(i, { src })} compact />
            <TextField label="Caption" value={img.caption ?? ''} onChange={(caption) => update(i, { caption })} compact />
            <RemoveButton onClick={() => onChange({ ...props, images: props.images.filter((_, idx) => idx !== i) })} />
          </div>
        ))}
        <AddButton
          label="Add image"
          onClick={() => onChange({ ...props, images: [...props.images, { src: '', alt: '' }] })}
        />
      </div>
    </>
  );
}

function FieldListEditor({ label, items, onChange }: { label: string; items: InfoboxField[]; onChange: (items: InfoboxField[]) => void }) {
  const update = (i: number, patch: Partial<InfoboxField>) => {
    onChange(items.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  };
  return (
    <div className="space-y-2">
      <span className="text-xs text-on-surface-variant">{label}</span>
      {items.map((f, i) => (
        <div key={i} className="border border-outline-variant/30 rounded-lg p-2 space-y-1">
          <TextField label="Label" value={f.label} onChange={(v) => update(i, { label: v })} compact />
          <TextField label="Value" value={f.value} onChange={(v) => update(i, { value: v })} compact />
          <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
        </div>
      ))}
      <AddButton label="Add field" onClick={() => onChange([...items, { label: '', value: '' }])} />
    </div>
  );
}

function CardItemListEditor({ items, onChange }: { items: CardGridItem[]; onChange: (items: CardGridItem[]) => void }) {
  const update = (i: number, patch: Partial<CardGridItem>) => {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };
  return (
    <div className="space-y-2">
      <span className="text-xs text-on-surface-variant">Items</span>
      {items.map((it, i) => (
        <div key={i} className="border border-outline-variant/30 rounded-lg p-2 space-y-1">
          <TextField label="Title" value={it.title} onChange={(v) => update(i, { title: v })} compact />
          <TextField label="Subtitle" value={it.subtitle ?? ''} onChange={(v) => update(i, { subtitle: v })} compact />
          <TextField label="Image URL" value={it.image ?? ''} onChange={(v) => update(i, { image: v })} compact />
          <TextField label="Link" value={it.href ?? ''} onChange={(v) => update(i, { href: v })} compact />
          <RemoveButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
        </div>
      ))}
      <AddButton label="Add item" onClick={() => onChange([...items, { title: 'New item' }])} />
    </div>
  );
}

function TextField({ label, value, onChange, compact }: { label: string; value: string; onChange: (v: string) => void; compact?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs text-on-surface-variant mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-accent transition-colors`}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs text-on-surface-variant mb-1">{label}</span>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-accent transition-colors"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs text-on-surface-variant mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-accent transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs text-primary hover:underline">
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs text-[var(--tag-red)] hover:underline">
      Remove
    </button>
  );
}
