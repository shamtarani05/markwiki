'use client';

import { useEffect, useState } from 'react';
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
import { GripVertical, Plus, Trash2, ExternalLink } from 'lucide-react';
import type { NavItem } from '@/src/lib/db/getNavigationConfig';

function SortableLink({
  link,
  onChange,
  onRemove,
}: {
  link: NavItem;
  onChange: (updates: Partial<NavItem>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.label + link.url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border rounded-lg mb-2 flex items-center p-2 gap-3 transition-colors ${
        isDragging ? 'border-accent shadow-xl opacity-90' : 'border-border'
      }`}
    >
      <button
        className="p-1.5 text-foreground-muted hover:text-foreground cursor-grab active:cursor-grabbing rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <input
        type="text"
        value={link.label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Link Label"
        className="w-1/3 min-w-0 bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-accent text-sm"
      />

      <input
        type="text"
        value={link.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="/url-path or https://..."
        className="flex-1 min-w-0 bg-background border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-accent text-sm"
      />

      <label className="flex items-center gap-1.5 text-xs text-foreground-muted cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={link.isExternal}
          onChange={(e) => onChange({ isExternal: e.target.checked })}
          className="rounded border-border bg-background text-accent focus:ring-accent/20"
        />
        <ExternalLink size={12} />
      </label>

      <button
        onClick={onRemove}
        className="p-1.5 rounded hover:bg-red-500/10 text-foreground-muted hover:text-red-500 transition-colors shrink-0 ml-2"
        title="Remove link"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function AdminNavigationBuilder() {
  const [mainLinks, setMainLinks] = useState<NavItem[]>([]);
  const [footerLinks, setFooterLinks] = useState<NavItem[]>([]);
  const [social, setSocial] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetch('/api/admin/navigation')
      .then((res) => res.json())
      .then((data) => {
        if (data.navigation) {
          setMainLinks(data.navigation.main || []);
          setFooterLinks(data.navigation.footer || []);
        }
        if (data.social) {
          setSocial(data.social);
        }
        setLoading(false);
      });
  }, []);

  const handleDragEndMain = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMainLinks((items) => {
        const oldIndex = items.findIndex((i) => (i.label + i.url) === active.id);
        const newIndex = items.findIndex((i) => (i.label + i.url) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEndFooter = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFooterLinks((items) => {
        const oldIndex = items.findIndex((i) => (i.label + i.url) === active.id);
        const newIndex = items.findIndex((i) => (i.label + i.url) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addMainLink = () => {
    setMainLinks([...mainLinks, { label: 'New Link', url: '/', order: mainLinks.length, isExternal: false }]);
  };

  const addFooterLink = () => {
    setFooterLinks([...footerLinks, { label: 'New Link', url: '/', order: footerLinks.length, isExternal: false }]);
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/navigation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navigation: { main: mainLinks, footer: footerLinks },
          social,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Navigation & Social</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-sm px-4"
          >
            Preview Site
          </a>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="btn btn-primary text-sm px-6"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto space-y-12 pb-32">
        {/* Main Header Navigation */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Header Links</h2>
              <p className="text-sm text-foreground-muted">Main navigation items shown at the top of every page.</p>
            </div>
            <button
              onClick={addMainLink}
              className="btn btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Link
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndMain}>
            <SortableContext items={mainLinks.map((s) => s.label + s.url)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {mainLinks.map((link, i) => (
                  <SortableLink
                    key={link.label + link.url + i}
                    link={link}
                    onChange={(updates) => {
                      const newLinks = [...mainLinks];
                      newLinks[i] = { ...newLinks[i], ...updates };
                      setMainLinks(newLinks);
                    }}
                    onRemove={() => {
                      const newLinks = [...mainLinks];
                      newLinks.splice(i, 1);
                      setMainLinks(newLinks);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {mainLinks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg text-foreground-muted text-sm">
              No header links configured.
            </div>
          )}
        </section>

        {/* Footer Navigation */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Footer Links</h2>
              <p className="text-sm text-foreground-muted">Links shown at the bottom of every page.</p>
            </div>
            <button
              onClick={addFooterLink}
              className="btn btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5"
            >
              <Plus size={16} /> Add Link
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndFooter}>
            <SortableContext items={footerLinks.map((s) => s.label + s.url)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {footerLinks.map((link, i) => (
                  <SortableLink
                    key={link.label + link.url + i}
                    link={link}
                    onChange={(updates) => {
                      const newLinks = [...footerLinks];
                      newLinks[i] = { ...newLinks[i], ...updates };
                      setFooterLinks(newLinks);
                    }}
                    onRemove={() => {
                      const newLinks = [...footerLinks];
                      newLinks.splice(i, 1);
                      setFooterLinks(newLinks);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {footerLinks.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg text-foreground-muted text-sm">
              No footer links configured.
            </div>
          )}
        </section>

        {/* Social Links */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Social Links</h2>
          <div className="bg-card border border-border rounded-lg p-6 grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Twitter URL</label>
              <input
                type="text"
                value={social.twitter || ''}
                onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Discord URL</label>
              <input
                type="text"
                value={social.discord || ''}
                onChange={(e) => setSocial({ ...social, discord: e.target.value })}
                placeholder="https://discord.gg/..."
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={social.instagram || ''}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Facebook URL</label>
              <input
                type="text"
                value={social.facebook || ''}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-accent text-sm"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
