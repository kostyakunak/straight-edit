import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { githubService } from '../../services/github.service';
import { textExtractorService } from '../../services/textExtractor.service';
import { ArrowLeft, Github, AlertCircle, Loader } from 'lucide-react';

interface CreateProjectProps {
  onBack: () => void;
  onProjectCreated: (projectId: string) => void;
}

export function CreateProject({ onBack, onProjectCreated }: CreateProjectProps) {
  const { user } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [branch, setBranch] = useState('main');
  const [githubToken, setGithubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const parsed = githubService.parseRepoUrl(repoUrl);
      if (!parsed) {
        throw new Error('Invalid GitHub repository URL');
      }

      setProgress('Creating project...');
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user!.id,
          name: projectName || `${parsed.owner}/${parsed.repo}`,
          github_repo_url: repoUrl,
          github_owner: parsed.owner,
          github_repo: parsed.repo,
          github_branch: branch,
          github_token: githubToken,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      setProgress('Fetching repository files...');
      const files = await githubService.fetchRepositoryFiles(
        parsed.owner,
        parsed.repo,
        branch,
        githubToken
      );

      setProgress(`Processing ${files.length} files...`);
      for (const file of files) {
        const { data: fileRecord, error: fileError } = await supabase
          .from('project_files')
          .insert({
            project_id: project.id,
            file_path: file.path,
            file_type: file.type,
            original_content: file.content,
            file_sha: file.sha,
          })
          .select()
          .single();

        if (fileError) throw fileError;

        const textElements = textExtractorService.extractTextElements(
          file.content,
          file.type
        );

        if (textElements.length > 0) {
          const elementsToInsert = textElements.map((element) => ({
            file_id: fileRecord.id,
            project_id: project.id,
            element_type: element.elementType,
            original_text: element.originalText,
            context_path: element.contextPath,
            line_number: element.lineNumber,
            start_position: element.startPosition,
            end_position: element.endPosition,
          }));

          const { error: elementsError } = await supabase
            .from('text_elements')
            .insert(elementsToInsert);

          if (elementsError) throw elementsError;
        }
      }

      await supabase
        .from('projects')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', project.id);

      onProjectCreated(project.id);
    } catch (err: any) {
      setError(err.message || 'Failed to import project');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Projects
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Github className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Import GitHub Repository</h2>
            <p className="text-slate-600 text-sm">Connect your repository to edit content with StraightEdit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {progress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-sm text-blue-800">{progress}</p>
            </div>
          )}

          <div>
            <label htmlFor="repoUrl" className="block text-sm font-medium text-slate-700 mb-2">
              Repository URL
            </label>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://github.com/username/repository"
            />
          </div>

          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="My Website"
            />
            <p className="text-xs text-slate-500 mt-1">Optional - defaults to repository name</p>
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-slate-700 mb-2">
              Branch
            </label>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="main"
            />
          </div>

          <div>
            <label htmlFor="githubToken" className="block text-sm font-medium text-slate-700 mb-2">
              GitHub Personal Access Token
            </label>
            <input
              id="githubToken"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="ghp_..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Required for accessing repository. Create one at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub Settings
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Project'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
