/*
  # Create resume data table

  1. New Tables
    - `resume_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `personal_info` (jsonb, stores PersonalInfo data)
      - `summary` (text, professional summary)
      - `experience` (jsonb, array of Experience objects)
      - `education` (jsonb, array of Education objects)
      - `skills` (jsonb, array of Skill objects)
      - `certifications` (jsonb, array of Certification objects)
      - `languages` (jsonb, array of Language objects)
      - `custom_sections` (jsonb, custom sections data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `resume_data` table
    - Add policies for users to manage their own resume data

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on updated_at for sorting
*/

-- Create resume_data table
CREATE TABLE IF NOT EXISTS resume_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  personal_info jsonb DEFAULT '{}',
  summary text,
  experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  skills jsonb DEFAULT '[]',
  certifications jsonb DEFAULT '[]',
  languages jsonb DEFAULT '[]',
  custom_sections jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resume_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own resume data"
  ON resume_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume data"
  ON resume_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resume data"
  ON resume_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resume data"
  ON resume_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resume_data_user_id ON resume_data(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_data_updated_at ON resume_data(updated_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_resume_data_updated_at
  BEFORE UPDATE ON resume_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add constraints for data validation
ALTER TABLE resume_data 
ADD CONSTRAINT personal_info_is_object 
CHECK (jsonb_typeof(personal_info) = 'object');

ALTER TABLE resume_data 
ADD CONSTRAINT experience_is_array 
CHECK (jsonb_typeof(experience) = 'array');

ALTER TABLE resume_data 
ADD CONSTRAINT education_is_array 
CHECK (jsonb_typeof(education) = 'array');

ALTER TABLE resume_data 
ADD CONSTRAINT skills_is_array 
CHECK (jsonb_typeof(skills) = 'array');

ALTER TABLE resume_data 
ADD CONSTRAINT certifications_is_array 
CHECK (jsonb_typeof(certifications) = 'array');

ALTER TABLE resume_data 
ADD CONSTRAINT languages_is_array 
CHECK (jsonb_typeof(languages) = 'array');

ALTER TABLE resume_data 
ADD CONSTRAINT custom_sections_is_object 
CHECK (jsonb_typeof(custom_sections) = 'object');