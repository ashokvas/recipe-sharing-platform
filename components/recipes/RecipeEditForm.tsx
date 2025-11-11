'use client';

import { updateRecipe } from '@/app/actions/recipes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/lib/supabase/types';

interface RecipeEditFormProps {
  recipe: Recipe;
}

export function RecipeEditForm({ recipe }: RecipeEditFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updateRecipe(recipe.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Success! Redirect to recipe detail page
      router.push(`/recipes/${recipe.id}`);
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={200}
          defaultValue={recipe.title}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          placeholder="e.g., Classic Chocolate Chip Cookies"
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={recipe.description || ''}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          placeholder="Brief description of your recipe..."
          disabled={loading}
        />
      </div>

      {/* Ingredients */}
      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients *
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          required
          rows={6}
          defaultValue={recipe.ingredients}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          placeholder="List your ingredients, one per line"
          disabled={loading}
        />
        <p className="mt-2 text-sm text-gray-500">
          List each ingredient on a new line
        </p>
      </div>

      {/* Instructions */}
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
          Instructions *
        </label>
        <textarea
          id="instructions"
          name="instructions"
          required
          rows={8}
          defaultValue={recipe.instructions}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          placeholder="Step-by-step instructions"
          disabled={loading}
        />
        <p className="mt-2 text-sm text-gray-500">
          Write clear, step-by-step instructions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Cooking Time */}
        <div>
          <label htmlFor="cooking_time" className="block text-sm font-medium text-gray-700 mb-2">
            Cooking Time (minutes)
          </label>
          <input
            type="number"
            id="cooking_time"
            name="cooking_time"
            min="1"
            defaultValue={recipe.cooking_time || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="30"
            disabled={loading}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={recipe.difficulty || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
            disabled={loading}
          >
            <option value="">Select...</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            defaultValue={recipe.category || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Dessert"
            disabled={loading}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {loading ? 'Updating...' : 'Update Recipe'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

