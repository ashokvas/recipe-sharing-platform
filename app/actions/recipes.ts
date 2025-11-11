'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { RecipeInsert } from '@/lib/supabase/types';

export async function createRecipe(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to upload recipes' };
  }

  // Check if user has a profile (required for recipes)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  // If profile doesn't exist, create one automatically
  if (!profile) {
    // Generate a username from email if needed
    const username = user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
    
    if (!user.email) {
      return { error: 'User email is required. Please complete your profile setup.' };
    }
    
    const { error: createProfileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email, // Required field
        username: username,
        full_name: null,
        bio: null, // Optional field
      });

    if (createProfileError) {
      console.error('Auto-profile creation error:', createProfileError);
      return { error: 'Failed to set up your profile. Please visit your profile page to complete setup.' };
    }
  }

  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const ingredients = formData.get('ingredients') as string;
  const instructions = formData.get('instructions') as string;
  const cooking_time = formData.get('cooking_time') as string;
  const difficulty = formData.get('difficulty') as string;
  const category = formData.get('category') as string;

  // Validate required fields
  if (!title || !ingredients || !instructions) {
    return { error: 'Title, ingredients, and instructions are required' };
  }

  if (title.length < 3 || title.length > 200) {
    return { error: 'Title must be between 3 and 200 characters' };
  }

  // Validate difficulty if provided
  if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
    return { error: 'Invalid difficulty level' };
  }

  // Prepare recipe data
  const recipeData: RecipeInsert = {
    user_id: user.id,
    title: title.trim(),
    description: description?.trim() || null,
    ingredients: ingredients.trim(),
    instructions: instructions.trim(),
    cooking_time: cooking_time ? parseInt(cooking_time) : null,
    difficulty: difficulty || null,
    category: category?.trim() || null,
  };

  // Insert recipe into database
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipeData)
    .select()
    .single();

  if (error) {
    console.error('Recipe creation error:', error);
    // Return the actual error message for debugging
    return { error: `Failed to create recipe: ${error.message}` };
  }

  // Revalidate the dashboard page to show the new recipe
  revalidatePath('/dashboard');
  
  return { success: true, recipe: data };
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to delete recipes' };
  }

  // Verify the recipe exists and belongs to the user
  const { data: recipe, error: fetchError } = await supabase
    .from('recipes')
    .select('user_id')
    .eq('id', recipeId)
    .single();

  if (fetchError || !recipe) {
    return { error: 'Recipe not found' };
  }

  if (recipe.user_id !== user.id) {
    return { error: 'You can only delete your own recipes' };
  }

  // Delete the recipe
  const { error: deleteError } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId);

  if (deleteError) {
    console.error('Recipe deletion error:', deleteError);
    return { error: `Failed to delete recipe: ${deleteError.message}` };
  }

  // Revalidate paths
  revalidatePath('/dashboard');
  revalidatePath(`/recipes/${recipeId}`);
  
  return { success: true };
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update recipes' };
  }

  // Verify the recipe exists and belongs to the user
  const { data: recipe, error: fetchError } = await supabase
    .from('recipes')
    .select('user_id')
    .eq('id', recipeId)
    .single();

  if (fetchError || !recipe) {
    return { error: 'Recipe not found' };
  }

  if (recipe.user_id !== user.id) {
    return { error: 'You can only update your own recipes' };
  }

  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const ingredients = formData.get('ingredients') as string;
  const instructions = formData.get('instructions') as string;
  const cooking_time = formData.get('cooking_time') as string;
  const difficulty = formData.get('difficulty') as string;
  const category = formData.get('category') as string;

  // Validate required fields
  if (!title || !ingredients || !instructions) {
    return { error: 'Title, ingredients, and instructions are required' };
  }

  if (title.length < 3 || title.length > 200) {
    return { error: 'Title must be between 3 and 200 characters' };
  }

  // Validate difficulty if provided
  if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
    return { error: 'Invalid difficulty level' };
  }

  // Prepare update data
  const updateData = {
    title: title.trim(),
    description: description?.trim() || null,
    ingredients: ingredients.trim(),
    instructions: instructions.trim(),
    cooking_time: cooking_time ? parseInt(cooking_time) : null,
    difficulty: difficulty || null,
    category: category?.trim() || null,
  };

  // Update the recipe
  const { data, error: updateError } = await supabase
    .from('recipes')
    .update(updateData)
    .eq('id', recipeId)
    .select()
    .single();

  if (updateError) {
    console.error('Recipe update error:', updateError);
    return { error: `Failed to update recipe: ${updateError.message}` };
  }

  // Revalidate paths
  revalidatePath('/dashboard');
  revalidatePath(`/recipes/${recipeId}`);
  
  return { success: true, recipe: data };
}


