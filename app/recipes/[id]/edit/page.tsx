import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { RecipeEditForm } from '@/components/recipes/RecipeEditForm';

interface RecipeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Fetch the recipe
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  // Verify the user owns this recipe
  if (recipe.user_id !== user.id) {
    redirect(`/recipes/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <Link href={`/recipes/${id}`} className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🍳</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Recipe
          </h1>
          <p className="text-gray-600">
            Update your recipe details
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <RecipeEditForm recipe={recipe} />
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/recipes/${id}`}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

