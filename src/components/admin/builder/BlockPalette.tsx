'use client';

import { BLOCK_DESCRIPTIONS, BLOCK_LABELS, BlockType } from '@/src/lib/blocks/types';

const PALETTE_ORDER: BlockType[] = [
  'heading', 'richText', 'image', 'gallery', 'videoEmbed', 'quote',
  'infobox', 'tableOfContents', 'cardGrid', 'carousel',
  'ctaButton', 'newsletter', 'comments', 'adSlot',
];

export default function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#706F78] uppercase tracking-wider mb-2 px-1">
        Add a block
      </p>
      <div>
        {PALETTE_ORDER.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onAdd(type)}
            title={BLOCK_DESCRIPTIONS[type]}
            className="w-full text-left px-2 py-1.5 rounded-md text-sm text-[#706F78] hover:bg-[#181820] hover:text-[#F5F3EF] transition-colors"
          >
            {BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
