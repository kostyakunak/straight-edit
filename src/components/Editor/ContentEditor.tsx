import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Search, Filter, Upload, CheckCircle } from 'lucide-react';
import { DeployModal } from './DeployModal';
import type { Database } from '../../lib/database.types';

type TextElement = Database['public']['Tables']['text_elements']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface ContentEditorProps {
  projectId: string;
  onBack: () => void;
}

export function ContentEditor({ projectId, onBack }: ContentEditorProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [elements, setElements] = useState<TextElement[]>([]);
  const [filteredElements, setFilteredElements] = useState<TextElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editedElements, setEditedElements] = useState<Set<string>>(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  useEffect(() => {
    filterElements();
  }, [elements, searchQuery, filterType]);

  const loadProjectData = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      const { data: elementsData, error: elementsError } = await supabase
        .from('text_elements')
        .select('*')
        .eq('project_id', projectId)
        .order('file_id', { ascending: true });

      if (elementsError) throw elementsError;
      setElements(elementsData || []);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterElements = () => {
    let filtered = elements;

    if (searchQuery) {
      filtered = filtered.filter(
        (el) =>
          el.original_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (el.modified_text && el.modified_text.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      if (filterType === 'modified') {
        filtered = filtered.filter((el) => el.is_modified);
      } else {
        filtered = filtered.filter((el) => el.element_type === filterType);
      }
    }

    setFilteredElements(filtered);
  };

  const handleTextChange = (elementId: string, newText: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === elementId
          ? { ...el, modified_text: newText, is_modified: true }
          : el
      )
    );
    setEditedElements((prev) => new Set(prev).add(elementId));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const updates = elements
        .filter((el) => editedElements.has(el.id))
        .map((el) => ({
          id: el.id,
          modified_text: el.modified_text,
          is_modified: true,
          updated_at: new Date().toISOString(),
        }));

      for (const update of updates) {
        const { error } = await supabase
          .from('text_elements')
          .update(update)
          .eq('id', update.id);

        if (error) throw error;
      }

      setEditedElements(new Set());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setSaving(false);
    }
  };

  const uniqueTypes = Array.from(new Set(elements.map((el) => el.element_type)));
  const modifiedCount = elements.filter((el) => el.is_modified).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{project?.name}</h1>
                <p className="text-sm text-slate-600">
                  {project?.github_owner}/{project?.github_repo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Changes saved</span>
                </div>
              )}
              {modifiedCount > 0 && (
                <span className="text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                  {modifiedCount} modified
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving || editedElements.size === 0}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowDeployModal(true)}
                disabled={modifiedCount === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="modified">Modified Only</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredElements.map((element) => (
            <div
              key={element.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                element.is_modified || editedElements.has(element.id)
                  ? 'border-blue-300 ring-2 ring-blue-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    {element.element_type}
                  </span>
                  <span className="text-xs text-slate-500">
                    Line {element.line_number}
                  </span>
                  {(element.is_modified || editedElements.has(element.id)) && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Modified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Original
                  </label>
                  <div className="p-4 bg-slate-50 rounded-lg text-slate-900 border border-slate-200">
                    {element.original_text}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Modified
                  </label>
                  <textarea
                    value={element.modified_text || element.original_text}
                    onChange={(e) => handleTextChange(element.id, e.target.value)}
                    className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredElements.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-600">No text elements found</p>
          </div>
        )}
      </div>

      {showDeployModal && project && (
        <DeployModal
          projectId={projectId}
          project={project}
          onClose={() => setShowDeployModal(false)}
          onDeploySuccess={() => {
            loadProjectData();
          }}
        />
      )}
    </div>
  );
}
