import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DeleteRecipeButton } from '@/components/recipes/DeleteRecipeButton';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user (optional - for edit/delete buttons)
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's profile for displaying username
  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle() : { data: null };

  // Fetch the recipe with author information
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (username, full_name)
    `)
    .eq('id', id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  const authorName = recipe.profiles?.username || recipe.profiles?.full_name || 'Anonymous';
  const isOwner = user?.id === recipe.user_id;

  // Format ingredients and instructions (split by newlines)
  const ingredientsList = recipe.ingredients.split('\n').filter(line => line.trim());
  const instructionsList = recipe.instructions.split('\n').filter(line => line.trim());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🍳</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RecipeShare</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/recipes/new" className="text-gray-600 hover:text-gray-900 transition-colors">
                Upload Recipe
              </Link>
            </nav>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all hidden md:inline"
              >
                {profile?.username || user.email}
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <span>←</span> Back to Dashboard
        </Link>

        {/* Recipe Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Recipe Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <span className="text-9xl">🍽️</span>
          </div>

          {/* Recipe Content */}
          <div className="p-8 md:p-12">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {recipe.category && (
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {recipe.category}
                  </span>
                )}
                {recipe.cooking_time && (
                  <span className="text-gray-600 flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span>{recipe.cooking_time} minutes</span>
                  </span>
                )}
                {recipe.difficulty && (
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {recipe.title}
              </h1>

              {recipe.description && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {recipe.description}
                </p>
              )}

              {/* Author Info */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-lg font-semibold">
                  {authorName[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{authorName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(recipe.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🥘</span> Ingredients
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="space-y-2">
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-gray-700 flex-1">{ingredient.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📝</span> Instructions
              </h2>
              <div className="space-y-4">
                {instructionsList.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 leading-relaxed">{instruction.trim()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons (if owner) */}
            {isOwner && (
              <div className="pt-8 border-t border-gray-200 flex gap-4 flex-wrap">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium inline-block text-center"
                >
                  Edit Recipe
                </Link>
                <DeleteRecipeButton recipeId={recipe.id} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

