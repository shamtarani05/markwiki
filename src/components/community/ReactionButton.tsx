'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReactionButtonProps {
  contentType: 'page' | 'book' | 'chapter' | 'blog' | 'story' | 'comment';
  contentId: string;
}

export default function ReactionButton({ contentType, contentId }: ReactionButtonProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReactions();
  }, [contentType, contentId]);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/reactions?type=${contentType}&id=${contentId}`);
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
        setUserReaction(data.userReaction);
      }
    } catch (error) {
      console.error('Failed to fetch reactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReact = async (type: 'like' | 'dislike') => {
    // Optimistic UI update
    const previousReaction = userReaction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    if (previousReaction === type) {
      // Removing reaction
      setUserReaction(null);
      if (type === 'like') setLikes(l => l - 1);
      if (type === 'dislike') setDislikes(d => d - 1);
    } else {
      // Adding or switching reaction
      setUserReaction(type);
      if (type === 'like') {
        setLikes(l => l + 1);
        if (previousReaction === 'dislike') setDislikes(d => d - 1);
      } else {
        setDislikes(d => d + 1);
        if (previousReaction === 'like') setLikes(l => l - 1);
      }
    }

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, type })
      });

      if (!res.ok) {
        // Revert optimistic update
        setUserReaction(previousReaction);
        setLikes(previousLikes);
        setDislikes(previousDislikes);

        if (res.status === 401) {
          alert('You must be logged in to leave a reaction.');
          return; // Stop execution, already handled
        }
        throw new Error('Failed to save reaction');
      }

      // Sync with server data just in case
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
    } catch (error) {
      console.error('Reaction error:', error);
      // Ensure UI is reverted if network fails
      setUserReaction(previousReaction);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
    }
  };

  if (isLoading) {
    return <div className="flex gap-2 animate-pulse">
      <div className="w-16 h-10 bg-surface-variant rounded-full"></div>
      <div className="w-16 h-10 bg-surface-variant rounded-full"></div>
    </div>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleReact('like')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-caps text-label-caps transition-all border
          ${userReaction === 'like' 
            ? 'bg-primary/10 text-primary border-primary/30 shadow-[inset_0_0_0_1px_rgba(var(--md-sys-color-primary),0.2)]' 
            : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-variant hover:text-on-surface'
          }`}
      >
        <ThumbsUp className={`w-4 h-4 ${userReaction === 'like' ? 'fill-primary' : ''}`} />
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleReact('dislike')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-caps text-label-caps transition-all border
          ${userReaction === 'dislike' 
            ? 'bg-error/10 text-error border-error/30 shadow-[inset_0_0_0_1px_rgba(var(--md-sys-color-error),0.2)]' 
            : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-variant hover:text-on-surface'
          }`}
      >
        <ThumbsDown className={`w-4 h-4 ${userReaction === 'dislike' ? 'fill-error' : ''}`} />
        {dislikes > 0 && <span>{dislikes}</span>}
      </button>
    </div>
  );
}
