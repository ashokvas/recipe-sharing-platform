'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createComment } from '@/app/actions/comments';

interface CommentFormProps {
  recipeId: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ recipeId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Please enter a comment');
      return;
    }

    startTransition(async () => {
      const result = await createComment(recipeId, content);

      if (result.error) {
        setError(result.error);
      } else {
        setContent('');
        // Refresh the page to show the new comment
        router.refresh();
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          disabled={isPending}
          maxLength={2000}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
          <span>{content.length}/2000</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

