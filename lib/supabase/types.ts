/**
 * Database Types for Recipe Sharing Platform
 * These types match the Supabase schema
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      recipes: {
        Row: Recipe;
        Insert: RecipeInsert;
        Update: RecipeUpdate;
      };
      likes: {
        Row: Like;
        Insert: LikeInsert;
        Update: LikeUpdate;
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: CommentUpdate;
      };
    };
    Views: {
      recipes_with_likes: {
        Row: RecipeWithLikes;
      };
      recipes_with_comments: {
        Row: RecipeWithComments;
      };
    };
    Functions: {
      search_recipes: {
        Args: { search_query: string };
        Returns: Recipe[];
      };
      get_recipe_like_count: {
        Args: { recipe_uuid: string };
        Returns: number;
      };
      user_has_liked_recipe: {
        Args: { recipe_uuid: string; user_uuid: string };
        Returns: boolean;
      };
      get_recipe_comment_count: {
        Args: { recipe_uuid: string };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// =====================================================
// Profile Types
// =====================================================

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email: string;
  username?: string | null;
  full_name?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  id?: string;
  email?: string;
  username?: string | null;
  full_name?: string | null;
  bio?: string | null;
  updated_at?: string;
}

// =====================================================
// Recipe Types
// =====================================================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  cooking_time: number | null;
  difficulty: Difficulty | null;
  category: string | null;
}

export interface RecipeInsert {
  id?: string;
  created_at?: string;
  user_id: string;
  title: string;
  description?: string | null;
  ingredients: string;
  instructions: string;
  cooking_time?: number | null;
  difficulty?: Difficulty | null;
  category?: string | null;
}

export interface RecipeUpdate {
  id?: string;
  user_id?: string;
  title?: string;
  description?: string | null;
  ingredients?: string;
  instructions?: string;
  cooking_time?: number | null;
  difficulty?: Difficulty | null;
  category?: string | null;
}

// =====================================================
// Recipe with Author Info (for joins)
// =====================================================

export interface RecipeWithAuthor extends Recipe {
  profiles: Profile | null;
}

// =====================================================
// Like Types
// =====================================================

export interface Like {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface LikeInsert {
  id?: string;
  user_id: string;
  recipe_id: string;
  created_at?: string;
}

export interface LikeUpdate {
  id?: string;
  user_id?: string;
  recipe_id?: string;
  created_at?: string;
}

// =====================================================
// Comment Types
// =====================================================

export interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentInsert {
  id?: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommentUpdate {
  id?: string;
  user_id?: string;
  recipe_id?: string;
  content?: string;
  updated_at?: string;
}

// =====================================================
// Comment with Author Info (for joins)
// =====================================================

export interface CommentWithAuthor extends Comment {
  profiles: Profile | null;
}

// =====================================================
// Recipe with Social Stats (for views)
// =====================================================

export interface RecipeWithLikes extends Recipe {
  like_count: number;
}

export interface RecipeWithComments extends Recipe {
  comment_count: number;
}

// =====================================================
// Recipe with Full Social Info
// =====================================================

export interface RecipeWithSocial extends RecipeWithAuthor {
  like_count?: number;
  comment_count?: number;
  user_has_liked?: boolean;
}
