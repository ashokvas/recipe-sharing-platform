import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function MyRecipesPage() {
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

  // Fetch only the current user's recipes
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch social stats for user's recipes
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
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link href="/recipes/new" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Upload Recipe
                </Link>
                <Link href="/recipes/my" className="text-gray-900 font-medium">
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
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <span>←</span> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Recipes
          </h1>
          <p className="text-gray-600">
            Manage and view all your uploaded recipes
          </p>
        </div>

        {/* Recipes Section */}
        {recipesError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error loading your recipes</p>
            <p className="text-sm mt-1">{recipesError.message}</p>
          </div>
        ) : recipesWithStats && recipesWithStats.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-700">
                  You have {recipesWithStats.length} {recipesWithStats.length === 1 ? 'recipe' : 'recipes'}
                </h2>
                <Link
                  href="/recipes/new"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm"
                >
                  + Add New Recipe
                </Link>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipesWithStats.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start sharing your culinary creations with the community!
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

