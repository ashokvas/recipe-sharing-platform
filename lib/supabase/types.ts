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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      search_recipes: {
        Args: { search_query: string };
        Returns: Recipe[];
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
