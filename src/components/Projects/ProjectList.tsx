import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, FolderGit2, Calendar, ChevronRight } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export function ProjectList({ onSelectProject, onCreateProject }: ProjectListProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
          <p className="text-slate-600 mt-2">Import and edit content from GitHub repositories with StraightEdit</p>
        </div>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <FolderGit2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-6">
            Get started by importing your first GitHub repository
          </p>
          <button
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <FolderGit2 className="w-6 h-6 text-blue-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                {project.name}
              </h3>

              <div className="text-sm text-slate-600 mb-4">
                <p className="line-clamp-1">{project.github_owner}/{project.github_repo}</p>
                <p className="text-xs text-slate-500 mt-1">Branch: {project.github_branch}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(project.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
