'use client';

import { useState, useEffect } from 'react';
import { IAdPlacement, AdZone, AdType } from '@/src/lib/db/models/AdPlacement';

const AD_ZONES: { value: AdZone; label: string }[] = [
  { value: 'homepage-hero', label: 'Homepage Hero' },
  { value: 'homepage-feed', label: 'Homepage Feed' },
  { value: 'homepage-sidebar', label: 'Homepage Sidebar' },
  { value: 'article-top', label: 'Article Top' },
  { value: 'article-sidebar', label: 'Article Sidebar' },
  { value: 'article-bottom', label: 'Article Bottom' },
  { value: 'chapter-between', label: 'Chapter Between' },
  { value: 'chapter-sidebar', label: 'Chapter Sidebar' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'footer', label: 'Footer' },
];

const AD_TYPES: { value: AdType; label: string }[] = [
  { value: 'banner', label: 'Banner Image' },
  { value: 'adsense', label: 'Google AdSense' },
  { value: 'custom', label: 'Custom HTML' },
];

export default function AdsAdminPage() {
  const [ads, setAds] = useState<IAdPlacement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Need a partial state that matches the complex schema of AdPlacement
  const [currentAd, setCurrentAd] = useState<any>({});

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/ads');
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openNewModal = () => {
    setIsEditing(false);
    setCurrentAd({
      name: '',
      zone: 'homepage-feed',
      type: 'banner',
      content: { imageUrl: '', linkUrl: '', altText: '', adsenseCode: '', html: '' },
      dimensions: { width: 0, height: 0, responsive: true },
      targeting: {},
      schedule: {},
      priority: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ad: IAdPlacement) => {
    setIsEditing(true);
    setCurrentAd(ad);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAd({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `/api/admin/ads/${currentAd._id}` 
        : '/api/admin/ads';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAd),
      });

      if (res.ok) {
        closeModal();
        fetchAds();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save ad');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad placement?')) return;
    
    try {
      const res = await fetch(`/api/admin/ads/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAds();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete ad');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const updateContent = (field: string, value: string) => {
    setCurrentAd({
      ...currentAd,
      content: {
        ...(currentAd.content || {}),
        [field]: value
      }
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Ad Placements</h1>
          <p className="text-on-surface-variant font-body-default">Manage monetization zones and external campaigns.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Campaign
        </button>
      </div>

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant/30">
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Zone</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
                    <p className="mt-2 font-label-mono">Loading campaigns...</p>
                  </td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    <p className="font-label-mono">No ad campaigns found.</p>
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad._id.toString()} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-headline-sm text-on-surface leading-tight">{ad.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-label-mono text-label-mono text-secondary px-2.5 py-1 rounded-md bg-surface-container">
                        {ad.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">
                        {ad.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ad.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-caps text-[10px] uppercase tracking-wider border border-tertiary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-[10px] uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(ad)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(ad._id.toString())}
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
          <div className="relative bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[slideDown_0.2s_ease-out]">
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container">
              <h2 className="font-headline-sm text-on-surface">{isEditing ? 'Edit Ad Campaign' : 'New Ad Campaign'}</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Campaign Name</label>
                  <input 
                    required
                    type="text" 
                    value={currentAd.name || ''}
                    onChange={(e) => setCurrentAd({...currentAd, name: e.target.value})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-default"
                    placeholder="e.g. Summer Sale Banner"
                  />
                </div>
                
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Placement Zone</label>
                  <select
                    value={currentAd.zone || 'homepage-feed'}
                    onChange={(e) => setCurrentAd({...currentAd, zone: e.target.value})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-default"
                  >
                    {AD_ZONES.map(zone => (
                      <option key={zone.value} value={zone.value}>{zone.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Ad Type</label>
                  <select
                    value={currentAd.type || 'banner'}
                    onChange={(e) => setCurrentAd({...currentAd, type: e.target.value})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-default"
                  >
                    {AD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Content based on Ad Type */}
              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/50">
                <h3 className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/30 pb-2">Creative Content</h3>
                
                {currentAd.type === 'banner' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Image URL</label>
                      <input 
                        type="url" 
                        value={currentAd.content?.imageUrl || ''}
                        onChange={(e) => updateContent('imageUrl', e.target.value)}
                        className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Destination Link</label>
                      <input 
                        type="url" 
                        value={currentAd.content?.linkUrl || ''}
                        onChange={(e) => updateContent('linkUrl', e.target.value)}
                        className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {currentAd.type === 'adsense' && (
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">AdSense Client / Slot Code</label>
                    <textarea 
                      value={currentAd.content?.adsenseCode || ''}
                      onChange={(e) => updateContent('adsenseCode', e.target.value)}
                      className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono text-sm min-h-[100px]"
                      placeholder="<!-- Google AdSense Code -->"
                    />
                  </div>
                )}

                {currentAd.type === 'custom' && (
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Custom HTML</label>
                    <textarea 
                      value={currentAd.content?.html || ''}
                      onChange={(e) => updateContent('html', e.target.value)}
                      className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono text-sm min-h-[100px]"
                      placeholder="<div>...</div>"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Priority (Higher = First)</label>
                  <input 
                    type="number" 
                    value={currentAd.priority || 0}
                    onChange={(e) => setCurrentAd({...currentAd, priority: parseInt(e.target.value)})}
                    className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-label-mono"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer mt-6">
                    <input 
                      type="checkbox" 
                      checked={currentAd.isActive !== false}
                      onChange={(e) => setCurrentAd({...currentAd, isActive: e.target.checked})}
                      className="w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary bg-surface-container accent-primary"
                    />
                    <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">Campaign Active</span>
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
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
