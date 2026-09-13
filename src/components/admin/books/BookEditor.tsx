'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, GripVertical, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableChapterItemProps {
  chapter: any;
  bookId: string;
}

function SortableChapterItem({ chapter, bookId }: SortableChapterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-background-secondary border border-border rounded-lg ${
        isDragging ? 'shadow-xl scale-[1.02] border-accent' : 'hover:border-accent/50'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-foreground-muted hover:text-accent"
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm truncate">
          Chapter {chapter.chapterNumber}: {chapter.title}
        </h4>
        <div className="text-xs text-foreground-muted flex gap-2">
          <span>{chapter.wordCount} words</span>
          <span>•</span>
          <span className={chapter.isPublished ? 'text-green-500' : 'text-yellow-500'}>
            {chapter.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/books/${bookId}/chapters/${chapter._id}`}
          className="p-1.5 text-foreground-muted hover:text-accent hover:bg-background-tertiary rounded"
        >
          <Edit size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function BookEditor({ bookId }: { bookId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [genres, setGenres] = useState('');
  const [status, setStatus] = useState('draft');
  const [format, setFormat] = useState('novel');
  
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch('/api/admin/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (bookId) {
          const bookRes = await fetch(`/api/admin/books/${bookId}`);
          if (bookRes.ok) {
            const data = await bookRes.json();
            const b = data.book;
            setTitle(b.title || '');
            setSlug(b.slug || '');
            setSynopsis(b.synopsis || '');
            setDescription(b.description || '');
            setCoverImage(b.coverImage || '');
            setCategory(b.category || '');
            setTags((b.tags || []).join(', '));
            setGenres((b.genres || []).join(', '));
            setStatus(b.status || 'draft');
            setFormat(b.format || 'novel');
          }

          const chapRes = await fetch(`/api/admin/books/${bookId}/chapters`);
          if (chapRes.ok) {
            const chapData = await chapRes.json();
            setChapters(chapData.chapters || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bookId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!bookId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        synopsis,
        description,
        coverImage,
        category: category || null,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        genres: genres.split(',').map(g => g.trim()).filter(Boolean),
        status,
        format,
      };

      const url = bookId ? `/api/admin/books/${bookId}` : '/api/admin/books';
      const method = bookId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save book');
      } else {
        const data = await res.json();
        if (!bookId) {
          router.push(`/admin/books/${data.book._id}`);
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((i) => i._id === active.id);
        const newIndex = items.findIndex((i) => i._id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Optionally: Save the new chapterNumbers to the database here
        // For simplicity in this iteration, we just update local state.
        // A true implementation would send a PATCH to update chapterNumber for all affected chapters.
        
        return newItems;
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/books" className="p-2 rounded hover:bg-background-secondary text-foreground-muted">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {bookId ? 'Edit Book' : 'New Book'}
          </h1>
        </div>
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
          Save Book
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Basic Info</h2>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="Book title..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="book-title"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Synopsis (Short)</label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent h-24"
                placeholder="Brief summary for cards..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Description (Full)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent h-40"
                placeholder="Full description..."
              />
            </div>
          </div>

          {bookId && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                <h2 className="text-lg font-bold text-foreground">Chapters</h2>
                <Link
                  href={`/admin/books/${bookId}/chapters/new`}
                  className="text-accent hover:underline text-sm font-medium flex items-center gap-1"
                >
                  <Plus size={14} /> Add Chapter
                </Link>
              </div>

              {chapters.length === 0 ? (
                <div className="text-center py-8 text-foreground-muted text-sm border-2 border-dashed border-border rounded-lg">
                  No chapters yet. Add your first chapter.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={chapters.map(c => c._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {chapters.map((chapter) => (
                        <SortableChapterItem key={chapter._id} chapter={chapter} bookId={bookId} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Metadata</h2>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              >
                <option value="novel">Novel (Text)</option>
                <option value="webtoon">Webtoon (Images)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Cover Image URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="https://..."
              />
              {coverImage && (
                <div className="mt-2 aspect-[2/3] w-32 rounded border border-border overflow-hidden bg-background-secondary mx-auto">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Genres (Comma separated)</label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="Fantasy, Action, Romance"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground-muted uppercase">Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="magic, sword, hero"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
