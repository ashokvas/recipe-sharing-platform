import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { getUserLikedRecipes } from '@/app/actions/likes';

export default async function SavedRecipesPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/auth/login');
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Fetch all recipes liked by the current user
  const { recipes, error: recipesError } = await getUserLikedRecipes();

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
              <Link href="/recipes/my" className="text-gray-600 hover:text-gray-900 transition-colors">
                My Recipes
              </Link>
              <Link href="/recipes/saved" className="text-orange-600 hover:text-orange-700 transition-colors font-medium">
                Saved Recipes
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Saved Recipes
              </h1>
              <p className="text-gray-600">
                All the recipes you've liked and saved
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Recipes List */}
        {recipesError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading saved recipes</p>
            <p className="text-sm mt-1">{recipesError}</p>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-700">
                  You have {recipes.length} saved {recipes.length === 1 ? 'recipe' : 'recipes'}
                </h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring recipes and like the ones you want to save!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Browse Recipes
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

