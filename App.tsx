
import React, { useState } from 'react';
import { MembershipLevel, UIMode, AppState, Project, AppTab, SupportedLanguage } from './types';
import Library from './components/Library';
import ProjectDetail from './components/ProjectDetail';
import Editor from './components/Editor';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import { EditorProvider, useEditor } from './contexts/EditorContext';

const AppContent: React.FC = () => {
  const { currentModuleId, setModule } = useEditor();
  const [state, setState] = useState<AppState>({
    currentProject: null,
    activeModuleId: null,
    activeTab: AppTab.LIBRARY,
    uiMode: UIMode.MANAGEMENT,
    language: 'zh-TW',
    membership: MembershipLevel.FREE
  });

  const handleSelectProject = (proj: Project) => {
    setState(prev => ({ ...prev, currentProject: proj }));
  };

  const handleOpenModule = (moduleId: string) => {
    const module = state.currentProject?.modules.find(m => m.id === moduleId);
    if (module) {
      setModule(moduleId, module.content);
      setState(prev => ({ ...prev, activeModuleId: moduleId, activeTab: AppTab.WRITE }));
    }
  };

  const handleBackToProject = () => {
    setModule(null);
    setState(prev => ({ ...prev, activeModuleId: null, activeTab: AppTab.LIBRARY }));
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const currentModule = state.currentProject?.modules.find(m => m.id === currentModuleId);
  const isFocus = state.uiMode === UIMode.FOCUS;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black text-white selection:bg-[#7b61ff]/30">
      {/* 導航保護：無內容時渲染書架 */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {state.activeTab === AppTab.PROFILE ? (
          <Profile 
            state={state} 
            onUpgrade={() => setState(prev => ({ ...prev, membership: MembershipLevel.PRO }))} 
            onLanguageChange={handleLanguageChange} 
          />
        ) : state.activeTab === AppTab.WRITE && currentModule ? (
          <Editor 
            module={currentModule as any}
            project={state.currentProject!}
            uiMode={state.uiMode}
            onModeToggle={(mode) => setState(prev => ({ ...prev, uiMode: mode }))}
            onBack={handleBackToProject}
          />
        ) : state.currentProject ? (
          <ProjectDetail 
            project={state.currentProject}
            onBack={() => setState(prev => ({ ...prev, currentProject: null }))}
            onSelectModule={handleOpenModule}
          />
        ) : (
          <Library onSelectProject={handleSelectProject} />
        )}
      </main>

      {!isFocus && !currentModule && (
        <BottomNav 
          activeTab={state.activeTab} 
          onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
          isVisible={true}
        />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <EditorProvider>
    <AppContent />
  </EditorProvider>
);

export default App;
