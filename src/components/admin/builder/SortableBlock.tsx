'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block, BlockType } from '@/src/lib/blocks/types';
import { BLOCK_LABELS } from '@/src/lib/blocks/types';
import { BlockRenderer } from '@/src/components/blocks/BlockRenderer';

// Matches BlockRenderer.tsx's SIDEBAR_TYPES — only infobox renders in the
// page's right sidebar; tableOfContents always renders in the main column,
// pinned to the top, regardless of where it sits in this list.
const SIDEBAR_TYPES = new Set<BlockType>(['infobox']);

export default function SortableBlock({
  block,
  headings,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  block: Block;
  headings: Extract<Block, { type: 'heading' }>[];
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative rounded-md pl-3 pr-1 py-2 cursor-pointer transition-colors select-none ${
        selected ? 'bg-accent-muted' : 'hover:bg-background-secondary'
      }`}
    >
      {selected && <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-accent" />}

      <div className="flex items-center justify-between mb-1 h-5">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
            style={{ touchAction: 'none' }}
            className="cursor-grab active:cursor-grabbing text-foreground-muted hover:text-foreground text-xs leading-none px-0.5 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            ⠿
          </button>
          <span className="text-[11px] text-foreground-muted select-none">{BLOCK_LABELS[block.type]}</span>
          {SIDEBAR_TYPES.has(block.type) && (
            <span className="text-[10px] text-accent border border-accent/30 rounded px-1 select-none">
              → sidebar on page
            </span>
          )}
          {block.type === 'tableOfContents' && (
            <span className="text-[10px] text-accent border border-accent/30 rounded px-1 select-none">
              → always shown first
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Duplicate block"
            title="Duplicate"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-xs text-foreground-muted hover:text-accent hover:bg-background-tertiary"
          >
            ⧉
          </button>
          <button
            type="button"
            aria-label="Delete block"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-xs text-foreground-muted hover:text-[var(--tag-red)] hover:bg-background-tertiary"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="pointer-events-none select-none">
        <BlockRenderer block={block} headings={headings} />
      </div>
    </div>
  );
}
