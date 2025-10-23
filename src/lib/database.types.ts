export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          github_repo_url: string;
          github_owner: string;
          github_repo: string;
          github_branch: string;
          github_token: string | null;
          last_sync_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          github_repo_url: string;
          github_owner: string;
          github_repo: string;
          github_branch?: string;
          github_token?: string | null;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          github_repo_url?: string;
          github_owner?: string;
          github_repo?: string;
          github_branch?: string;
          github_token?: string | null;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_files: {
        Row: {
          id: string;
          project_id: string;
          file_path: string;
          file_type: string;
          original_content: string;
          modified_content: string | null;
          file_sha: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          file_path: string;
          file_type: string;
          original_content: string;
          modified_content?: string | null;
          file_sha: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          file_path?: string;
          file_type?: string;
          original_content?: string;
          modified_content?: string | null;
          file_sha?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      text_elements: {
        Row: {
          id: string;
          file_id: string;
          project_id: string;
          element_type: string;
          original_text: string;
          modified_text: string | null;
          context_path: string;
          line_number: number;
          start_position: number;
          end_position: number;
          is_modified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_id: string;
          project_id: string;
          element_type: string;
          original_text: string;
          modified_text?: string | null;
          context_path: string;
          line_number: number;
          start_position: number;
          end_position: number;
          is_modified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          file_id?: string;
          project_id?: string;
          element_type?: string;
          original_text?: string;
          modified_text?: string | null;
          context_path?: string;
          line_number?: number;
          start_position?: number;
          end_position?: number;
          is_modified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      deployments: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          commit_sha: string | null;
          commit_message: string;
          status: string;
          files_changed: number;
          error_message: string | null;
          deployed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          commit_sha?: string | null;
          commit_message: string;
          status?: string;
          files_changed?: number;
          error_message?: string | null;
          deployed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          commit_sha?: string | null;
          commit_message?: string;
          status?: string;
          files_changed?: number;
          error_message?: string | null;
          deployed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
