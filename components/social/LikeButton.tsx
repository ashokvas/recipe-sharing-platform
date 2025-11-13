'use client';

import { useState, useTransition } from 'react';
import { toggleLike } from '@/app/actions/likes';

interface LikeButtonProps {
  recipeId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ recipeId, initialLiked, initialCount }: LikeButtonProps) {
  // Ensure initial count is never negative
  const safeInitialCount = Math.max(0, initialCount || 0);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(safeInitialCount);
  const [isPending, startTransition] = useTransition();

  async function handleLike() {
    // Prevent multiple clicks while pending
    if (isPending) {
      return;
    }

    // Optimistic update
    const previousLiked = liked;
    const previousCount = count;
    const newLiked = !liked;
    // Ensure count never goes below 0
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1);
    
    setLiked(newLiked);
    setCount(newCount);

    startTransition(async () => {
      const result = await toggleLike(recipeId);
      
      if (result.error) {
        // Revert on error
        setLiked(previousLiked);
        setCount(previousCount);
        alert(result.error);
      } else {
        // Update with server response (use server count if available)
        if (result.liked !== undefined) {
          setLiked(result.liked);
        }
        if (result.count !== undefined) {
          // Use server count to ensure accuracy
          setCount(Math.max(0, result.count));
        }
      }
    });
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        liked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
    >
      <span className="text-xl">
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="font-semibold">
        {Math.max(0, count)}
      </span>
      <span className="hidden sm:inline">
        {Math.max(0, count) === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
}

