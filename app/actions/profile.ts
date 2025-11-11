'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createMissingProfile() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Not authenticated' };
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (existingProfile) {
    return { error: 'Profile already exists' };
  }

  // Create the profile
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      full_name: user.user_metadata?.full_name || null,
      bio: null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return { success: true, profile: data };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update your profile' };
  }

  // Extract form data
  const username = formData.get('username') as string;
  const fullName = formData.get('fullName') as string;
  const bio = formData.get('bio') as string;

  // Validate username if provided
  if (username && (username.length < 3 || username.length > 50)) {
    return { error: 'Username must be between 3 and 50 characters' };
  }

  // Prepare update data
  const updateData: {
    username?: string | null;
    full_name?: string | null;
    bio?: string | null;
  } = {};

  if (username !== undefined) {
    updateData.username = username.trim() || null;
  }
  if (fullName !== undefined) {
    updateData.full_name = fullName.trim() || null;
  }
  if (bio !== undefined) {
    updateData.bio = bio.trim() || null;
  }

  // Update the profile
  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Profile update error:', error);
    return { error: `Failed to update profile: ${error.message}` };
  }

  revalidatePath('/profile');
  return { success: true, profile: data };
}


