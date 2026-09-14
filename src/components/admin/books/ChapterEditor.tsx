'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Eye, GripVertical, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import ImagePicker from '@/src/components/admin/builder/ImagePicker';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableImageItem({ image, index, onRemove, onChange }: { image: string; index: number; onRemove: () => void; onChange: (url: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `image-${index}` });
  const [showPicker, setShowPicker] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg ${isDragging ? 'shadow-xl scale-[1.02] border-accent' : 'hover:border-accent/50'}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-on-surface-variant hover:text-primary">
        <GripVertical size={16} />
      </div>
      
      <div className="w-16 h-16 rounded border border-outline-variant/30 overflow-hidden bg-surface-container-low shrink-0 relative flex items-center justify-center group cursor-pointer" onClick={() => setShowPicker(true)}>
        {image ? (
          <img src={image} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={20} className="text-on-surface-variant" />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="text-white text-[10px] font-medium">Edit</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Page {index + 1} URL</div>
        <input
          type="text"
          value={image}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-1.5 text-on-surface focus:outline-none focus:border-accent text-sm"
        />
      </div>
      
      <button onClick={onRemove} className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded transition-colors shrink-0">
        <Trash2 size={16} />
      </button>

      {showPicker && (
        <ImagePicker
          onInsert={(url) => {
            onChange(url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// Simple text editor for now, could be upgraded to TipTap later
export default function ChapterEditor({ bookId, chapterId, bookFormat = 'novel' }: { bookId: string, chapterId?: string, bookFormat?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(chapterId ? true : false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [chapterNumber, setChapterNumber] = useState<number | ''>('');
  const [authorNote, setAuthorNote] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!chapterId) {
      // Auto-fetch the next chapter number for new chapters
      fetch(`/api/admin/books/${bookId}/chapters`)
        .then(res => res.json())
        .then(data => {
          if (data.chapters) {
            setChapterNumber(data.chapters.length + 1);
          }
        });
      return;
    }

    async function loadData() {
      try {
        const res = await fetch(`/api/admin/books/${bookId}/chapters/${chapterId}`);
        if (res.ok) {
          const data = await res.json();
          const c = data.chapter;
          setTitle(c.title || '');
          setSlug(c.slug || '');
          setContent(c.content || '');
          setImages(c.images || []);
          setChapterNumber(c.chapterNumber ?? '');
          setAuthorNote(c.authorNote || '');
          setIsPublished(c.isPublished || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bookId, chapterId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!chapterId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        content: bookFormat === 'novel' ? content : undefined,
        images: bookFormat === 'webtoon' ? images : undefined,
        chapterNumber: Number(chapterNumber),
        authorNote,
        isPublished,
      };

      const url = chapterId 
        ? `/api/admin/books/${bookId}/chapters/${chapterId}` 
        : `/api/admin/books/${bookId}/chapters`;
      const method = chapterId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save chapter');
      } else {
        const data = await res.json();
        if (!chapterId) {
          router.push(`/admin/books/${bookId}/chapters/${data.chapter._id}`);
        } else {
          alert('Saved successfully');
        }
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!chapterId) return;
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/books/${bookId}/chapters/${chapterId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push(`/admin/books/${bookId}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = parseInt(String(active.id).replace('image-', ''));
        const newIndex = parseInt(String(over.id).replace('image-', ''));
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/admin/books/${bookId}`} className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-on-surface">
            {chapterId ? 'Edit Chapter' : 'New Chapter'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {chapterId && (
            <>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                title="Delete Chapter"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            Save Chapter
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-sm overflow-hidden">
          {/* Content Area */}
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Chapter Title"
              className="w-full text-2xl font-bold bg-transparent text-on-surface focus:outline-none placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="flex-1 p-0 overflow-y-auto">
            {bookFormat === 'webtoon' ? (
              <div className="p-6 bg-surface-container-low min-h-[500px] flex flex-col items-center">
                <div className="w-full max-w-2xl space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-on-surface">Vertical Image Strip</h3>
                    <button
                      onClick={() => setImages([...images, ''])}
                      className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Image
                    </button>
                  </div>
                  
                  {images.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-outline-variant/30 rounded-lg text-on-surface-variant text-sm bg-surface-container-lowest">
                      No images added yet. Click "Add Image" to start your strip.
                    </div>
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={images.map((_, i) => `image-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {images.map((img, i) => (
                            <SortableImageItem
                              key={`image-${i}`}
                              index={i}
                              image={img}
                              onChange={(url) => {
                                const newImages = [...images];
                                newImages[i] = url;
                                setImages(newImages);
                              }}
                              onRemove={() => {
                                const newImages = [...images];
                                newImages.splice(i, 1);
                                setImages(newImages);
                              }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your chapter here..."
                className="w-full h-full min-h-[500px] p-6 bg-surface-container-lowest text-on-surface focus:outline-none resize-none prose prose-wiki max-w-none"
              />
            )}
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto">
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Settings</h2>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Chapter Number</label>
              <input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/30 mt-4">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-accent bg-surface-container-lowest"
              />
              <label htmlFor="isPublished" className="text-sm text-on-surface">
                Published (Visible to readers)
              </label>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Author's Note</h2>
            <textarea
              value={authorNote}
              onChange={(e) => setAuthorNote(e.target.value)}
              placeholder="Notes to appear at the end of the chapter..."
              className="w-full h-32 bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
