'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, CornerDownRight } from 'lucide-react';
import ReactionButton from './ReactionButton';

interface CommentAuthor {
  _id: string;
  name: string;
  image?: string;
}

interface IComment {
  _id: string;
  author: CommentAuthor;
  content: string;
  parent?: string;
  createdAt: string;
}

interface CommentSectionProps {
  contentType: 'page' | 'book' | 'chapter' | 'blog' | 'story';
  contentId: string;
}

export default function CommentSection({ contentType, contentId }: CommentSectionProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?type=${contentType}&id=${contentId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          contentId,
          content: newComment,
          parent: parentId
        })
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('You must be logged in to leave a comment.');
        } else {
          throw new Error('Failed to post comment');
        }
        return;
      }

      setNewComment('');
      setReplyTo(null);
      fetchComments(); // Refresh list to get new comment with author populated
    } catch (error) {
      console.error(error);
      alert('An error occurred while posting your comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Organize comments into threads
  const topLevelComments = comments.filter(c => !c.parent);
  const getReplies = (parentId: string) => comments.filter(c => c.parent === parentId).reverse(); // Reverse to show oldest replies first

  if (isLoading) {
    return <div className="animate-pulse space-y-4 py-8">
      <div className="w-48 h-8 bg-surface-variant rounded"></div>
      <div className="w-full h-32 bg-surface-container rounded-xl"></div>
    </div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-space-xl border-t border-outline-variant/30 mt-space-2xl">
      <div className="flex items-center gap-3 mb-space-lg">
        <MessageSquare className="text-primary w-6 h-6" />
        <h3 className="font-headline-md text-on-surface">Discussion ({comments.length})</h3>
      </div>

      {/* Main Comment Box */}
      <form onSubmit={(e) => handleSubmit(e, null)} className="mb-space-xl">
        <div className="relative group">
          <textarea
            value={!replyTo ? newComment : ''}
            onChange={(e) => {
              if (replyTo) setReplyTo(null);
              setNewComment(e.target.value);
            }}
            placeholder="Share your thoughts on this..."
            className="w-full bg-surface-container-low text-on-surface font-body-default p-4 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all min-h-[120px] resize-y placeholder:text-on-surface-variant/50"
          ></textarea>
          <div className="absolute bottom-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
            <button 
              type="submit" 
              disabled={isSubmitting || !!replyTo || !newComment.trim()}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-space-xl">
        {topLevelComments.length === 0 ? (
          <p className="text-on-surface-variant font-body-default text-center py-space-xl border-2 border-dashed border-outline-variant/30 rounded-2xl">
            No comments yet. Be the first to start the discussion!
          </p>
        ) : (
          topLevelComments.map(comment => (
            <div key={comment._id} className="flex gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                {comment.author?.image ? (
                  <img src={comment.author.image} alt={comment.author.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-headline-sm shadow-sm border border-outline-variant/20">
                    {comment.author?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-surface-container-low rounded-2xl rounded-tl-none p-5 shadow-sm border border-outline-variant/20">
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <span className="font-label-lg text-on-surface truncate">{comment.author?.name || 'Anonymous'}</span>
                    <span className="font-label-sm text-on-surface-variant shrink-0">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="font-body-default text-on-surface-variant whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3 ml-2">
                  <ReactionButton contentType="comment" contentId={comment._id} />
                  <button 
                    onClick={() => { setReplyTo(comment._id); setNewComment(''); }}
                    className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Box */}
                {replyTo === comment._id && (
                  <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="relative">
                      <textarea
                        autoFocus
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full bg-surface-container-lowest text-on-surface font-body-default p-4 rounded-xl border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all min-h-[100px] resize-y"
                      ></textarea>
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          type="button" 
                          onClick={() => { setReplyTo(null); setNewComment(''); }}
                          className="px-4 py-2 rounded-full font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-variant transition-colors uppercase"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !newComment.trim()}
                          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Nested Replies */}
                <div className="mt-4 space-y-4">
                  {getReplies(comment._id).map(reply => (
                    <div key={reply._id} className="flex gap-4">
                      <div className="shrink-0 mt-2">
                        <CornerDownRight className="w-5 h-5 text-outline-variant" />
                      </div>
                      <div className="shrink-0">
                        {reply.author?.image ? (
                          <img src={reply.author.image} alt={reply.author.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md shadow-sm">
                            {reply.author?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-surface-container rounded-2xl rounded-tl-none p-4 shadow-sm border border-outline-variant/10">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <span className="font-label-md text-on-surface truncate">{reply.author?.name || 'Anonymous'}</span>
                            <span className="font-label-sm text-on-surface-variant shrink-0">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="font-body-sm text-on-surface-variant whitespace-pre-wrap">{reply.content}</p>
                        </div>
                        <div className="mt-2 ml-2">
                          <ReactionButton contentType="comment" contentId={reply._id} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
