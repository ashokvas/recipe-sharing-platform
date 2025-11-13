'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateComment, deleteComment } from '@/app/actions/comments';
import type { CommentWithAuthor } from '@/lib/supabase/types';

interface CommentItemProps {
  comment: CommentWithAuthor;
  currentUserId?: string;
}

export function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || '');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Ensure IDs are strings for comparison - get raw values first
  const rawCommentUserId = comment.user_id;
  const rawCurrentUserId = currentUserId;
  
  // Convert to strings and normalize
  const commentUserId = rawCommentUserId ? String(rawCommentUserId).trim().toLowerCase() : '';
  const currentUserIdStr = rawCurrentUserId ? String(rawCurrentUserId).trim().toLowerCase() : '';
  const commentIdStr = String(comment.id || '').trim();

  // CRITICAL: Strict ownership check - IDs must match exactly
  // Only show buttons if:
  // 1. User is logged in (currentUserIdStr exists)
  // 2. Comment has a user_id (commentUserId exists)
  // 3. Both IDs are non-empty strings
  // 4. IDs match exactly (case-insensitive)
  const isOwner = Boolean(
    rawCurrentUserId &&           // Must have current user ID
    rawCommentUserId &&           // Must have comment user ID
    currentUserIdStr.length > 0 && // Current user ID must not be empty
    commentUserId.length > 0 &&    // Comment user ID must not be empty
    currentUserIdStr === commentUserId && // Must match exactly
    typeof rawCommentUserId === 'string' && // Ensure it's a string type
    typeof rawCurrentUserId === 'string'    // Ensure it's a string type
  );
  const authorName = comment.profiles?.username || comment.profiles?.full_name || comment.profiles?.email || 'Anonymous';
  const isEdited = comment.updated_at && comment.created_at && comment.updated_at !== comment.created_at;

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    const idsMatch = currentUserIdStr === commentUserId;
    console.log('CommentItem Ownership Check:', {
      commentId: commentIdStr,
      commentAuthor: authorName,
      rawCommentUserId,
      rawCurrentUserId,
      commentUserId,
      currentUserIdStr,
      isOwner,
      idsMatch,
      commentUserType: typeof rawCommentUserId,
      currentUserType: typeof rawCurrentUserId,
      commentUserIdLength: commentUserId.length,
      currentUserIdLength: currentUserIdStr.length,
      bothAreStrings: typeof rawCommentUserId === 'string' && typeof rawCurrentUserId === 'string',
      bothNonEmpty: commentUserId.length > 0 && currentUserIdStr.length > 0,
      WARNING: idsMatch ? 'IDs MATCH - This is YOUR comment' : 'IDs DO NOT MATCH - This is NOT your comment',
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!editContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    startTransition(async () => {
      const result = await updateComment(commentIdStr, editContent);

      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        // Refresh the page to show updated comment
        router.refresh();
      }
    });
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    startTransition(async () => {
      const result = await deleteComment(commentIdStr);

      if (result.error) {
        alert(result.error);
      } else {
        // Refresh the page to show updated comments
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      {/* Author Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-semibold">
            {authorName[0]?.toUpperCase() || '?'}
          </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{authorName}</p>
                        {isOwner && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 'Recently'}
                        {isEdited && <span className="ml-2 italic">(edited)</span>}
                      </p>
                    </div>
        </div>

        {/* Action Buttons (ONLY for comment owner - strict check) */}
        {(() => {
          // CRITICAL: Multiple checks before showing buttons
          // 1. User must be logged in
          // 2. Comment must have a user_id
          // 3. IDs must match exactly
          // 4. User must not be in editing mode
          
          if (!rawCurrentUserId || !currentUserIdStr) {
            // User not logged in - never show buttons
            return null;
          }
          
          if (!rawCommentUserId || !commentUserId) {
            // Comment has no owner - never show buttons
            return null;
          }
          
          // Re-verify ownership before rendering buttons
          const verifyOwnership = Boolean(
            currentUserIdStr === commentUserId && // Must match exactly
            !isEditing &&                          // Not in edit mode
            typeof rawCommentUserId === 'string' && // Type check
            typeof rawCurrentUserId === 'string'    // Type check
          );
          
          // Only render if ownership is verified AND user is not editing
          if (!verifyOwnership) {
            return null; // Don't render buttons at all
          }
          
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Final ownership check before action
                  if (currentUserIdStr === commentUserId) {
                    setIsEditing(true);
                  } else {
                    console.error('Ownership check failed on click');
                    alert('You can only edit your own comments');
                  }
                }}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Final ownership check before action
                  if (currentUserIdStr === commentUserId) {
                    handleDelete();
                  } else {
                    console.error('Ownership check failed on click');
                    alert('You can only delete your own comments');
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                Delete
              </button>
            </div>
          );
        })()}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            disabled={isPending}
            maxLength={2000}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none disabled:bg-gray-50"
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending || !editContent.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
                setError(null);
              }}
              disabled={isPending}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap break-words">{comment.content || '(No content)'}</p>
      )}
    </div>
  );
}

