import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { githubService } from '../../services/github.service';
import { textExtractorService } from '../../services/textExtractor.service';
import { X, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type TextElement = Database['public']['Tables']['text_elements']['Row'];
type ProjectFile = Database['public']['Tables']['project_files']['Row'];

interface DeployModalProps {
  projectId: string;
  project: Project;
  onClose: () => void;
  onDeploySuccess: () => void;
}

export function DeployModal({ projectId, project, onClose, onDeploySuccess }: DeployModalProps) {
  const { user } = useAuth();
  const [commitMessage, setCommitMessage] = useState('Update content via StraightEdit');
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeploy = async (e: FormEvent) => {
    e.preventDefault();
    setDeploying(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const { data: modifiedElements, error: elementsError } = await supabase
        .from('text_elements')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_modified', true);

      if (elementsError) throw elementsError;

      if (!modifiedElements || modifiedElements.length === 0) {
        throw new Error('No modified elements to deploy');
      }

      const fileIds = Array.from(new Set(modifiedElements.map((el) => el.file_id)));
      const { data: files, error: filesError } = await supabase
        .from('project_files')
        .select('*')
        .in('id', fileIds);

      if (filesError) throw filesError;

      const filesToCommit: Array<{ path: string; content: string; sha: string }> = [];

      for (const file of files!) {
        const fileElements = modifiedElements.filter((el) => el.file_id === file.id);

        const changes = fileElements.map((el) => ({
          original: el.original_text,
          modified: el.modified_text || el.original_text,
          start: el.start_position,
          end: el.end_position,
        }));

        const modifiedContent = textExtractorService.applyTextChanges(
          file.original_content,
          changes
        );

        filesToCommit.push({
          path: file.file_path,
          content: modifiedContent,
          sha: file.file_sha,
        });
      }

      const { data: deployment, error: deploymentError } = await supabase
        .from('deployments')
        .insert({
          project_id: projectId,
          user_id: user!.id,
          commit_message: commitMessage,
          status: 'processing',
          files_changed: filesToCommit.length,
        })
        .select()
        .single();

      if (deploymentError) throw deploymentError;

      try {
        const result = await githubService.commitChanges(
          project.github_owner,
          project.github_repo,
          project.github_branch,
          project.github_token!,
          filesToCommit,
          commitMessage
        );

        await supabase
          .from('deployments')
          .update({
            status: 'success',
            commit_sha: result.sha,
            deployed_at: new Date().toISOString(),
          })
          .eq('id', deployment.id);

        for (const file of files!) {
          const fileElements = modifiedElements.filter((el) => el.file_id === file.id);
          const changes = fileElements.map((el) => ({
            original: el.original_text,
            modified: el.modified_text || el.original_text,
            start: el.start_position,
            end: el.end_position,
          }));

          const modifiedContent = textExtractorService.applyTextChanges(
            file.original_content,
            changes
          );

          await supabase
            .from('project_files')
            .update({
              original_content: modifiedContent,
              modified_content: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', file.id);
        }

        for (const element of modifiedElements) {
          await supabase
            .from('text_elements')
            .update({
              original_text: element.modified_text || element.original_text,
              modified_text: null,
              is_modified: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', element.id);
        }

        setStatus('success');
        setTimeout(() => {
          onDeploySuccess();
          onClose();
        }, 2000);
      } catch (deployError: any) {
        await supabase
          .from('deployments')
          .update({
            status: 'failed',
            error_message: deployError.message,
          })
          .eq('id', deployment.id);

        throw deployError;
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to deploy changes');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Deploy Changes</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleDeploy} className="p-6 space-y-6">
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                Changes deployed successfully to GitHub!
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Commit Message
            </label>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Describe your changes..."
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              This will commit your changes to the{' '}
              <span className="font-medium text-slate-900">{project.github_branch}</span> branch
              of{' '}
              <span className="font-medium text-slate-900">
                {project.github_owner}/{project.github_repo}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deploying || status === 'success'}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deploying ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Deploying...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Deployed
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Deploy to GitHub
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
