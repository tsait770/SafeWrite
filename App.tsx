
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MembershipLevel, UIMode, AppState, Project, AppMode, AppTab, ThemeMode, VersionSnapshot, SnapshotType, Chapter, WritingType, ModuleType, WritingModule, OutlineNode } from './types';
import { TEMPLATES, PROJECT_COLORS, PROJECT_ICONS } from './constants';
import Library from './components/Library';
import CaptureCenter from './components/CaptureCenter';
import Profile from './components/Profile';
import Editor from './components/Editor';
import Timeline from './components/Timeline';
import BottomNav from './components/BottomNav';
import ProfessionalPublicationCenter from './components/ProfessionalPublicationCenter';
import StructureGraph from './components/StructureGraph';
import ProjectDetail from './components/ProjectDetail';
import CollaborationPanel from './components/CollaborationPanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    projects: [
      {
        id: 'p1',
        name: 'The Solar Paradox',
        writingType: WritingType.LONG_FORM,
        targetWordCount: 50000,
        metadata: 'Edited 10m ago',
        progress: 82,
        color: PROJECT_COLORS[4],
        icon: 'fa-feather-pointed',
        chapters: [{ id: 'c1', title: '第 1 章 · Chapter 1', content: '故事開始於太陽不再升起的那一天...', order: 1, history: [], wordCount: 1250, lastEdited: Date.now() }],
        modules: [],
        settings: { typography: 'serif', fontSize: 'normal' },
        createdAt: Date.now() - 600000 * 24 * 12,
        updatedAt: Date.now() - 600000,
        tags: ['SCI-FI', 'SPACE'],
        isPinned: true
      }
    ],
    currentProject: null,
    currentChapterId: null,
    uiMode: UIMode.MANAGEMENT,
    appMode: AppMode.REPOSITORY,
    activeTab: AppTab.LIBRARY,
    theme: ThemeMode.NIGHT,
    membership: MembershipLevel.FREE,
    language: 'zh-TW',
    stats: { 
      wordCount: 58210, 
      projectCount: 4, 
      exportCount: 2, 
      lastActive: Date.now(), 
      hasTrialed: false,
      dailyGoal: 1000,
      writingStreak: 12,
      todayWords: 450
    },
    editorSettings: {
      typewriterMode: false,
      previewMode: false
    }
  });

  const [activeOverlay, setActiveOverlay] = useState<'NONE' | 'TIMELINE' | 'GRAPH' | 'EXPORT' | 'COLLABORATION'>('NONE');

  const handleUpdateProject = (updated: Project) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === updated.id ? updated : p),
      currentProject: prev.currentProject?.id === updated.id ? updated : prev.currentProject
    }));
  };

  const handleEnterEditor = (chapterId: string) => {
    setState(prev => ({ ...prev, currentChapterId: chapterId, activeTab: AppTab.WRITE }));
  };

  const handleUpdateContent = (newContent: string) => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const chapters = prev.currentProject.chapters.map(c => 
        c.id === prev.currentChapterId ? { ...c, content: newContent, wordCount: newContent.length, lastEdited: Date.now() } : c
      );
      const updatedProject = { ...prev.currentProject, chapters, updatedAt: Date.now() };
      return {
        ...prev,
        projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p),
        currentProject: updatedProject
      };
    });
  };

  const currentChapter = state.currentProject?.chapters.find(c => c.id === state.currentChapterId);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {state.activeTab !== AppTab.WRITE && (
        <header className="fixed top-0 w-full z-[100] h-24 flex items-end justify-between px-8 pb-4 bg-black/60 backdrop-blur-3xl border-b border-white/5">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter">SafeWrite</h1>
            <p className="text-[10px] text-[#8e8e93] font-black uppercase tracking-[0.2em] mt-0.5">專業級敘事引擎</p>
          </div>
          <button onClick={() => setState(p => ({...p, appMode: p.appMode === AppMode.REPOSITORY ? AppMode.CAPTURE : AppMode.REPOSITORY}))} className="dual-mode-toggle group">
             <i className={`fa-solid fa-circle-nodes text-2xl transition-all ${state.appMode === AppMode.CAPTURE ? 'text-[#D4FF5F]' : 'text-white'}`}></i>
          </button>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar ${state.activeTab === AppTab.WRITE ? 'p-0' : 'pt-24 pb-32'}`}>
        {state.activeTab === AppTab.LIBRARY ? (
          state.appMode === AppMode.REPOSITORY ? (
            <Library 
              projects={state.projects} 
              onSelectProject={(p) => setState(prev => ({...prev, currentProject: p, activeTab: AppTab.PROJECT_DETAIL}))}
              onCreateProject={(proj) => setState(prev => ({...prev, projects: [proj, ...prev.projects]}))}
              onUpdateProjects={(p) => setState(prev => ({...prev, projects: p}))}
            />
          ) : (
            <CaptureCenter 
              projects={state.projects}
              onSaveToProject={(pid, content) => {}}
            />
          )
        ) : state.activeTab === AppTab.PROJECT_DETAIL ? (
          <ProjectDetail 
            project={state.currentProject!} 
            onBack={() => setState(prev => ({ ...prev, activeTab: AppTab.LIBRARY }))}
            onOpenModule={() => {}}
            onUpdateProject={handleUpdateProject}
            onEnterEditor={handleEnterEditor}
          />
        ) : state.activeTab === AppTab.WRITE ? (
          currentChapter ? (
            <Editor 
              chapter={currentChapter}
              onUpdateContent={handleUpdateContent}
              uiMode={state.uiMode}
              onModeToggle={(mode) => setState(prev => ({ ...prev, uiMode: mode }))}
              onOpenTimeline={() => setActiveOverlay('TIMELINE')}
              onOpenCollaboration={() => setActiveOverlay('COLLABORATION')}
              onBack={() => setState(prev => ({ ...prev, activeTab: AppTab.PROJECT_DETAIL }))}
              onUpdateOutline={() => {}}
              membership={state.membership}
            />
          ) : null
        ) : state.activeTab === AppTab.PROFILE ? (
          <Profile state={state} onUpgrade={() => setActiveOverlay('EXPORT')} onLanguageChange={(l) => setState(prev => ({...prev, language: l}))} />
        ) : null}
      </main>

      <BottomNav 
        activeTab={state.activeTab} 
        onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
        isVisible={activeOverlay === 'NONE' && state.activeTab !== AppTab.WRITE}
      />

      {activeOverlay === 'TIMELINE' && (
        <Timeline 
          history={currentChapter?.history || []} 
          onClose={() => setActiveOverlay('NONE')} 
          onRestore={() => {}}
          onPreview={() => {}} 
          onCreateMilestone={() => {}}
          onClearAuto={() => {}}
        />
      )}
      {activeOverlay === 'COLLABORATION' && <CollaborationPanel onClose={() => setActiveOverlay('NONE')} />}
      {activeOverlay === 'EXPORT' && <ProfessionalPublicationCenter onClose={() => setActiveOverlay('NONE')} />}
    </div>
  );
};

export default App;
