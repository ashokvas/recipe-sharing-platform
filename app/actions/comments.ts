'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Create a new comment on a recipe
 */
export async function createComment(recipeId: string, content: string) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be logged in to comment' };
  }

  // Validate content
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { error: 'Comment cannot be empty' };
  }

  if (trimmedContent.length > 2000) {
    return { error: 'Comment is too long (maximum 2000 characters)' };
  }

  // Create comment
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      recipe_id: recipeId,
      content: trimmedContent,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return { error: 'Failed to create comment' };
  }

  revalidatePath(`/recipes/${recipeId}`);
  return { success: true, comment: data };
}

/**
 * Update a comment
 */
export async function updateComment(commentId: string, content: string) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be logged in to update comments' };
  }

  // Validate content
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { error: 'Comment cannot be empty' };
  }

  if (trimmedContent.length > 2000) {
    return { error: 'Comment is too long (maximum 2000 characters)' };
  }

  // Try to convert commentId to number if it's a numeric string (for compatibility)
  let queryId: string | number = commentId;
  const numericId = parseInt(commentId, 10);
  if (!isNaN(numericId) && numericId.toString() === commentId.trim()) {
    queryId = numericId;
  }

  // Verify ownership - try both string and numeric ID
  let { data: existingComment, error: fetchError } = await supabase
    .from('comments')
    .select('id, user_id, recipe_id')
    .eq('id', queryId)
    .single();

  // If that fails, try as string
  if (fetchError && queryId !== commentId) {
    const retry = await supabase
      .from('comments')
      .select('id, user_id, recipe_id')
      .eq('id', commentId)
      .single();
    existingComment = retry.data;
    fetchError = retry.error;
  }

  if (fetchError || !existingComment) {
    console.error('Error fetching comment for update:', fetchError);
    console.error('Comment ID used:', commentId, 'Type:', typeof commentId);
    return { error: `Comment not found: ${fetchError?.message || 'Unknown error'}` };
  }

  // CRITICAL: Strict ownership verification
  // Get raw values first for debugging
  const rawCommentUserId = existingComment.user_id;
  const rawCurrentUserId = user.id;
  
  // Normalize both to strings and compare
  const commentUserId = String(rawCommentUserId || '').trim().toLowerCase();
  const currentUserId = String(rawCurrentUserId || '').trim().toLowerCase();
  
  // Log for debugging
  console.log('UPDATE OWNERSHIP CHECK:', {
    rawCommentUserId,
    rawCurrentUserId,
    commentUserId,
    currentUserId,
    commentUserIdType: typeof rawCommentUserId,
    currentUserIdType: typeof rawCurrentUserId,
    lengthsMatch: commentUserId.length === currentUserId.length,
    stringsMatch: commentUserId === currentUserId,
  });
  
  // STRICT ownership check - must match exactly
  if (!rawCommentUserId || !rawCurrentUserId) {
    console.error('Missing user IDs - Update blocked');
    return { error: 'Invalid user information. Cannot update comment.' };
  }
  
  if (commentUserId !== currentUserId) {
    console.error('Ownership mismatch - Update BLOCKED:', {
      commentUserId,
      currentUserId,
      rawCommentUserId,
      rawCurrentUserId,
      commentId: existingComment.id,
    });
    return { error: 'You can only update your own comments' };
  }
  
  // Additional safety: verify the IDs are actually UUIDs (not empty strings)
  if (commentUserId.length < 10 || currentUserId.length < 10) {
    console.error('Invalid user ID format - Update blocked');
    return { error: 'Invalid user information. Cannot update comment.' };
  }

  // Update comment - only update content, don't touch updated_at if it doesn't exist
  // Try both string and numeric ID
  let { data, error } = await supabase
    .from('comments')
    .update({ content: trimmedContent })
    .eq('id', queryId)
    .select('id, content, created_at, user_id, recipe_id')
    .single();

  // If that fails, try as string
  if (error && queryId !== commentId) {
    const retry = await supabase
      .from('comments')
      .update({ content: trimmedContent })
      .eq('id', commentId)
      .select('id, content, created_at, user_id, recipe_id')
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error('Error updating comment:', error);
    console.error('Comment ID used:', commentId, 'Query ID:', queryId);
    return { error: `Failed to update comment: ${error.message}` };
  }

  revalidatePath(`/recipes/${existingComment.recipe_id}`);
  return { success: true, comment: data };
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be logged in to delete comments' };
  }

  // Try to convert commentId to number if it's a numeric string (for compatibility)
  let queryId: string | number = commentId;
  const numericId = parseInt(commentId, 10);
  if (!isNaN(numericId) && numericId.toString() === commentId.trim()) {
    queryId = numericId;
  }

  // Verify ownership - try both string and numeric ID
  let { data: existingComment, error: fetchError } = await supabase
    .from('comments')
    .select('id, user_id, recipe_id')
    .eq('id', queryId)
    .single();

  // If that fails, try as string
  if (fetchError && queryId !== commentId) {
    const retry = await supabase
      .from('comments')
      .select('id, user_id, recipe_id')
      .eq('id', commentId)
      .single();
    existingComment = retry.data;
    fetchError = retry.error;
  }

  if (fetchError || !existingComment) {
    console.error('Error fetching comment for delete:', fetchError);
    return { error: `Comment not found: ${fetchError?.message || 'Unknown error'}` };
  }

  // CRITICAL: Strict ownership verification
  // Get raw values first for debugging
  const rawCommentUserId = existingComment.user_id;
  const rawCurrentUserId = user.id;
  
  // Normalize both to strings and compare
  const commentUserId = String(rawCommentUserId || '').trim().toLowerCase();
  const currentUserId = String(rawCurrentUserId || '').trim().toLowerCase();
  
  // Log for debugging
  console.log('DELETE OWNERSHIP CHECK:', {
    rawCommentUserId,
    rawCurrentUserId,
    commentUserId,
    currentUserId,
    commentUserIdType: typeof rawCommentUserId,
    currentUserIdType: typeof rawCurrentUserId,
    lengthsMatch: commentUserId.length === currentUserId.length,
    stringsMatch: commentUserId === currentUserId,
  });
  
  // STRICT ownership check - must match exactly
  if (!rawCommentUserId || !rawCurrentUserId) {
    console.error('Missing user IDs - Delete blocked');
    return { error: 'Invalid user information. Cannot delete comment.' };
  }
  
  if (commentUserId !== currentUserId) {
    console.error('Ownership mismatch - Delete BLOCKED:', {
      commentUserId,
      currentUserId,
      rawCommentUserId,
      rawCurrentUserId,
      commentId: existingComment.id,
    });
    return { error: 'You can only delete your own comments' };
  }
  
  // Additional safety: verify the IDs are actually UUIDs (not empty strings)
  if (commentUserId.length < 10 || currentUserId.length < 10) {
    console.error('Invalid user ID format - Delete blocked');
    return { error: 'Invalid user information. Cannot delete comment.' };
  }

  // Delete comment - try both string and numeric ID
  let { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', queryId);

  // If that fails, try as string
  if (error && queryId !== commentId) {
    const retry = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    error = retry.error;
  }

  if (error) {
    console.error('Error deleting comment:', error);
    return { error: `Failed to delete comment: ${error.message}` };
  }

  revalidatePath(`/recipes/${existingComment.recipe_id}`);
  return { success: true };
}

/**
 * Get all comments for a recipe with author info
 */
export async function getRecipeComments(recipeId: string) {
  const supabase = await createClient();

  // Try fetching comments with profiles join (without updated_at to avoid errors)
  let { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      user_id,
      recipe_id,
      profiles (
        id,
        username,
        full_name,
        email
      )
    `)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  // If join fails, try fetching comments without profiles
  if (error) {
    console.warn('Join query failed, trying without profiles:', error.message);
    
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, recipe_id')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return { error: 'Failed to fetch comments', comments: [] };
    }

    // Fetch profiles separately
    const userIds = [...new Set((commentsData || []).map(c => c.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username, full_name, email')
      .in('id', userIds);

    // Combine comments with profiles
    data = (commentsData || []).map(comment => ({
      ...comment,
      profiles: profilesData?.find(p => p.id === comment.user_id) || null,
    }));
  }
  
  // Add updated_at field (set to created_at if column doesn't exist)
  if (data) {
    data = data.map(comment => ({
      ...comment,
      updated_at: (comment as any).updated_at || comment.created_at,
    }));
  }

  
  // Ensure profiles is properly formatted (handle array case) and convert ID to string
  const formattedComments = (data || []).map((comment: any) => {
    // If profiles is an array, take the first element
    if (Array.isArray(comment.profiles)) {
      comment.profiles = comment.profiles[0] || null;
    }
    // Ensure ID is a string (handle cases where it might be a number)
    if (typeof comment.id !== 'string') {
      comment.id = String(comment.id);
    }
    // Ensure user_id and recipe_id are strings
    if (comment.user_id && typeof comment.user_id !== 'string') {
      comment.user_id = String(comment.user_id);
    }
    if (comment.recipe_id && typeof comment.recipe_id !== 'string') {
      comment.recipe_id = String(comment.recipe_id);
    }
    return comment;
  });
  
  return { comments: formattedComments };
}

/**
 * Get comment count for a recipe
 */
export async function getCommentCount(recipeId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('Error getting comment count:', error);
    return { error: 'Failed to get comment count', count: 0 };
  }

  return { count: count || 0 };
}

