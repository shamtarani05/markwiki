'use client';

import { useEffect, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BLOCK_DESCRIPTIONS, BLOCK_LABELS, BlockType } from '@/src/lib/blocks/types';

const PALETTE_ORDER: BlockType[] = [
  'heading', 'richText', 'image', 'gallery', 'videoEmbed', 'quote',
  'infobox', 'tableOfContents', 'cardGrid', 'carousel',
  'ctaButton', 'newsletter', 'comments', 'adSlot',
];

// Only one of these makes sense per page (there's exactly one infobox slot,
// one auto-generated contents box) — offering a second just invites the
// duplicate-Contents-box bug, so these grey out once one already exists.
const SINGLETON_TYPES = new Set<BlockType>(['infobox', 'tableOfContents']);

// The "Insert" ribbon control — click a block to add it at the end, or drag
// it straight onto the page to drop it exactly where you want it.
export default function InsertMenu({
  onAdd,
  existingTypes,
}: {
  onAdd: (type: BlockType) => void;
  existingTypes: Set<BlockType>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn btn-secondary text-sm"
      >
        + Insert block
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-surface-container-high border border-outline-variant/30 rounded-xl p-2 shadow-2xl max-h-[70vh] overflow-y-auto backdrop-blur-xl">
          <p className="px-2 py-1 mb-1 text-[11px] font-label-mono text-on-surface-variant uppercase tracking-wider">Click to add, or drag onto the page</p>
          {PALETTE_ORDER.map((type) => {
            const disabled = SINGLETON_TYPES.has(type) && existingTypes.has(type);
            return (
              <PaletteItem
                key={type}
                type={type}
                disabled={disabled}
                onPick={() => {
                  if (disabled) return;
                  onAdd(type);
                  setOpen(false);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaletteItem({ type, onPick, disabled }: { type: BlockType; onPick: () => void; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { source: 'palette', blockType: type },
    disabled,
  });

  return (
    <button
      ref={setNodeRef}
      {...(disabled ? {} : listeners)}
      {...attributes}
      type="button"
      disabled={disabled}
      onClick={onPick}
      title={disabled ? `Already on this page — there's only one ${BLOCK_LABELS[type]}` : BLOCK_DESCRIPTIONS[type]}
      style={{ touchAction: 'none' }}
      className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors select-none ${
        disabled
          ? 'text-[#706F78] cursor-not-allowed'
          : `cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : 'text-[#F5F3EF] hover:bg-[#181820]'}`
      }`}
    >
      {BLOCK_LABELS[type]}
    </button>
  );
}
