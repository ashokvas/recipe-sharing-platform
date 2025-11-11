'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const fullName = formData.get('fullName') as string;

  // Validate inputs
  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required' };
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address (e.g., name@example.com)' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Create the profile manually (more reliable than trigger)
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: username,
        full_name: fullName || null,
      });

    // If profile creation fails, we continue anyway
    // (user can create it manually later if needed)
    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate inputs
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address' };
  }

  // Sign in the user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile,
  };
}

