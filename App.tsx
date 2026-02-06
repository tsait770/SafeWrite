
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MembershipLevel, UIMode, AppState, Project, AppMode, AppTab, ThemeMode, VersionSnapshot, SnapshotType, Chapter, WritingType, StructureType, AIPreferences, SecuritySettings } from './types';
import { TEMPLATES, PROJECT_COLORS, PROJECT_ICONS, TEMPLATE_STRUCTURE_MAP } from './constants';
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
        writingType: WritingType.NOVEL,
        structureType: StructureType.CHAPTER,
        targetWordCount: 50000,
        metadata: 'EDITED 10M AGO',
        progress: 82,
        color: '#FADE4B', // 太陽黃
        icon: 'fa-feather-pointed',
        chapters: [{ 
          id: 'c1', 
          title: '第 1 章 · Chapter 1', 
          content: '故事開始於太陽不再升起的那一天...', 
          order: 1, 
          history: [
            { id: 'v1', timestamp: Date.now() - 3600000, content: '初始草稿...', title: '第 1 章', type: SnapshotType.AUTO },
            { id: 'v2', timestamp: Date.now() - 1800000, content: '故事開始於...', title: '第 1 章', type: SnapshotType.MILESTONE }
          ], 
          wordCount: 1250, 
          lastEdited: Date.now(),
          createdAt: Date.now() - 3600000
        }],
        modules: [],
        settings: { typography: 'serif', fontSize: 'normal' },
        createdAt: Date.now() - 600000 * 24 * 12,
        updatedAt: Date.now() - 600000,
        tags: ['SCI-FI', 'SPACE'],
        isPinned: true
      },
      {
        id: 'p2',
        name: 'Vibrant Horizons',
        writingType: WritingType.BLOG,
        structureType: StructureType.SECTION,
        targetWordCount: 10000,
        metadata: 'EDITED 2H AGO',
        progress: 35,
        color: '#FF6B2C', // 活力橘
        icon: 'fa-pen-nib',
        chapters: [],
        modules: [],
        settings: { typography: 'sans', fontSize: 'normal' },
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 7200000,
        tags: ['TECH', 'WEB3'],
        isPinned: false
      },
      {
        id: 'p3',
        name: 'Neon Thoughts',
        writingType: WritingType.DIARY,
        structureType: StructureType.FREE,
        targetWordCount: 5000,
        metadata: 'EDITED 1D AGO',
        progress: 95,
        color: '#D4FF5F', // 螢光綠
        icon: 'fa-note-sticky',
        chapters: [],
        modules: [],
        settings: { typography: 'serif', fontSize: 'normal' },
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 86400000,
        tags: ['PERSONAL'],
        isPinned: false
      },
      {
        id: 'p4',
        name: 'Dreamy Sequences',
        writingType: WritingType.SCREENPLAY,
        structureType: StructureType.CHAPTER,
        targetWordCount: 20000,
        metadata: 'EDITED 3D AGO',
        progress: 12,
        color: '#B2A4FF', // 夢幻紫
        icon: 'fa-clapperboard',
        chapters: [],
        modules: [],
        settings: { typography: 'serif', fontSize: 'normal' },
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 259200000,
        tags: ['FILM'],
        isPinned: false
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
    aiPreferences: {
      provider: 'DEFAULT',
      customModel: 'gemini-3-pro-preview',
      tone: 'CREATIVE',
      enableThinking: true,
      thinkingBudget: 32768
    },
    securitySettings: {
      autoSnapshotEnabled: true,
      autoSnapshotMode: 'interval',
      autoSnapshotIntervalMinutes: 2,
      autoSnapshotIdleSeconds: 30,
      autoSnapshotCleanupDays: 30 
    },
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
  
  const [swipeProgress, setSwipeProgress] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const lastSnapshotContentRef = useRef<string>('');
  const idleTimerRef = useRef<number | null>(null);
  const intervalTimerRef = useRef<number | null>(null);
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lazy Migration for StructureType
  useEffect(() => {
    setState(prev => {
        const needsUpdate = prev.projects.some(p => !p.structureType);
        if (!needsUpdate) return prev;
        
        const updatedProjects = prev.projects.map(p => {
            if (!p.structureType) {
                return { ...p, structureType: TEMPLATE_STRUCTURE_MAP[p.writingType] || StructureType.FREE };
            }
            return p;
        });
        return { ...prev, projects: updatedProjects };
    });
  }, []);

  const isTabletOrDesktop = windowWidth >= 768;
  const panelWidth = isTabletOrDesktop ? windowWidth / 3 : windowWidth * 0.85;

  const handleGlobalTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    
    const edgeThreshold = isTabletOrDesktop ? screenWidth * 0.95 : screenWidth * 0.85;
    if (state.activeTab === AppTab.WRITE && state.currentChapterId && x > edgeThreshold && activeOverlay === 'NONE') {
      touchStartX.current = x;
      setIsDragging(true);
    }
  };

  const handleGlobalTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const deltaX = touchStartX.current - currentX; 
    
    const progress = Math.min(Math.max(deltaX / panelWidth, 0), 1);
    setSwipeProgress(progress);
  };

  const handleGlobalTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    setIsDragging(false);
    if (swipeProgress > 0.2) {
      setSwipeProgress(1);
      setActiveOverlay('TIMELINE');
    } else {
      setSwipeProgress(0);
      setActiveOverlay('NONE');
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (activeOverlay === 'TIMELINE') setSwipeProgress(1);
    else if (activeOverlay === 'NONE') setSwipeProgress(0);
  }, [activeOverlay]);

  const handleUpdateProject = (updated: Project) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === updated.id ? updated : p),
      currentProject: prev.currentProject?.id === updated.id ? updated : prev.currentProject
    }));
  };

  const handleUpdateAIPreferences = (prefs: AIPreferences) => {
    setState(prev => ({ ...prev, aiPreferences: prefs }));
  };

  const handleUpdateSecuritySettings = (settings: SecuritySettings) => {
    setState(prev => ({ ...prev, securitySettings: settings }));
  };

  const handleDeleteProject = (projectId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId),
      currentProject: null,
      activeTab: AppTab.LIBRARY
    }));
  };

  const handleEnterEditor = (chapterId: string) => {
    setState(prev => ({ ...prev, currentChapterId: chapterId, activeTab: AppTab.WRITE }));
  };

  const createSnapshot = useCallback((type: SnapshotType) => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const chapter = prev.currentProject.chapters.find(c => c.id === prev.currentChapterId);
      if (!chapter) return prev;

      if (type === SnapshotType.AUTO && chapter.content === lastSnapshotContentRef.current) return prev;

      const newSnapshot: VersionSnapshot = {
        id: `v-${Date.now()}`,
        timestamp: Date.now(),
        content: chapter.content,
        title: chapter.title,
        type: type
      };

      lastSnapshotContentRef.current = chapter.content;

      const updatedChapters = prev.currentProject.chapters.map(c => 
        c.id === prev.currentChapterId ? { ...c, history: [newSnapshot, ...(c.history || [])] } : c
      );

      const updatedProject = { ...prev.currentProject, chapters: updatedChapters };
      return {
        ...prev,
        projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p),
        currentProject: updatedProject
      };
    });
  }, []);

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

    if (state.securitySettings.autoSnapshotEnabled && state.securitySettings.autoSnapshotMode === 'idle') {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        createSnapshot(SnapshotType.AUTO);
      }, state.securitySettings.autoSnapshotIdleSeconds * 1000);
    }
  };

  useEffect(() => {
    if (intervalTimerRef.current) window.clearInterval(intervalTimerRef.current);
    
    if (state.securitySettings.autoSnapshotEnabled && state.securitySettings.autoSnapshotMode === 'interval') {
      intervalTimerRef.current = window.setInterval(() => {
        createSnapshot(SnapshotType.AUTO);
      }, state.securitySettings.autoSnapshotIntervalMinutes * 60000);
    }

    return () => {
      if (intervalTimerRef.current) window.clearInterval(intervalTimerRef.current);
    };
  }, [state.securitySettings.autoSnapshotEnabled, state.securitySettings.autoSnapshotMode, state.securitySettings.autoSnapshotIntervalMinutes, createSnapshot]);

  const handleCreateMilestone = () => {
    createSnapshot(SnapshotType.MILESTONE);
  };

  const handleRestoreSnapshot = (snapshot: VersionSnapshot) => {
    handleUpdateContent(snapshot.content);
    setActiveOverlay('NONE');
  };

  const handleClearAutoSnapshots = () => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const updatedChapters = prev.currentProject.chapters.map(c => 
        c.id === prev.currentChapterId ? { ...c, history: (c.history || []).filter(h => h.type === SnapshotType.MILESTONE) } : c
      );
      const updatedProject = { ...prev.currentProject, chapters: updatedChapters };
      return {
        ...prev,
        projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p),
        currentProject: updatedProject
      };
    });
  };

  const currentChapter = state.currentProject?.chapters.find(c => c.id === state.currentChapterId);
  const isBottomNavVisible = (activeOverlay === 'NONE' && swipeProgress === 0) && (state.activeTab !== AppTab.WRITE || !currentChapter);

  return (
    <div 
      className="h-screen flex flex-col relative overflow-hidden bg-black text-white"
      onTouchStart={handleGlobalTouchStart}
      onTouchMove={handleGlobalTouchMove}
      onTouchEnd={handleGlobalTouchEnd}
    >
      {state.activeTab !== AppTab.WRITE && (
        <header className="fixed top-0 w-full z-[100] h-24 pt-[env(safe-area-inset-top,0px)] flex items-end justify-between px-8 pb-4 bg-black/60 backdrop-blur-3xl border-b border-white/5">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-white">SafeWrite</h1>
            <p className="text-[10px] text-[#8e8e93] font-black uppercase tracking-[0.2em] mt-0.5">專業級敘事引擎</p>
          </div>
          <button 
            onClick={() => setState(p => ({...p, appMode: p.appMode === AppMode.REPOSITORY ? AppMode.CAPTURE : AppMode.REPOSITORY}))} 
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all overflow-visible group"
          >
             <div className="relative w-7 h-7 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <i className={`fa-solid fa-file absolute -top-[1.5px] -left-[1.5px] transition-all duration-500 ${state.appMode === AppMode.REPOSITORY ? 'text-white text-[13.5px] opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]' : 'text-white/20 text-[11px]'}`}></i>
                <div className={`absolute -bottom-[2px] -right-[2px] rounded-full border-[2.2px] flex items-center justify-center transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${state.appMode === AppMode.CAPTURE ? 'w-[16px] h-[16px] border-[#D4FF5F] bg-[#D4FF5F]/10 scale-110 shadow-[0_0_15px_rgba(212,255,95,0.4)]' : 'w-[13px] h-[13px] border-white/30'}`}>
                   <div className={`rounded-full transition-all duration-500 ${state.appMode === AppMode.CAPTURE ? 'w-[5px] h-[5px] bg-[#D4FF5F] shadow-[0_0_8px_#D4FF5F] animate-pulse' : 'w-[4px] h-[4px] bg-white/30'}`}></div>
                </div>
             </div>
          </button>
        </header>
      )}

      <main 
        style={{
          transform: `scale(${1 - swipeProgress * 0.04})`,
          filter: `blur(${swipeProgress * 4}px)`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className={`flex-1 overflow-y-auto no-scrollbar ${(state.activeTab === AppTab.WRITE && currentChapter) ? 'p-0' : (state.activeTab === AppTab.WRITE ? 'p-0' : 'pt-24 pb-32')}`}
      >
        {state.activeTab === AppTab.LIBRARY ? (
          state.appMode === AppMode.REPOSITORY ? (
            <Library 
              projects={state.projects} 
              onSelectProject={(p) => setState(prev => ({...prev, currentProject: p, activeTab: AppTab.PROJECT_DETAIL}))}
              onCreateProject={(proj) => setState(prev => ({...prev, projects: [proj, ...prev.projects]}))}
              onUpdateProjects={(p) => setState(prev => ({...prev, projects: p}))}
            />
          ) : (
            <CaptureCenter projects={state.projects} onSaveToProject={(pid, content) => {}} />
          )
        ) : state.activeTab === AppTab.PROJECT_DETAIL ? (
          <ProjectDetail 
            project={state.currentProject!} 
            onBack={() => setState(prev => ({ ...prev, activeTab: AppTab.LIBRARY }))}
            onOpenModule={() => {}}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
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
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-black">
               <div className="w-28 h-28 bg-[#1C1C1E] rounded-[36px] flex items-center justify-center border border-white/5 shadow-2xl mb-12">
                  <i className="fa-solid fa-feather-pointed text-[#3b82f6] text-4xl"></i>
               </div>
               <h2 className="text-2xl font-black text-white tracking-tight mb-4">尚未選擇作品</h2>
               <p className="text-[#8E8E93] text-[13px] leading-[1.6] max-w-[240px] font-medium mx-auto">
                  請先從書架選擇一個現有作品，或在書架中建立新專案以開始寫作。
               </p>
               <button onClick={() => setState(prev => ({ ...prev, activeTab: AppTab.LIBRARY }))} className="mt-14 w-full max-w-[180px] py-4 bg-[#2563eb] rounded-[24px] text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(37,99,235,0.25)]">
                 返回書架
               </button>
            </div>
          )
        ) : state.activeTab === AppTab.PROFILE ? (
          <Profile 
            state={state} 
            onUpgrade={() => setActiveOverlay('EXPORT')} 
            onLanguageChange={(l) => setState(prev => ({...prev, language: l}))} 
            onUpdateAIPreferences={handleUpdateAIPreferences}
            onUpdateSecuritySettings={handleUpdateSecuritySettings}
          />
        ) : null}
      </main>

      <BottomNav activeTab={state.activeTab} onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))} isVisible={isBottomNavVisible} />

      <div 
        className="fixed inset-0 z-[1000] pointer-events-none"
        style={{
          display: swipeProgress > 0 ? 'block' : 'none'
        }}
      >
        <div 
          className="absolute inset-0 bg-black/40 pointer-events-auto backdrop-blur-sm"
          style={{ opacity: swipeProgress }}
          onClick={() => setActiveOverlay('NONE')}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 pointer-events-auto shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
          style={{
            width: isTabletOrDesktop ? '33.333333%' : '85%',
            transform: `translateX(${(1 - swipeProgress) * 100}%)`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {currentChapter && (
            <Timeline 
              history={currentChapter.history || []}
              onClose={() => setActiveOverlay('NONE')}
              onRestore={handleRestoreSnapshot}
              onPreview={(s) => alert('Previewing snapshot from ' + new Date(s.timestamp).toLocaleTimeString())}
              onCreateMilestone={handleCreateMilestone}
              onClearSnapshots={handleClearAutoSnapshots}
              membership={state.membership}
              isNight={true}
              securitySettings={state.securitySettings}
              onUpdateSecuritySettings={handleUpdateSecuritySettings}
            />
          )}
        </div>
      </div>

      {activeOverlay === 'COLLABORATION' && (
        <CollaborationPanel onClose={() => setActiveOverlay('NONE')} />
      )}
    </div>
  );
};

export default App;
