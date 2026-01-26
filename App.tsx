import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MembershipLevel, UIMode, AppState, Project, AppMode, AppTab, ThemeMode, VersionSnapshot, SnapshotType, Chapter } from './types';
import Library from './components/Library';
import CaptureCenter from './components/CaptureCenter';
import Profile from './components/Profile';
import Editor from './components/Editor';
import Timeline from './components/Timeline';
import BottomNav from './components/BottomNav';
import ProfessionalPublicationCenter from './components/ProfessionalPublicationCenter';
import StructureGraph from './components/StructureGraph';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentProject: null,
    currentChapterId: null,
    uiMode: UIMode.MANAGEMENT,
    appMode: AppMode.REPOSITORY,
    activeTab: AppTab.LIBRARY,
    theme: ThemeMode.NIGHT,
    membership: MembershipLevel.FREE,
    language: 'zh-TW',
    stats: { wordCount: 45210, projectCount: 4, exportCount: 0, lastActive: Date.now(), hasTrialed: false }
  });

  const [activeOverlay, setActiveOverlay] = useState<'NONE' | 'TIMELINE' | 'GRAPH' | 'EXPORT'>('NONE');
  const [isRestored, setIsRestored] = useState(false);
  const autoSnapshotTimer = useRef<number | null>(null);

  const createSnapshot = useCallback((type: SnapshotType = SnapshotType.AUTO) => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const project = { ...prev.currentProject };
      const chapterIndex = project.chapters.findIndex(c => c.id === prev.currentChapterId);
      if (chapterIndex === -1) return prev;

      const chapter = project.chapters[chapterIndex];
      const newSnapshot: VersionSnapshot = {
        id: 'snap-' + Date.now(),
        timestamp: Date.now(),
        content: chapter.content,
        title: chapter.title,
        type: type
      };

      const updatedChapter = { 
        ...chapter, 
        history: [newSnapshot, ...chapter.history].slice(0, 100) 
      };

      const updatedChapters = [...project.chapters];
      updatedChapters[chapterIndex] = updatedChapter;

      return {
        ...prev,
        currentProject: { ...project, chapters: updatedChapters, updatedAt: Date.now() }
      };
    });
  }, []);

  useEffect(() => {
    if (state.activeTab === AppTab.WRITE && state.currentChapterId) {
      autoSnapshotTimer.current = window.setInterval(() => {
        createSnapshot(SnapshotType.AUTO);
      }, 120000); 
    }
    return () => {
      if (autoSnapshotTimer.current) clearInterval(autoSnapshotTimer.current);
    };
  }, [state.activeTab, state.currentChapterId, createSnapshot]);

  const toggleAppMode = () => {
    setState(prev => ({
      ...prev,
      appMode: prev.appMode === AppMode.REPOSITORY ? AppMode.CAPTURE : AppMode.REPOSITORY,
      activeTab: AppTab.LIBRARY
    }));
  };

  const handleSelectProject = (proj: Project) => {
    // 確保專案具備基本的 chapters 結構
    const chapters = proj.chapters || [{ id: 'c1', title: '第一章', content: '', order: 1, history: [] }];
    setState(prev => ({ 
      ...prev, 
      currentProject: { ...proj, chapters },
      currentChapterId: chapters[0]?.id || 'c1',
      activeTab: AppTab.WRITE 
    }));
  };

  const handleUpdateContent = (newContent: string) => {
    setState(prev => {
      if (!prev.currentProject || !prev.currentChapterId) return prev;
      const project = { ...prev.currentProject };
      const chapters = project.chapters.map(c => 
        c.id === prev.currentChapterId ? { ...c, content: newContent } : c
      );
      return { 
        ...prev, 
        currentProject: { ...project, chapters, updatedAt: Date.now() }
      };
    });
  };

  const handleRestore = (snapshot: VersionSnapshot) => {
    setIsRestored(true);
    handleUpdateContent(snapshot.content);
    setActiveOverlay('NONE');
  };

  const currentChapter = state.currentProject?.chapters.find(c => c.id === state.currentChapterId);
  const isFocus = state.uiMode === UIMode.FOCUS;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Top Bar - 寫作模式或 FOCUS 模式隱藏 */}
      {state.activeTab !== AppTab.WRITE && (
        <header className="fixed top-0 w-full z-[100] h-24 flex items-end justify-between px-8 pb-4 bg-black/60 backdrop-blur-3xl border-b border-white/5">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter">
              {state.appMode === AppMode.REPOSITORY ? 'SafeWrite' : 'SafeWrite Pro'}
            </h1>
            <p className="text-[10px] text-[#8e8e93] font-black uppercase tracking-[0.2em] mt-0.5">
              {state.appMode === AppMode.REPOSITORY ? 'FILES & REPOSITORIES' : 'CAPTURE CENTER'}
            </p>
          </div>
          <button onClick={toggleAppMode} className="dual-mode-toggle group">
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <i className={`fa-solid fa-circle-nodes text-2xl transition-all ${state.appMode === AppMode.CAPTURE ? 'text-blue-500' : 'text-white'}`}></i>
            </div>
          </button>
        </header>
      )}

      {/* 主要內容區域 */}
      <main className={`flex-1 overflow-y-auto no-scrollbar ${state.activeTab === AppTab.WRITE ? 'p-0' : 'pt-24 pb-32'}`}>
        {state.activeTab === AppTab.LIBRARY ? (
          state.appMode === AppMode.REPOSITORY ? (
            <Library onSelectProject={handleSelectProject} />
          ) : (
            <CaptureCenter />
          )
        ) : state.activeTab === AppTab.WRITE ? (
          currentChapter ? (
            <Editor 
              chapter={currentChapter}
              onUpdateContent={handleUpdateContent}
              uiMode={state.uiMode}
              onModeToggle={(mode) => setState(prev => ({ ...prev, uiMode: mode }))}
              onOpenTimeline={() => setActiveOverlay('TIMELINE')}
              isRestored={isRestored}
            />
          ) : (
            /* 修正：當無專案時顯示引導，而非黑屏 */
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-700">
               <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-blue-500">
                  <i className="fa-solid fa-feather-pointed text-4xl"></i>
               </div>
               <div>
                 <h2 className="text-2xl font-black tracking-tight mb-2">尚未選擇作品</h2>
                 <p className="text-sm text-[#8E8E93] font-medium max-w-xs mx-auto">請先從書架選擇一個現有作品，或在書架中建立新專案以開始寫作。</p>
               </div>
               <button 
                 onClick={() => setState(prev => ({ ...prev, activeTab: AppTab.LIBRARY }))}
                 className="px-10 py-4 bg-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
               >
                 返回書架
               </button>
            </div>
          )
        ) : state.activeTab === AppTab.PROFILE ? (
          <Profile 
            state={state} 
            onUpgrade={() => setActiveOverlay('EXPORT')} 
            onLanguageChange={(lang) => setState(prev => ({ ...prev, language: lang }))}
          />
        ) : null}
      </main>

      {/* 底部導覽 */}
      <BottomNav 
        activeTab={state.activeTab} 
        onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
        isVisible={!isFocus && activeOverlay === 'NONE'}
      />

      {/* 重疊圖層 */}
      {activeOverlay === 'TIMELINE' && currentChapter && (
        <Timeline 
          history={currentChapter.history} 
          onClose={() => setActiveOverlay('NONE')} 
          onRestore={handleRestore}
          onPreview={() => {}} 
          onCreateMilestone={() => createSnapshot(SnapshotType.MILESTONE)}
          onClearAuto={() => {}}
        />
      )}
      {activeOverlay === 'GRAPH' && (
        <StructureGraph onClose={() => setActiveOverlay('NONE')} />
      )}
      {activeOverlay === 'EXPORT' && (
        <ProfessionalPublicationCenter onClose={() => setActiveOverlay('NONE')} />
      )}
    </div>
  );
};

export default App;