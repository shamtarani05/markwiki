'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LibraryButtonProps {
  contentType: 'book' | 'story' | 'blog' | 'page';
  contentId: string;
  initialInLibrary: boolean;
}

export default function LibraryButton({ contentType, contentId, initialInLibrary }: LibraryButtonProps) {
  const [inLibrary, setInLibrary] = useState(initialInLibrary);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLibrary = async () => {
    setIsLoading(true);
    // Optimistic update
    setInLibrary(prev => !prev);
    
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('You must be logged in to add to your library.');
        } else {
          throw new Error('Failed to update library');
        }
        // Revert optimistic update
        setInLibrary(prev => !prev);
      } else {
        const data = await res.json();
        setInLibrary(data.inLibrary);
      }
    } catch (error) {
      console.error(error);
      // Revert optimistic update
      setInLibrary(prev => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLibrary}
      disabled={isLoading}
      className={`btn px-6 py-3 flex items-center gap-2 transition-all font-bold ${
        inLibrary 
          ? 'bg-primary/20 text-primary border border-primary/50 shadow-[inset_0_0_0_1px_rgba(var(--md-sys-color-primary),0.3)] hover:bg-primary/30' 
          : 'bg-surface-container-low border border-outline-variant/30 text-on-surface hover:border-accent/50 hover:bg-surface-variant'
      }`}
    >
      <Heart size={18} className={`${inLibrary ? 'fill-primary' : ''}`} />
      <span>{inLibrary ? 'In Library' : 'Library'}</span>
    </button>
  );
}
