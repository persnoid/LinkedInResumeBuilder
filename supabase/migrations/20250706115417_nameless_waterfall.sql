/*
  # Create drafts table

  1. New Tables
    - `drafts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text, draft name)
      - `resume_data` (jsonb, complete ResumeData object)
      - `selected_template` (text, template identifier)
      - `customizations` (jsonb, template customizations)
      - `step` (integer, current step in the process)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `drafts` table
    - Add policies for users to manage their own drafts

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on updated_at for sorting drafts
    - Add index on created_at for filtering

  4. Constraints
    - Ensure step is within valid range (0-3)
    - Ensure name is not empty
*/

-- Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL CHECK (length(trim(name)) > 0),
  resume_data jsonb NOT NULL DEFAULT '{}',
  selected_template text NOT NULL DEFAULT 'azurill',
  customizations jsonb DEFAULT '{}',
  step integer DEFAULT 0 CHECK (step >= 0 AND step <= 3),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own drafts"
  ON drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON drafts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON drafts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_drafts_created_at ON drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drafts_user_updated ON drafts(user_id, updated_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add additional constraints
ALTER TABLE drafts 
ADD CONSTRAINT resume_data_is_object 
CHECK (jsonb_typeof(resume_data) = 'object');

ALTER TABLE drafts 
ADD CONSTRAINT customizations_is_object 
CHECK (jsonb_typeof(customizations) = 'object');

ALTER TABLE drafts 
ADD CONSTRAINT selected_template_not_empty 
CHECK (length(trim(selected_template)) > 0);