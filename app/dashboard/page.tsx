import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RecipeList } from '@/components/recipes/RecipeList';
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

  // Fetch all recipes with author information and social stats
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

  // Fetch social stats for all recipes
  const recipeIds = recipes?.map(r => r.id) || [];
  
  // Get like counts
  const { data: likeCounts } = await supabase
    .from('likes')
    .select('recipe_id')
    .in('recipe_id', recipeIds);

  // Get comment counts
  const { data: commentCounts } = await supabase
    .from('comments')
    .select('recipe_id')
    .in('recipe_id', recipeIds);

  // Add counts to recipes
  const recipesWithStats = recipes?.map(recipe => {
    const likeCount = likeCounts?.filter(l => l.recipe_id === recipe.id).length || 0;
    const commentCount = commentCounts?.filter(c => c.recipe_id === recipe.id).length || 0;
    return {
      ...recipe,
      like_count: likeCount,
      comment_count: commentCount,
    };
  });

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
                <Link href="/recipes/my" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Recipes
                </Link>
                <Link href="/recipes/saved" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Saved Recipes
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/recipes/new"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="text-3xl mb-2">📤</div>
            <h3 className="font-semibold text-lg mb-1">Upload Recipe</h3>
            <p className="text-white/80 text-sm">Share your culinary creation</p>
          </Link>
          
          <Link
            href="/recipes/my"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors hover:shadow-lg"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">My Recipes</h3>
            <p className="text-gray-600 text-sm">View your uploads</p>
          </Link>
          
          <Link
            href="/recipes/saved"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors hover:shadow-lg"
          >
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">Saved Recipes</h3>
            <p className="text-gray-600 text-sm">Your liked recipes</p>
          </Link>
          
          <Link
            href="/dashboard"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors hover:shadow-lg"
          >
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">Browse All</h3>
            <p className="text-gray-600 text-sm">Explore all recipes</p>
          </Link>
        </div>

        {/* Recipes Section */}
        {recipesError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error loading recipes</p>
            <p className="text-sm mt-1">{recipesError.message}</p>
          </div>
        ) : recipesWithStats && recipesWithStats.length > 0 ? (
          <RecipeList initialRecipes={recipesWithStats} />
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

