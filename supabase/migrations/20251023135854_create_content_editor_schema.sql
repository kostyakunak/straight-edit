/*
  # Content Editor Platform Schema

  ## Overview
  This migration creates the database schema for a platform that allows non-technical users
  to edit website content from GitHub repositories and deploy changes back.

  ## New Tables

  ### `projects`
  - `id` (uuid, primary key) - Unique project identifier
  - `user_id` (uuid, foreign key) - Owner of the project
  - `name` (text) - Project display name
  - `github_repo_url` (text) - Full GitHub repository URL
  - `github_owner` (text) - Repository owner username
  - `github_repo` (text) - Repository name
  - `github_branch` (text) - Target branch (default: main)
  - `github_token` (text) - Encrypted GitHub personal access token
  - `last_sync_at` (timestamptz) - Last synchronization timestamp
  - `created_at` (timestamptz) - Project creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `project_files`
  - `id` (uuid, primary key) - Unique file identifier
  - `project_id` (uuid, foreign key) - Associated project
  - `file_path` (text) - Relative file path in repository
  - `file_type` (text) - File extension (html, jsx, tsx, etc)
  - `original_content` (text) - Original file content from GitHub
  - `modified_content` (text, nullable) - Modified content (if edited)
  - `file_sha` (text) - GitHub file SHA for version tracking
  - `created_at` (timestamptz) - File import timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `text_elements`
  - `id` (uuid, primary key) - Unique text element identifier
  - `file_id` (uuid, foreign key) - Associated file
  - `project_id` (uuid, foreign key) - Associated project (for quick access)
  - `element_type` (text) - Type: heading, paragraph, button, label, etc
  - `original_text` (text) - Original extracted text
  - `modified_text` (text, nullable) - User-modified text
  - `context_path` (text) - DOM/JSX path for precise location
  - `line_number` (integer) - Line number in source file
  - `start_position` (integer) - Character start position
  - `end_position` (integer) - Character end position
  - `is_modified` (boolean) - Flag for tracking changes
  - `created_at` (timestamptz) - Element extraction timestamp
  - `updated_at` (timestamptz) - Last modification timestamp

  ### `deployments`
  - `id` (uuid, primary key) - Unique deployment identifier
  - `project_id` (uuid, foreign key) - Associated project
  - `user_id` (uuid, foreign key) - User who triggered deployment
  - `commit_sha` (text, nullable) - GitHub commit SHA
  - `commit_message` (text) - Deployment commit message
  - `status` (text) - Status: pending, processing, success, failed
  - `files_changed` (integer) - Number of files modified
  - `error_message` (text, nullable) - Error details if failed
  - `deployed_at` (timestamptz) - Deployment timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own projects and related data
  - Strict authentication requirements on all operations

  ### Policies
  Each table has separate policies for SELECT, INSERT, UPDATE, and DELETE:
  - SELECT: Users can view their own data
  - INSERT: Users can create data for their projects
  - UPDATE: Users can modify their own data
  - DELETE: Users can delete their own data

  ## Indexes
  - Fast lookups by project_id and user_id
  - Efficient file and text element queries
  - Deployment history tracking

  ## Important Notes
  1. GitHub tokens are stored encrypted (application-level encryption recommended)
  2. File content is stored to track changes and enable precise text replacement
  3. Text elements maintain position tracking for accurate code modification
  4. Deployment history provides audit trail and rollback capability
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  github_repo_url text NOT NULL,
  github_owner text NOT NULL,
  github_repo text NOT NULL,
  github_branch text NOT NULL DEFAULT 'main',
  github_token text,
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_files table
CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_type text NOT NULL,
  original_content text NOT NULL,
  modified_content text,
  file_sha text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, file_path)
);

-- Create text_elements table
CREATE TABLE IF NOT EXISTS text_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid NOT NULL REFERENCES project_files(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  element_type text NOT NULL,
  original_text text NOT NULL,
  modified_text text,
  context_path text NOT NULL,
  line_number integer NOT NULL,
  start_position integer NOT NULL,
  end_position integer NOT NULL,
  is_modified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commit_sha text,
  commit_message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  files_changed integer DEFAULT 0,
  error_message text,
  deployed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_text_elements_file_id ON text_elements(file_id);
CREATE INDEX IF NOT EXISTS idx_text_elements_project_id ON text_elements(project_id);
CREATE INDEX IF NOT EXISTS idx_text_elements_modified ON text_elements(project_id, is_modified);
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments(user_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Project files policies
CREATE POLICY "Users can view files from own projects"
  ON project_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create files in own projects"
  ON project_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update files in own projects"
  ON project_files FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files from own projects"
  ON project_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Text elements policies
CREATE POLICY "Users can view text elements from own projects"
  ON text_elements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = text_elements.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create text elements in own projects"
  ON text_elements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = text_elements.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update text elements in own projects"
  ON text_elements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = text_elements.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = text_elements.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete text elements from own projects"
  ON text_elements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = text_elements.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Deployments policies
CREATE POLICY "Users can view own deployments"
  ON deployments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create deployments for own projects"
  ON deployments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own deployments"
  ON deployments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deployments"
  ON deployments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);