/*
  # Database Functions and Optimizations

  1. New Functions
    - `get_user_draft_count()` - Returns count of user's drafts
    - `get_recent_drafts()` - Returns recent drafts for user with limit
    - `cleanup_old_drafts()` - Removes old drafts older than specified days
    - `get_user_stats()` - Returns comprehensive user statistics

  2. New Views
    - `user_draft_summary` - Comprehensive view of user draft information with computed fields

  3. Performance Optimizations
    - Composite indexes for common query patterns
    - GIN indexes for JSONB column searches
    - Indexes for user-specific queries

  4. Security
    - All functions use SECURITY DEFINER with proper auth.uid() checks
    - Row Level Security respected through auth.uid() filtering
*/

-- Function to get user draft count
CREATE OR REPLACE FUNCTION get_user_draft_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM drafts
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent drafts for user
CREATE OR REPLACE FUNCTION get_recent_drafts(limit_count integer DEFAULT 5)
RETURNS TABLE (
  id uuid,
  name text,
  selected_template text,
  step integer,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.name,
    d.selected_template,
    d.step,
    d.updated_at
  FROM drafts d
  WHERE d.user_id = auth.uid()
  ORDER BY d.updated_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old drafts (older than specified days)
CREATE OR REPLACE FUNCTION cleanup_old_drafts(days_old integer DEFAULT 90)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Only allow users to clean their own drafts
  DELETE FROM drafts
  WHERE user_id = auth.uid()
    AND updated_at < (now() - (days_old || ' days')::interval);
    
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS json AS $$
DECLARE
  stats json;
BEGIN
  SELECT json_build_object(
    'draft_count', (SELECT COUNT(*) FROM drafts WHERE user_id = auth.uid()),
    'resume_data_count', (SELECT COUNT(*) FROM resume_data WHERE user_id = auth.uid()),
    'oldest_draft', (SELECT MIN(created_at) FROM drafts WHERE user_id = auth.uid()),
    'newest_draft', (SELECT MAX(updated_at) FROM drafts WHERE user_id = auth.uid()),
    'total_storage_kb', (
      SELECT ROUND(
        COALESCE(
          (pg_column_size(array_agg(resume_data)) + pg_column_size(array_agg(customizations))) / 1024.0,
          0
        ), 2
      )
      FROM drafts WHERE user_id = auth.uid()
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for draft summary
CREATE OR REPLACE VIEW user_draft_summary AS
SELECT 
  d.id,
  d.name,
  d.selected_template,
  d.step,
  d.created_at,
  d.updated_at,
  (d.resume_data#>>'{personalInfo,name}') as resume_name,
  (d.resume_data#>>'{personalInfo,title}') as resume_title,
  CASE 
    WHEN d.step = 0 THEN 'LinkedIn Input'
    WHEN d.step = 1 THEN 'Template Selection'
    WHEN d.step = 2 THEN 'Customization'
    ELSE 'Unknown'
  END as step_name,
  pg_column_size(d.resume_data) + pg_column_size(d.customizations) as size_bytes
FROM drafts d
WHERE d.user_id = auth.uid();

-- Add composite indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drafts_user_step ON drafts(user_id, step);
CREATE INDEX IF NOT EXISTS idx_drafts_user_template ON drafts(user_id, selected_template);
CREATE INDEX IF NOT EXISTS idx_drafts_user_updated ON drafts(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_data_user_created ON resume_data(user_id, created_at DESC);

-- Add GIN indexes for JSONB columns for better search performance
CREATE INDEX IF NOT EXISTS idx_drafts_resume_data_gin ON drafts USING GIN (resume_data);
CREATE INDEX IF NOT EXISTS idx_resume_data_personal_info_gin ON resume_data USING GIN (personal_info);
CREATE INDEX IF NOT EXISTS idx_user_settings_preferences_gin ON user_settings USING GIN (preferences);

-- Add regular indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_drafts_created_at ON drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at DESC);