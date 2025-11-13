'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from './RecipeCard';
import { RecipeSearch } from './RecipeSearch';
import type { RecipeWithAuthor } from '@/lib/supabase/types';

interface RecipeListProps {
  initialRecipes: RecipeWithAuthor[];
}

export function RecipeList({ initialRecipes }: RecipeListProps) {
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithAuthor[]>(initialRecipes);

  useEffect(() => {
    setFilteredRecipes(initialRecipes);
  }, [initialRecipes]);

  return (
    <>
      <RecipeSearch recipes={initialRecipes} onFilteredRecipes={setFilteredRecipes} />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredRecipes.length === initialRecipes.length 
              ? 'Recent Recipes' 
              : `Search Results (${filteredRecipes.length})`}
          </h2>
          <span className="text-gray-600">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or browse all recipes.
          </p>
        </div>
      )}
    </>
  );
}

