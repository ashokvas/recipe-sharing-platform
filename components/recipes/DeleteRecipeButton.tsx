'use client';

import { deleteRecipe } from '@/app/actions/recipes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteRecipeButtonProps {
  recipeId: string;
}

export function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    
    const result = await deleteRecipe(recipeId);
    
    if (result?.error) {
      alert(result.error);
      setLoading(false);
      setShowConfirm(false);
    } else {
      // Redirect to dashboard after successful deletion
      router.push('/dashboard');
      router.refresh();
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-600">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
      Delete Recipe
    </button>
  );
}

