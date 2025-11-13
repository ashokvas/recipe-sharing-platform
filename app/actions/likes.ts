'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Toggle like on a recipe (like if not liked, unlike if already liked)
 */
export async function toggleLike(recipeId: string) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be logged in to like recipes' };
  }

  // Check if user has already liked this recipe
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking like status:', checkError);
    return { error: 'Failed to check like status' };
  }

  // If already liked, unlike it
  if (existingLike) {
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error('Error unliking recipe:', deleteError);
      return { error: 'Failed to unlike recipe' };
    }

    // Get updated count after unlike
    const { count: newCount } = await getLikeCount(recipeId);

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath('/dashboard');
    revalidatePath('/recipes/saved');
    return { 
      success: true, 
      liked: false,
      count: Math.max(0, newCount || 0) // Ensure count is never negative
    };
  }

  // If not liked yet, create a new like
  const { error: insertError } = await supabase
    .from('likes')
    .insert({
      user_id: user.id,
      recipe_id: recipeId,
    });

  if (insertError) {
    console.error('Error liking recipe:', insertError);
    return { error: 'Failed to like recipe' };
  }

  // Get updated count after like
  const { count: newCount } = await getLikeCount(recipeId);

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath('/dashboard');
  revalidatePath('/recipes/saved');
  return { 
    success: true, 
    liked: true,
    count: Math.max(0, newCount || 0) // Ensure count is never negative
  };
}

/**
 * Get like count for a recipe
 */
export async function getLikeCount(recipeId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('Error getting like count:', error);
    return { error: 'Failed to get like count', count: 0 };
  }

  return { count: count || 0 };
}

/**
 * Check if the current user has liked a recipe
 */
export async function hasUserLiked(recipeId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { liked: false };
  }

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  if (error) {
    console.error('Error checking like status:', error);
    return { liked: false };
  }

  return { liked: !!data };
}

/**
 * Get all likes for a recipe with user info
 */
export async function getRecipeLikes(recipeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('likes')
    .select(`
      id,
      created_at,
      profiles (
        id,
        username,
        full_name
      )
    `)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching likes:', error);
    return { error: 'Failed to fetch likes', likes: [] };
  }

  return { likes: data || [] };
}

/**
 * Get all recipes liked by the current user
 */
export async function getUserLikedRecipes() {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be logged in to view saved recipes', recipes: [] };
  }

  // Get all likes by the current user
  const { data: likes, error: likesError } = await supabase
    .from('likes')
    .select('recipe_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (likesError) {
    console.error('Error fetching user likes:', likesError);
    return { error: 'Failed to fetch saved recipes', recipes: [] };
  }

  if (!likes || likes.length === 0) {
    return { recipes: [] };
  }

  // Get recipe IDs
  const recipeIds = likes.map(like => like.recipe_id);

  // Fetch all recipes that the user has liked
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
    .in('id', recipeIds)
    .order('created_at', { ascending: false });

  if (recipesError) {
    console.error('Error fetching liked recipes:', recipesError);
    return { error: 'Failed to fetch recipes', recipes: [] };
  }

  // Get social stats for all recipes
  const allRecipeIds = recipes?.map(r => r.id) || [];
  
  // Get like counts
  const { data: likeCounts } = await supabase
    .from('likes')
    .select('recipe_id')
    .in('recipe_id', allRecipeIds);

  // Get comment counts
  const { data: commentCounts } = await supabase
    .from('comments')
    .select('recipe_id')
    .in('recipe_id', allRecipeIds);

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

  return { recipes: recipesWithStats || [] };
}

