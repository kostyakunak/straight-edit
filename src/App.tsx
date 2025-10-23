import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { ProjectList } from './components/Projects/ProjectList';
import { CreateProject } from './components/Projects/CreateProject';
import { ContentEditor } from './components/Editor/ContentEditor';
import { LogOut } from 'lucide-react';

type View = 'projects' | 'create' | 'editor';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('editor');
  };

  const handleProjectCreated = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('editor');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setCurrentView('projects');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'projects' && (
        <>
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end">
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
          <ProjectList
            onSelectProject={handleSelectProject}
            onCreateProject={() => setCurrentView('create')}
          />
        </>
      )}

      {currentView === 'create' && (
        <CreateProject
          onBack={handleBackToProjects}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {currentView === 'editor' && selectedProjectId && (
        <ContentEditor
          projectId={selectedProjectId}
          onBack={handleBackToProjects}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
