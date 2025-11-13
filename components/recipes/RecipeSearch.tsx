'use client';

import { useState, useMemo, useEffect } from 'react';
import type { RecipeWithAuthor, Difficulty } from '@/lib/supabase/types';

interface RecipeSearchProps {
  recipes: RecipeWithAuthor[];
  onFilteredRecipes: (filtered: RecipeWithAuthor[]) => void;
}

export function RecipeSearch({ recipes, onFilteredRecipes }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  // Get unique categories from recipes
  const categories = useMemo(() => {
    const cats = recipes
      .map(r => r.category)
      .filter((cat): cat is string => Boolean(cat))
      .filter((cat, index, self) => self.indexOf(cat) === index)
      .sort();
    return cats;
  }, [recipes]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...recipes];

    // Apply search query filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((recipe) => {
        // Search in title
        if (recipe.title.toLowerCase().includes(lowerQuery)) return true;
        
        // Search in description
        if (recipe.description?.toLowerCase().includes(lowerQuery)) return true;
        
        // Search in category
        if (recipe.category?.toLowerCase().includes(lowerQuery)) return true;
        
        // Search in ingredients
        if (recipe.ingredients.toLowerCase().includes(lowerQuery)) return true;
        
        // Search in instructions
        if (recipe.instructions.toLowerCase().includes(lowerQuery)) return true;
        
        // Search in author username
        if (recipe.profiles?.username?.toLowerCase().includes(lowerQuery)) return true;
        
        // Search in author full name
        if (recipe.profiles?.full_name?.toLowerCase().includes(lowerQuery)) return true;
        
        return false;
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    onFilteredRecipes(filtered);
  }, [searchQuery, selectedCategory, selectedDifficulty, recipes, onFilteredRecipes]);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl">×</span>
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Dropdown */}
        <div className="sm:w-48">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
}

