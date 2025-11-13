-- =====================================================
-- Add updated_at column to comments table (if missing)
-- =====================================================
-- Run this SQL in your Supabase SQL Editor if the updated_at column doesn't exist

-- Check if column exists, if not add it
DO $$
BEGIN
  -- Check if updated_at column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'comments' 
    AND column_name = 'updated_at'
  ) THEN
    -- Add the updated_at column
    ALTER TABLE comments 
    ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
    
    -- Set initial value for existing rows
    UPDATE comments 
    SET updated_at = created_at 
    WHERE updated_at IS NULL;
    
    RAISE NOTICE 'updated_at column added successfully';
  ELSE
    RAISE NOTICE 'updated_at column already exists';
  END IF;
END $$;

-- Create or replace the trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at_comments ON comments;

-- Create the trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- Verification
-- =====================================================
-- Run this to verify the column was added:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'comments'
-- ORDER BY ordinal_position;

