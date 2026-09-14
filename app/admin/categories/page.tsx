'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ICategory } from '@/src/lib/db/models/Category';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<ICategory>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openNewModal = () => {
    setIsEditing(false);
    setCurrentCategory({
      name: '',
      slug: '',
      description: '',
      icon: '',
      coverImage: '',
      order: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setIsEditing(true);
    setCurrentCategory(cat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `/api/admin/categories/${currentCategory._id}` 
        : '/api/admin/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCategory),
      });

      if (res.ok) {
        closeModal();
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Categories</h1>
          <p className="text-on-surface-variant font-body-default">Manage content domains and taxonomy for the archive.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Category
        </button>
      </div>

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant/30">
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
                    <p className="mt-2 font-label-mono">Loading taxonomy...</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    <p className="font-label-mono">No categories found.</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id.toString()} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-xl shrink-0 shadow-sm border border-outline-variant/20">
                          {cat.icon || '📁'}
                        </span>
                        <div>
                          <div className="font-headline-sm text-on-surface leading-tight">{cat.name}</div>
                          <div className="text-sm text-on-surface-variant mt-0.5 line-clamp-1 max-w-xs">{cat.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-label-mono text-label-mono text-secondary px-2.5 py-1 rounded-md bg-surface-container">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-caps text-[10px] uppercase tracking-wider border border-tertiary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-[10px] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">{cat.order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(cat)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id.toString())}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[slideDown_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container">
              <h2 className="font-headline-sm text-on-surface">{isEditing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Name</label>
                  <input 
                    required
                    type="text" 
                    value={currentCategory.name || ''}
                    onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-default"
                    placeholder="e.g. Web Novels"
                  />
                </div>
                
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Slug</label>
                  <input 
                    type="text" 
                    value={currentCategory.slug || ''}
                    onChange={(e) => setCurrentCategory({...currentCategory, slug: e.target.value})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono text-sm"
                    placeholder="e.g. web-novels"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Icon (Emoji/Text)</label>
                  <input 
                    type="text" 
                    value={currentCategory.icon || ''}
                    onChange={(e) => setCurrentCategory({...currentCategory, icon: e.target.value})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-xl"
                    placeholder="e.g. 📖"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={currentCategory.description || ''}
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                  className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-default min-h-[100px] resize-y"
                  placeholder="Short description of the category..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Display Order</label>
                  <input 
                    type="number" 
                    value={currentCategory.order || 0}
                    onChange={(e) => setCurrentCategory({...currentCategory, order: parseInt(e.target.value)})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer mt-6">
                    <input 
                      type="checkbox" 
                      checked={currentCategory.isActive !== false}
                      onChange={(e) => setCurrentCategory({...currentCategory, isActive: e.target.checked})}
                      className="w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary bg-surface-container accent-primary"
                    />
                    <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">Active</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors font-label-caps text-label-caps uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-caps text-label-caps uppercase tracking-wider shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
