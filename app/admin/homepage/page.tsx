'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2, Plus, ArrowLeft, CheckCircle2, ChevronRight, LayoutTemplate, Paintbrush, Monitor, Smartphone } from 'lucide-react';
import type { Block, BlockType } from '@/src/lib/blocks/types';
import { BLOCK_LABELS, BLOCK_DESCRIPTIONS, createBlock } from '@/src/lib/blocks/types';
import Link from 'next/link';

// Restricting allowed block types for homepage
export const HOMEPAGE_SECTION_TYPES: BlockType[] = [
  'hero',
  'continueReading',
  'adSlot',
  'categories',
  'featuredWikis',
  'trendingPages',
  'community',
  'recentActivity',
  'publishCTA',
  'newsletter',
  'featuredBooks',
  'latestStories',
  'blogPosts',
];

// === Sortable Section Item (Left Sidebar) ===
function SortableSectionItem({
  block,
  onClick,
  onRemove,
}: {
  block: Block;
  onClick: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const label = BLOCK_LABELS[block.type] || block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center p-3 mb-2 rounded-xl border bg-[#0B0B0F] cursor-pointer transition-all ${
        isDragging ? 'border-primary shadow-xl scale-[1.02]' : 'border-surface-variant hover:border-primary/50 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <button
        className="p-1.5 mr-2 text-[#706F78] hover:text-[#8B5CF6] hover:bg-primary/10 rounded-lg cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </button>

      <div className="w-8 h-8 rounded-lg bg-[#181820] flex items-center justify-center text-lg mr-3 shrink-0">
        <LayoutTemplate size={16} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-headline-sm text-sm text-[#F5F3EF] truncate">{label}</h4>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 rounded hover:bg-error/10 text-error"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <ChevronRight size={16} className="text-[#706F78] opacity-30 ml-2" />
    </div>
  );
}

// === Specific Section Settings Form ===
function SectionSettingsForm({
  block,
  onChange,
}: {
  block: Block;
  onChange: (props: any) => void;
}) {
  const settings = block.props as any;
  const updateSettings = (newSettings: any) => onChange({ ...settings, ...newSettings });

  return (
    <div className="space-y-6 p-4">

      {/* Hero Settings */}
      {block.type === 'hero' && (
        <>
          <div>
            <label className="block font-label-mono text-xs text-[#706F78] mb-2">HERO TITLE HTML</label>
            <textarea
              value={settings.heroTitle ?? ''}
              onChange={(e) => updateSettings({ heroTitle: e.target.value })}
              className="w-full h-24 bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block font-label-mono text-xs text-[#706F78] mb-2">HERO SUBTITLE</label>
            <textarea
              value={settings.heroSubtitle ?? ''}
              onChange={(e) => updateSettings({ heroSubtitle: e.target.value })}
              className="w-full h-20 bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary"
            />
          </div>
        </>
      )}

      {/* Ad Zone Settings */}
      {block.type === 'adSlot' && (
        <div>
          <label className="block font-label-mono text-xs text-[#706F78] mb-2">AD ZONE</label>
          <select
            value={settings.zone || 'homepage-feed'}
            onChange={(e) => updateSettings({ zone: e.target.value })}
            className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary"
          >
            <option value="homepage-hero">Hero Header (Top)</option>
            <option value="homepage-feed">Content Feed (Middle/Bottom)</option>
          </select>
        </div>
      )}

      {/* Item Count */}
      {['featuredWikis', 'trendingPages', 'recentActivity', 'continueReading'].includes(block.type) && (
        <div>
          <label className="block font-label-mono text-xs text-[#706F78] mb-2">DISPLAY COUNT</label>
          <input
            type="number"
            min={1} max={20}
            value={settings.itemCount ?? 6}
            onChange={(e) => updateSettings({ itemCount: parseInt(e.target.value, 10) || 6 })}
            className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary"
          />
        </div>
      )}

      {/* Background Style */}
      {['categories', 'trendingPages', 'community', 'newsletter'].includes(block.type) && (
        <div>
          <label className="block font-label-mono text-xs text-[#706F78] mb-2">BACKGROUND STYLE</label>
          <select
            value={settings.backgroundStyle || 'default'}
            onChange={(e) => updateSettings({ backgroundStyle: e.target.value })}
            className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary"
          >
            <option value="default">Default Transparent (Clean)</option>
            <option value="secondary">Elevated Surface (Muted)</option>
          </select>
        </div>
      )}
      
      {/* Publish CTA Buttons */}
      {block.type === 'publishCTA' && (
        <>
          <div>
            <label className="block font-label-mono text-xs text-[#706F78] mb-2">PRIMARY BUTTON TEXT</label>
            <input
              type="text"
              value={settings.ctaPrimaryText ?? ''}
              onChange={(e) => updateSettings({ ctaPrimaryText: e.target.value })}
              className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block font-label-mono text-xs text-[#706F78] mb-2">PRIMARY BUTTON URL</label>
            <input
              type="text"
              value={settings.ctaPrimaryLink ?? ''}
              onChange={(e) => updateSettings({ ctaPrimaryLink: e.target.value })}
              className="w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-primary"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminHomepageBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [theme, setTheme] = useState({ accentColor: '#D4AF37' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((res) => res.json())
      .then((data) => {
        if (data.blocks?.length > 0) setBlocks(data.blocks);
        if (data.theme) setTheme(data.theme); // Make sure backend returns theme if possible
        setLoading(false);
      });
      
    // Listen for iframe readiness
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'LIVE_PREVIEW_READY') {
        syncPreview();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Post changes to iframe
  const syncPreview = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'LIVE_PREVIEW_UPDATE',
        data: { blocks, theme }
      }, '*');
    }
  }, [blocks, theme]);

  useEffect(() => {
    if (!loading) syncPreview();
  }, [blocks, theme, loading, syncPreview]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateBlock = (id: string, props: any) => {
    setBlocks((prev) => prev.map((s) => (s.id === id ? { ...s, props } as Block : s)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((s) => s.id !== id));
    if (editingSectionId === id) setEditingSectionId(null);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = createBlock(type, {} as any);
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddMenu(false);
    setEditingSectionId(newBlock.id);
  };

  const saveConfig = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await fetch('/api/admin/homepage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, theme }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const resetConfig = async () => {
    if (!window.confirm('Are you sure you want to reset to the default cinematic layout? This will clear all your custom blocks.')) return;
    try {
      const res = await fetch('/api/admin/homepage', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B0B0F]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const editingBlock = blocks.find(s => s.id === editingSectionId);

  return (
    <div className="h-screen w-full flex flex-col bg-surface-container overflow-hidden">
      {/* Admin Top Header */}
      <header className="h-16 shrink-0 bg-[#0B0B0F] border-b border-surface-variant flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="w-8 h-8 rounded-lg hover:bg-[#181820] flex items-center justify-center text-[#706F78]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-headline-sm font-bold text-[#F5F3EF]">Visual Editor</h1>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center bg-surface-container rounded-lg p-1">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded-md ${previewMode === 'desktop' ? 'bg-[#181820] text-[#F5F3EF]' : 'text-[#706F78] hover:text-[#F5F3EF]'}`}
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded-md ${previewMode === 'mobile' ? 'bg-[#181820] text-[#F5F3EF]' : 'text-[#706F78] hover:text-[#F5F3EF]'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetConfig}
            className="px-4 py-2 rounded-lg text-error hover:bg-error/10 text-xs font-label-caps uppercase tracking-wider transition-colors"
          >
            Reset
          </button>
          <button
            onClick={saveConfig}
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-label-caps text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              saveSuccess 
                ? 'bg-secondary text-on-secondary' 
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            {saving ? <div className="w-3 h-3 rounded-full border-2 border-on-primary border-t-transparent animate-spin" /> : null}
            {saveSuccess ? <CheckCircle2 size={16} /> : 'Save'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Shopify Style) */}
        <aside className="w-[320px] shrink-0 bg-[#0B0B0F] border-r border-surface-variant flex flex-col overflow-hidden shadow-xl z-10 relative">
          
          {/* Main Tabs - hide if editing a specific section or adding */}
          {!editingBlock && !showAddMenu && (
            <div className="flex items-center border-b border-surface-variant bg-surface-container/30">
              <button 
                onClick={() => setActiveTab('sections')}
                className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'sections' ? 'border-primary text-[#8B5CF6]' : 'border-transparent text-[#706F78] hover:text-[#F5F3EF]'}`}
              >
                <LayoutTemplate size={16} /> Sections
              </button>
              <button 
                onClick={() => setActiveTab('theme')}
                className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'theme' ? 'border-primary text-[#8B5CF6]' : 'border-transparent text-[#706F78] hover:text-[#F5F3EF]'}`}
              >
                <Paintbrush size={16} /> Theme
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            
            {/* View: Theme Settings */}
            {activeTab === 'theme' && !editingBlock && !showAddMenu && (
              <div className="p-4 animate-in fade-in slide-in-from-right-4">
                <h3 className="font-headline-sm mb-4 text-[#F5F3EF]">Theme Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-label-mono text-[#706F78] mb-2">ACCENT COLOR</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full border-2 border-surface-variant overflow-hidden shadow-inner">
                        <input 
                          type="color" 
                          value={theme.accentColor} 
                          onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                          className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={theme.accentColor}
                        onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                        className="flex-1 bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm text-[#F5F3EF] uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View: Sections List */}
            {activeTab === 'sections' && !editingBlock && !showAddMenu && (
              <div className="p-4 animate-in fade-in slide-in-from-left-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={blocks.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="min-h-[200px]">
                      {blocks.map(block => (
                        <SortableSectionItem
                          key={block.id}
                          block={block}
                          onClick={() => setEditingSectionId(block.id)}
                          onRemove={() => removeBlock(block.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                
                <button
                  onClick={() => setShowAddMenu(true)}
                  className="w-full mt-4 py-3 border-2 border-dashed border-surface-variant rounded-xl text-[#706F78] hover:text-[#8B5CF6] hover:border-primary hover:bg-primary/5 transition-colors flex justify-center items-center gap-2 text-sm font-medium"
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>
            )}

            {/* View: Add Section Menu */}
            {showAddMenu && (
              <div className="absolute inset-0 bg-[#0B0B0F] z-10 flex flex-col animate-in slide-in-from-right-8">
                <div className="flex items-center p-4 border-b border-surface-variant bg-surface-container/30 sticky top-0">
                  <button onClick={() => setShowAddMenu(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#181820] mr-3">
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="font-headline-sm text-[#F5F3EF]">Add Section</h3>
                </div>
                <div className="p-4 space-y-2 overflow-y-auto">
                  {HOMEPAGE_SECTION_TYPES.map(type => {
                    return (
                      <button
                        key={type}
                        onClick={() => addBlock(type)}
                        className="w-full text-left p-3 rounded-xl hover:bg-surface-container transition-colors flex items-center gap-3 border border-transparent hover:border-surface-variant group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#181820] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                          <LayoutTemplate size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#F5F3EF]">{BLOCK_LABELS[type]}</div>
                          <div className="text-[11px] text-[#706F78] line-clamp-1">{BLOCK_DESCRIPTIONS[type]}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View: Section Specific Settings */}
            {editingBlock && (
              <div className="absolute inset-0 bg-[#0B0B0F] z-10 flex flex-col animate-in slide-in-from-right-8">
                <div className="flex items-center p-4 border-b border-surface-variant bg-surface-container/30 sticky top-0">
                  <button onClick={() => setEditingSectionId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#181820] mr-3">
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="font-headline-sm text-[#F5F3EF] truncate pr-4">{BLOCK_LABELS[editingBlock.type]}</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SectionSettingsForm
                    block={editingBlock}
                    onChange={(props) => updateBlock(editingBlock.id, props)}
                  />
                  <div className="p-4 border-t border-surface-variant mt-8">
                    <button
                      onClick={() => removeBlock(editingBlock.id)}
                      className="w-full py-2.5 rounded-lg border border-error/30 text-error hover:bg-error/10 text-sm font-medium transition-colors"
                    >
                      Delete Section
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Live Preview Area */}
        <div className="flex-1 bg-[#181820] flex items-center justify-center overflow-hidden p-4 relative">
          <div className="absolute top-4 left-4 right-4 text-center z-0">
            <span className="px-3 py-1 bg-surface-container rounded-full text-[10px] uppercase font-label-mono text-[#706F78] tracking-wider shadow-sm">
              Live Preview
            </span>
          </div>
          <div 
            className={`bg-[#0B0B0F] shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] ${
              previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[3rem] border-8 border-surface-container-highest' : 'w-full h-full rounded-2xl border border-surface-variant'
            }`}
          >
            {/* The iframe points to the public homepage where LivePreviewWrapper will listen for updates */}
            <iframe
              ref={iframeRef}
              src="/"
              className="w-full h-full border-0 bg-[#0B0B0F]"
              title="Live Preview"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
