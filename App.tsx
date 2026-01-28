
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
        name: '太陽悖論 The Solar Paradox',
        writingType: WritingType.NOVEL,
        metadata: '10 分鐘前編輯',
        progress: 82,
        color: PROJECT_COLORS[0],
        icon: 'fa-feather-pointed',
        chapters: [{ id: 'c1', title: 'Chapter 1', content: 'Story starts...', order: 1, history: [] }],
        modules: TEMPLATES[WritingType.NOVEL].modules.map((m, i) => ({ ...m, id: `m-${i}`, order: i } as WritingModule)),
        settings: { typography: 'serif', fontSize: 'normal' },
        createdAt: Date.now() - 600000,
        updatedAt: Date.now() - 600000,
        tags: ['科幻', '長篇小說'],
        isPinned: true
      },
      {
        id: 'p2',
        name: '深海餘燼 Echoes of Deep',
        writingType: WritingType.NOVEL,
        metadata: '待審閱中',
        progress: 95,
        color: PROJECT_COLORS[1],
        icon: 'fa-scroll',
        chapters: [{ id: 'c2', title: '序章', content: '海洋深處的聲音...', order: 1, history: [] }],
        modules: TEMPLATES[WritingType.NOVEL].modules.map((m, i) => ({ ...m, id: `m-${i}`, order: i } as WritingModule)),
        settings: { typography: 'serif', fontSize: 'normal' },
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000,
        tags: ['懸疑', '劇本']
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
      wordCount: 45210, 
      projectCount: 4, 
      exportCount: 0, 
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
  const [isRestoring, setIsRestoring] = useState(false);

  const handleQuickWrite = (proj: Project) => {
    const lastChapterId = proj.chapters[0]?.id || null;
    setState(prev => ({
      ...prev,
      currentProject: proj,
      currentChapterId: lastChapterId,
      activeTab: AppTab.WRITE,
      uiMode: UIMode.FOCUS
    }));
  };

  const createSnapshot = useCallback((type: SnapshotType) => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const chapter = prev.currentProject.chapters.find(c => c.id === prev.currentChapterId);
      if (!chapter) return prev;

      const newSnapshot: VersionSnapshot = {
        id: 'snap-' + Date.now(),
        timestamp: Date.now(),
        content: chapter.content,
        title: chapter.title,
        type: type,
        milestoneName: type === SnapshotType.MILESTONE ? `Milestone ${chapter.history.length + 1}` : undefined
      };

      const newChapters = prev.currentProject.chapters.map(c => {
        if (c.id === prev.currentChapterId) {
          return { ...c, history: [newSnapshot, ...c.history] };
        }
        return c;
      });

      const updatedProject = { ...prev.currentProject, chapters: newChapters, updatedAt: Date.now() };
      return { ...prev, currentProject: updatedProject };
    });
  }, []);

  const handleRestore = (snapshot: VersionSnapshot) => {
    setIsRestoring(true);
    setTimeout(() => {
      setState(prev => {
        if (!prev.currentProject || !prev.currentChapterId) return prev;
        const newChapters = prev.currentProject.chapters.map(c => {
          if (c.id === prev.currentChapterId) return { ...c, content: snapshot.content, title: snapshot.title };
          return c;
        });
        const updatedProject = { ...prev.currentProject, chapters: newChapters, updatedAt: Date.now() };
        return { ...prev, currentProject: updatedProject };
      });
      setIsRestoring(false);
      setActiveOverlay('NONE');
    }, 800);
  };

  const handleUpdateContent = (newContent: string) => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const project = { ...prev.currentProject };
      const chapters = project.chapters.map(c => 
        c.id === prev.currentChapterId ? { ...c, content: newContent } : c
      );
      const oldChapter = prev.currentProject.chapters.find(c => c.id === prev.currentChapterId);
      const diff = newContent.length - (oldChapter?.content.length || 0);
      
      const updatedProject = { ...project, chapters, updatedAt: Date.now() };
      const updatedProjects = prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p);

      return { 
        ...prev, 
        projects: updatedProjects,
        currentProject: updatedProject,
        stats: { ...prev.stats, todayWords: Math.max(0, prev.stats.todayWords + diff) }
      };
    });
  };

  const handleUpdateOutline = (nodes: OutlineNode[]) => {
    setState(prev => {
      if (!prev.currentProject) return prev;
      const updatedProject = { ...prev.currentProject, visualOutline: nodes };
      const updatedProjects = prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p);
      return { ...prev, projects: updatedProjects, currentProject: updatedProject };
    });
  };

  const handleSelectProject = (proj: Project) => {
    setState(prev => ({ ...prev, currentProject: proj, activeTab: AppTab.PROJECT_DETAIL }));
  };

  const handleOpenModule = (moduleId: string) => {
    if (!state.currentProject) return;
    const module = state.currentProject.modules.find(m => m.id === moduleId);
    if (module?.type === 'MANUSCRIPT') {
        const chapters = state.currentProject.chapters || [];
        setState(prev => ({
            ...prev,
            currentChapterId: chapters[0]?.id || null,
            activeTab: AppTab.WRITE
        }));
    }
  };

  const currentChapter = state.currentProject?.chapters.find(c => c.id === state.currentChapterId);
  const isFocus = state.uiMode === UIMode.FOCUS;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {state.activeTab !== AppTab.WRITE && (
        <header className="fixed top-0 w-full z-[100] h-24 flex items-end justify-between px-8 pb-4 bg-black/60 backdrop-blur-3xl border-b border-white/5 transition-transform duration-500">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter">
              {state.activeTab === AppTab.PROJECT_DETAIL ? (state.currentProject?.name || '專案') : (state.appMode === AppMode.REPOSITORY ? 'SafeWrite' : '靈感中心')}
            </h1>
            <p className="text-[10px] text-[#8e8e93] font-black uppercase tracking-[0.2em] mt-0.5">
              {state.activeTab === AppTab.PROJECT_DETAIL ? '智慧倉庫 SMART REPOSITORY' : (state.appMode === AppMode.REPOSITORY ? '檔案與存放庫 FILES & REPOSITORIES' : '靈感擷取 CAPTURE CENTER')}
            </p>
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
              onSelectProject={handleSelectProject} 
              onCreateProject={(data) => setState(prev => ({...prev, projects: [{...data, id: 'p-'+Date.now(), chapters: [], modules: [], metadata: '剛剛', progress: 0, settings: {typography: 'serif', fontSize: 'normal'}, createdAt: Date.now(), updatedAt: Date.now(), tags: []} as any, ...prev.projects]}))}
              onUpdateProjects={(p) => setState(prev => ({...prev, projects: p}))}
              onQuickWrite={handleQuickWrite}
            />
          ) : (
            <CaptureCenter 
              projects={state.projects}
              onSaveToProject={(pid, content) => { /* logic here */ }}
            />
          )
        ) : state.activeTab === AppTab.PROJECT_DETAIL ? (
          <ProjectDetail 
            project={state.currentProject!} 
            onBack={() => setState(prev => ({ ...prev, activeTab: AppTab.LIBRARY }))}
            onOpenModule={handleOpenModule}
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
              onUpdateOutline={handleUpdateOutline}
              isRestored={isRestoring}
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
        isVisible={!isFocus && activeOverlay === 'NONE' && state.activeTab !== AppTab.WRITE}
      />

      {activeOverlay === 'TIMELINE' && (
        <Timeline 
          history={currentChapter?.history || []} 
          onClose={() => setActiveOverlay('NONE')} 
          onRestore={handleRestore}
          onPreview={() => {}} 
          onCreateMilestone={() => createSnapshot(SnapshotType.MILESTONE)}
          onClearAuto={() => {}}
        />
      )}
      {activeOverlay === 'COLLABORATION' && <CollaborationPanel onClose={() => setActiveOverlay('NONE')} />}
      {activeOverlay === 'EXPORT' && <ProfessionalPublicationCenter onClose={() => setActiveOverlay('NONE')} />}
    </div>
  );
};

export default App;
