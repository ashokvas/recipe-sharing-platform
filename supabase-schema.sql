-- =====================================================
-- Recipe Sharing Platform - Supabase Database Schema
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- This will create all necessary tables, policies, and triggers

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Extends the auth.users table with additional user information

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. RECIPES TABLE
-- =====================================================
-- Stores all recipe information

CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  cooking_time INTEGER, -- in minutes
  difficulty TEXT,
  category TEXT,
  
  CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  CONSTRAINT positive_cooking_time CHECK (cooking_time IS NULL OR cooking_time > 0),
  CONSTRAINT valid_difficulty CHECK (difficulty IS NULL OR difficulty IN ('easy', 'medium', 'hard'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS recipes_category_idx ON recipes(category);
CREATE INDEX IF NOT EXISTS recipes_difficulty_idx ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS recipes_title_idx ON recipes USING gin(to_tsvector('english', title));

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
-- Anyone can view all recipes
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes
  FOR SELECT
  USING (true);

-- Authenticated users can create recipes
CREATE POLICY "Authenticated users can create recipes"
  ON recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own recipes
CREATE POLICY "Users can update own recipes"
  ON recipes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete own recipes"
  ON recipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profiles table
DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Function to search recipes by title or category
CREATE OR REPLACE FUNCTION search_recipes(search_query TEXT)
RETURNS SETOF recipes AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM recipes
  WHERE to_tsvector('english', title) @@ plainto_tsquery('english', search_query)
     OR title ILIKE '%' || search_query || '%'
     OR category ILIKE '%' || search_query || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Configure your Next.js app with Supabase credentials
-- 2. Test the authentication flow
-- 3. Start building your recipe features!
