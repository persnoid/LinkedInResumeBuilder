/*
  # Create user settings table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, unique)
      - `preferences` (jsonb, user preferences and settings)
      - `default_template` (text, user's preferred default template)
      - `auto_save_enabled` (boolean, auto-save preference)
      - `email_notifications` (boolean, email notification preference)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policies for users to manage their own settings

  3. Features
    - Store user preferences for UI/UX
    - Default template selection
    - Notification preferences
    - Auto-save settings
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferences jsonb DEFAULT '{}',
  default_template text DEFAULT 'azurill',
  auto_save_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON user_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE user_settings 
ADD CONSTRAINT preferences_is_object 
CHECK (jsonb_typeof(preferences) = 'object');

ALTER TABLE user_settings 
ADD CONSTRAINT default_template_not_empty 
CHECK (length(trim(default_template)) > 0);

-- Function to create default settings for new users
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, preferences, default_template, auto_save_enabled, email_notifications)
  VALUES (
    NEW.id, 
    '{"theme": "light", "language": "en"}',
    'azurill',
    true,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic settings creation
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();