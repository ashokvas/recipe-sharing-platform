import Link from 'next/link';
import type { RecipeWithAuthor } from '@/lib/supabase/types';

interface RecipeCardProps {
  recipe: RecipeWithAuthor;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col">
        {/* Recipe Image/Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
            🍽️
          </span>
        </div>

        {/* Recipe Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category & Time */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {recipe.category && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {recipe.category}
              </span>
            )}
            {recipe.cooking_time && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                ⏱️ {recipe.cooking_time} min
              </span>
            )}
            {recipe.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                recipe.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-700'
                  : recipe.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
              {recipe.description}
            </p>
          )}

          {/* Author & Date */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-sm font-semibold">
                {recipe.profiles?.username?.[0]?.toUpperCase() || recipe.profiles?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-medium">
                  {recipe.profiles?.username || recipe.profiles?.full_name || 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(recipe.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
