import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
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

  // Fetch all recipes with author information
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (
        id,
        username,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🍳</span>
                </div>
                <span className="text-xl font-bold text-gray-900">RecipeShare</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-900 font-medium">
                  Dashboard
                </Link>
                <Link href="/recipes/new" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Upload Recipe
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all hidden md:inline"
              >
                {profile?.username || user.email}
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Discover and share amazing recipes from our community
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/recipes/new"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="text-3xl mb-2">📤</div>
            <h3 className="font-semibold text-lg mb-1">Upload Recipe</h3>
            <p className="text-white/80 text-sm">Share your culinary creation</p>
          </Link>
          
          <Link
            href="/recipes"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors hover:shadow-lg"
          >
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">Browse All</h3>
            <p className="text-gray-600 text-sm">Explore all recipes</p>
          </Link>
          
          <Link
            href="/profile"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors hover:shadow-lg"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">My Recipes</h3>
            <p className="text-gray-600 text-sm">View your uploads</p>
          </Link>
        </div>

        {/* Recipes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Recipes
            </h2>
            <span className="text-gray-600">
              {recipes?.length || 0} {recipes?.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </div>
        </div>

        {/* Recipes Grid */}
        {recipesError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error loading recipes</p>
            <p className="text-sm mt-1">{recipesError.message}</p>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share a recipe with the community!
            </p>
            <Link
              href="/recipes/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Upload Your First Recipe
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

