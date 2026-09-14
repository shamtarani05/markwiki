'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImagePicker from '@/src/components/admin/builder/ImagePicker';

export default function BlogEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(postId ? true : false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (postId) {
      async function loadData() {
        try {
          const res = await fetch(`/api/admin/blog/${postId}`);
          if (res.ok) {
            const data = await res.json();
            const p = data.post;
            setTitle(p.title || '');
            setSlug(p.slug || '');
            setExcerpt(p.excerpt || '');
            setContent(p.content || '');
            setCoverImage(p.coverImage || '');
            setTags((p.tags || []).join(', '));
            setStatus(p.status || 'draft');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }
  }, [postId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!postId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
      };

      const url = postId ? `/api/admin/blog/${postId}` : '/api/admin/blog';
      const method = postId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save post');
      } else {
        const data = await res.json();
        if (!postId) {
          router.push(`/admin/blog/${data.post._id}`);
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
    if (!postId) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/blog');
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
          <Link href="/admin/blog" className="p-2 rounded hover:bg-surface-container-low text-on-surface-variant">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-on-surface">
            {postId ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {postId && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded"
              title="Delete Post"
            >
              <Trash2 size={20} />
            </button>
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
            Save Post
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Post Title"
              className="w-full text-2xl font-bold bg-transparent text-on-surface focus:outline-none placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="flex-1 p-0 overflow-y-auto">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post here..."
              className="w-full h-full min-h-[500px] p-6 bg-surface-container-lowest text-on-surface focus:outline-none resize-none prose prose-wiki max-w-none"
            />
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto">
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Settings</h2>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
                />
                <button
                  onClick={() => setShowImagePicker(true)}
                  className="btn btn-secondary px-3"
                  type="button"
                >
                  Pick
                </button>
              </div>
              {coverImage && (
                <div className="mt-2 aspect-video w-full rounded border border-outline-variant/30 overflow-hidden bg-surface-container-low relative">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary..."
                className="w-full h-24 bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent resize-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="news, update, feature"
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-on-surface focus:outline-none focus:border-accent text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      {showImagePicker && (
        <ImagePicker
          onInsert={(url) => {
            setCoverImage(url);
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}
