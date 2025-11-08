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
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      full_name: user.user_metadata?.full_name || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  return { success: true, profile: data };
}

