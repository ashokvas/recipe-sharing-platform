-- =====================================================
-- Social Features: Likes and Comments
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- This will create tables for likes and comments functionality

-- =====================================================
-- 1. LIKES TABLE
-- =====================================================
-- Stores user likes on recipes
-- Each user can like a recipe only once (enforced by unique constraint)

CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can only like a recipe once
  CONSTRAINT unique_user_recipe_like UNIQUE (user_id, recipe_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes(user_id);
CREATE INDEX IF NOT EXISTS likes_recipe_id_idx ON likes(recipe_id);
CREATE INDEX IF NOT EXISTS likes_created_at_idx ON likes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes
-- Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes
  FOR SELECT
  USING (true);

-- Authenticated users can like recipes
CREATE POLICY "Authenticated users can like recipes"
  ON likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unlike recipes (delete their own likes)
CREATE POLICY "Users can unlike recipes"
  ON likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 2. COMMENTS TABLE
-- =====================================================
-- Stores user comments on recipes
-- Supports editing comments (updated_at field)

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure content is not empty
  CONSTRAINT content_not_empty CHECK (char_length(trim(content)) > 0),
  -- Limit comment length to 2000 characters
  CONSTRAINT content_length CHECK (char_length(content) <= 2000)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_recipe_id_idx ON comments(recipe_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_recipe_created_idx ON comments(recipe_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
-- Anyone can view comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 3. TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update updated_at timestamp for comments
DROP TRIGGER IF EXISTS set_updated_at_comments ON comments;
CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Function to get like count for a recipe
CREATE OR REPLACE FUNCTION get_recipe_like_count(recipe_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM likes
    WHERE recipe_id = recipe_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if a user has liked a recipe
CREATE OR REPLACE FUNCTION user_has_liked_recipe(recipe_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM likes
    WHERE recipe_id = recipe_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get comment count for a recipe
CREATE OR REPLACE FUNCTION get_recipe_comment_count(recipe_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM comments
    WHERE recipe_id = recipe_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =====================================================
-- 5. VIEWS (Optional - for easier querying)
-- =====================================================

-- View to get recipes with like counts
CREATE OR REPLACE VIEW recipes_with_likes AS
SELECT 
  r.*,
  COALESCE(like_counts.like_count, 0) as like_count
FROM recipes r
LEFT JOIN (
  SELECT recipe_id, COUNT(*) as like_count
  FROM likes
  GROUP BY recipe_id
) like_counts ON r.id = like_counts.recipe_id;

-- View to get recipes with comment counts
CREATE OR REPLACE VIEW recipes_with_comments AS
SELECT 
  r.*,
  COALESCE(comment_counts.comment_count, 0) as comment_count
FROM recipes r
LEFT JOIN (
  SELECT recipe_id, COUNT(*) as comment_count
  FROM comments
  GROUP BY recipe_id
) comment_counts ON r.id = comment_counts.recipe_id;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Update TypeScript types in lib/supabase/types.ts
-- 2. Create server actions for likes and comments
-- 3. Create UI components for like button and comment section
-- 4. Integrate into recipe detail page

