'use client';

import { createRecipe } from '@/app/actions/recipes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicFieldList } from './DynamicFieldList';

export function RecipeUploadForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    // Combine ingredients and instructions arrays into strings
    const ingredientsString = ingredients.filter(ing => ing.trim()).join('\n');
    const instructionsString = instructions.filter(inst => inst.trim()).join('\n');
    
    formData.set('ingredients', ingredientsString);
    formData.set('instructions', instructionsString);

    const result = await createRecipe(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Recipe created successfully!
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
          placeholder="Brief description of your recipe..."
          disabled={loading}
        />
      </div>

      {/* Ingredients */}
      <DynamicFieldList
        label="Ingredients *"
        fields={ingredients}
        onChange={setIngredients}
        placeholder="Enter ingredient"
        addButtonText="Add Ingredient"
        disabled={loading}
      />

      {/* Instructions */}
      <DynamicFieldList
        label="Instructions *"
        fields={instructions}
        onChange={setInstructions}
        placeholder="Enter instruction step"
        addButtonText="Add Step"
        disabled={loading}
      />

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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Dessert"
            disabled={loading}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {loading ? 'Creating...' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
}


