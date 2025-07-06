/*
  # Setup Realtime subscriptions

  1. Realtime Setup
    - Enable realtime for drafts table
    - Enable realtime for resume_data table  
    - Enable realtime for user_settings table

  2. Security
    - Ensure realtime respects RLS policies
    - Only allow users to subscribe to their own data

  3. Features
    - Real-time draft synchronization across devices
    - Live collaboration potential for future features
    - Instant updates when settings change
*/

-- Enable realtime for drafts table
ALTER PUBLICATION supabase_realtime ADD TABLE drafts;

-- Enable realtime for resume_data table
ALTER PUBLICATION supabase_realtime ADD TABLE resume_data;

-- Enable realtime for user_settings table
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;

-- Enable realtime for profiles table (for profile updates)
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Create function to validate realtime access
CREATE OR REPLACE FUNCTION check_realtime_access(table_name text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Only allow access to own data
  IF auth.uid() = user_id THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Realtime RLS is automatically enforced by Supabase
-- The existing RLS policies will control what data users can see in realtime subscriptions