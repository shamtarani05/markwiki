'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor,
  closestCenter, useDroppable, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Block, BLOCK_LABELS, BlockType, DEFAULT_BLOCK_PROPS, PageBuilderSaveData, createBlock } from '@/src/lib/blocks/types';
import { PageTemplate } from '@/src/lib/blocks/templates';
import { BlockListRenderer } from '@/src/components/blocks/BlockRenderer';
import InsertMenu from './InsertMenu';
import SortableBlock from './SortableBlock';
import PropertiesPanel from './PropertiesPanel';
import TemplatePicker from './TemplatePicker';
import ImagePicker from './ImagePicker';

const SINGLETON_TYPES = new Set<BlockType>(['infobox', 'tableOfContents']);

export default function PageBuilder({
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
  // Wiki-style edit summary + revision history only make sense once a page
  // already exists — the create flow (app/admin/wiki/new) doesn't pass this.
  showEditSummary?: boolean;
  onSave: (data: PageBuilderSaveData) => void | Promise<void>;
  saving?: boolean;
}) {
  const [started, setStarted] = useState(initialBlocks.length > 0);
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [blocks, setBlocksRaw] = useState<Block[]>(initialBlocks);
  const [templateKey, setTemplateKey] = useState<string | undefined>(initialTemplateKey);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [editSummary, setEditSummary] = useState('');
  const [draggingLabel, setDraggingLabel] = useState<string | null>(null);

  // Undo/redo history — a linear stack of full block-array snapshots.
  // Structural edits (add/delete/duplicate/reorder) push immediately;
  // in-progress typing (block property edits) is debounced so undo steps
  // through typing sessions rather than one keystroke at a time.
  const history = useRef<Block[][]>([initialBlocks]);
  const historyIndex = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, forceRender] = useState(0);

  const pushHistory = (next: Block[]) => {
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(next);
    historyIndex.current = history.current.length - 1;
    forceRender((n) => n + 1);
  };

  const setBlocks = (updater: Block[] | ((prev: Block[]) => Block[]), debounceMs = 0) => {
    setBlocksRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (debounceMs > 0) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => pushHistory(next), debounceMs);
      } else {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        pushHistory(next);
      }
      return next;
    });
  };

  useEffect(() => () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); }, []);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < history.current.length - 1;

  const undo = () => {
    if (!canUndo) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    historyIndex.current -= 1;
    setBlocksRaw(history.current[historyIndex.current]);
    forceRender((n) => n + 1);
  };

  const redo = () => {
    if (!canRedo) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    historyIndex.current += 1;
    setBlocksRaw(history.current[historyIndex.current]);
    forceRender((n) => n + 1);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const { setNodeRef: setEndDropRef, isOver: isOverEnd } = useDroppable({ id: 'canvas-end' });

  if (!started) {
    return (
      <TemplatePicker
        onSelect={(t: PageTemplate) => {
          setBlocksRaw(t.build());
          history.current = [t.build()];
          historyIndex.current = 0;
          setTemplateKey(t.key);
          setStarted(true);
        }}
      />
    );
  }

  const headings = blocks.filter((b) => b.type === 'heading');
  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  const addBlock = (type: BlockType, atIndex?: number) => {
    // Only one infobox / table of contents makes sense per page — this is
    // the single choke point both click-to-add and drag-to-insert go
    // through, so neither path can create a duplicate.
    if (SINGLETON_TYPES.has(type) && blocks.some((b) => b.type === type)) return;

    const block = createBlock(type, DEFAULT_BLOCK_PROPS[type]);
    setBlocks((prev) => {
      if (atIndex === undefined) return [...prev, block];
      const next = [...prev];
      next.splice(atIndex, 0, block);
      return next;
    });
    setSelectedId(block.id);
  };

  const updateBlockProps = (id: string, props: Block['props']) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, props } as Block) : b)), 500);
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  };

  const duplicateBlock = (id: string) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      const clone = createBlock(prev[index].type, prev[index].props) as Block;
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (id.startsWith('palette:')) {
      const type = event.active.data.current?.blockType as BlockType;
      setDraggingLabel(BLOCK_LABELS[type]);
    } else {
      const block = blocks.find((b) => b.id === id);
      if (block) setDraggingLabel(BLOCK_LABELS[block.type]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingLabel(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);

    // Dragging a new block in from the Insert menu.
    if (activeId.startsWith('palette:')) {
      const type = active.data.current?.blockType as BlockType;
      if (over.id === 'canvas-end') {
        addBlock(type);
      } else {
        const overIndex = blocks.findIndex((b) => b.id === over.id);
        addBlock(type, overIndex === -1 ? undefined : overIndex + 1);
      }
      return;
    }

    // Reordering an existing block.
    if (active.id === over.id) return;
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div>
      {/* Toolbar — one ribbon strip: history, insert, view mode, publish */}
      <div className="flex items-center gap-1 mb-3 px-2 py-1.5 border border-[rgba(255,255,255,0.09)] rounded-lg bg-[#121218]">
        <ToolbarIconButton label="Undo" onClick={undo} disabled={!canUndo}>↺</ToolbarIconButton>
        <ToolbarIconButton label="Redo" onClick={redo} disabled={!canRedo}>↻</ToolbarIconButton>
        <Divider />
        {mode === 'edit' && (
          <InsertMenu onAdd={(type) => addBlock(type)} existingTypes={new Set(blocks.map((b) => b.type))} />
        )}
        <Divider />
        <div className="flex rounded-md border border-[rgba(255,255,255,0.09)] overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-2.5 py-1 text-xs ${mode === 'edit' ? 'bg-primary text-[#8B5CF6]-contrast' : 'text-[#706F78] hover:bg-[#181820]'}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-2.5 py-1 text-xs ${mode === 'preview' ? 'bg-primary text-[#8B5CF6]-contrast' : 'text-[#706F78] hover:bg-[#181820]'}`}
          >
            Preview
          </button>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          disabled={saving || (showEditSummary && !editSummary.trim())}
          title={showEditSummary && !editSummary.trim() ? 'Enter an edit summary describing what you changed before saving' : undefined}
          onClick={() => onSave({ title, blocks, templateKey, editSummary, coverImage })}
          className="btn btn-primary text-sm py-1.5 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Cover image — used as the card thumbnail in admin list views and as
          the social/og:image when this page is shared or indexed */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => setCoverPickerOpen(true)}
          className="relative w-16 h-10 rounded-md border border-[rgba(255,255,255,0.09)] bg-[#121218] overflow-hidden shrink-0 flex items-center justify-center text-[#706F78] hover:border-accent transition-colors"
          title={coverImage ? 'Change cover image' : 'Add a cover image'}
        >
          {coverImage ? (
            <>
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-[#121218]" />
            </>
          ) : (
            <span className="text-xs">+</span>
          )}
        </button>
        <span className="text-xs text-[#706F78]">
          {coverImage ? 'Cover image set' : 'No cover image — used as the card thumbnail and social preview'}
        </span>
        {coverImage && (
          <button type="button" onClick={() => setCoverImage('')} className="text-xs text-[var(--tag-red)] hover:underline">
            Remove
          </button>
        )}
      </div>

      {/* Page title — styled like a wiki article heading, not a form field */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled page"
        className="w-full text-4xl font-bold bg-transparent text-[#F5F3EF] focus:outline-none mb-1 pb-2 border-b border-[rgba(255,255,255,0.09)]"
      />

      {showEditSummary && (
        <input
          type="text"
          required
          value={editSummary}
          onChange={(e) => setEditSummary(e.target.value)}
          placeholder="Edit summary (required) — briefly describe what you changed"
          maxLength={500}
          className="w-full mt-3 mb-1 px-3 py-2 text-sm bg-[#121218] border border-[rgba(255,255,255,0.09)] rounded-lg text-[#F5F3EF] placeholder:text-[#706F78] focus:outline-none focus:border-accent transition-colors"
        />
      )}

      <div className="mt-6">
        {mode === 'preview' ? (
          <BlockListRenderer blocks={blocks} />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div>
              {blocks.length === 0 ? (
                <div ref={setEndDropRef} className={`ad-zone transition-colors ${isOverEnd ? 'border-accent text-[#8B5CF6]' : ''}`}>
                  Add your first block from &ldquo;Insert block&rdquo; above, or drag one onto the page.
                </div>
              ) : (
                <>
                  <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {blocks.map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          headings={headings}
                          selected={block.id === selectedId}
                          onSelect={() => setSelectedId(block.id)}
                          onDelete={() => deleteBlock(block.id)}
                          onDuplicate={() => duplicateBlock(block.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <div
                    ref={setEndDropRef}
                    className={`h-10 rounded-md border border-dashed transition-colors ${
                      isOverEnd ? 'border-accent bg-[rgba(139,92,246,0.14)]' : 'border-transparent'
                    }`}
                  />
                </>
              )}
            </div>

            <DragOverlay>
              {draggingLabel ? (
                <div className="btn btn-secondary text-sm shadow-lg pointer-events-none">{draggingLabel}</div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Properties drawer — only takes up space when a block is selected,
          so the page keeps its full width the rest of the time. */}
      {mode === 'edit' && selectedBlock && (
        <div className="fixed right-4 top-20 bottom-4 w-80 bg-surface-container-high border border-outline-variant/30 rounded-xl p-4 overflow-y-auto shadow-2xl z-50 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label="Close settings"
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded text-[#706F78] hover:text-[#F5F3EF] hover:bg-[#181820]"
          >
            ✕
          </button>
          <PropertiesPanel
            block={selectedBlock}
            onChange={(props) => updateBlockProps(selectedBlock.id, props)}
          />
        </div>
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
    </div>
  );
}

function ToolbarIconButton({
  label, onClick, disabled, children,
}: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#706F78] hover:text-[#F5F3EF] hover:bg-[#181820] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-[rgba(255,255,255,0.09)] mx-1" />;
}
