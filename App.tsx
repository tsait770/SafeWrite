import React, { useState } from 'react';
import { MembershipLevel, UIMode, AppState, Project, AppMode, AppTab, ThemeMode } from './types';
import Library from './components/Library';
import CaptureCenter from './components/CaptureCenter';
import Profile from './components/Profile';
import Editor from './components/Editor';
import Timeline from './components/Timeline';
import FocusMode from './components/FocusMode';
import StructureGraph from './components/StructureGraph';
import BottomNav from './components/BottomNav';
import ProfessionalPublicationCenter from './components/ProfessionalPublicationCenter';

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

  const [activeOverlay, setActiveOverlay] = useState<'NONE' | 'EDITOR' | 'TIMELINE' | 'FOCUS' | 'GRAPH' | 'EXPORT'>('NONE');

  const toggleAppMode = () => {
    setState(prev => ({
      ...prev,
      appMode: prev.appMode === AppMode.REPOSITORY ? AppMode.CAPTURE : AppMode.REPOSITORY,
      activeTab: AppTab.LIBRARY
    }));
  };

  const handleSelectProject = (proj: Project) => {
    setState(prev => ({ ...prev, currentProject: proj }));
    // 預設選擇第一個章節
    if (proj.chapters && proj.chapters.length > 0) {
      setState(prev => ({ ...prev, currentChapterId: proj.chapters[0].id }));
    } else {
      // 模擬一個章節
      const mockChapter = { id: 'c1', title: '第一章：覺醒', content: '', order: 1, history: [] };
      setState(prev => ({ 
        ...prev, 
        currentProject: { ...proj, chapters: [mockChapter] },
        currentChapterId: 'c1'
      }));
    }
    setActiveOverlay('EDITOR');
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black text-white">
      {/* Top Bar */}
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
            <svg className={`w-6 h-6 transition-all ${state.appMode === AppMode.CAPTURE ? 'text-blue-500' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"/></svg>
          </div>
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-24 pb-32">
        {state.activeTab === AppTab.LIBRARY ? (
          state.appMode === AppMode.REPOSITORY ? (
            <div className="space-y-10">
               {/* Welcome Dash */}
               <section className="px-8 mt-10">
                  <h2 className="text-4xl font-black tracking-tighter mb-8">Welcome, Writer.</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-[#1C1C1E] rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center space-x-3 text-blue-500 mb-2">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                           <span className="text-[10px] font-black uppercase tracking-widest">Word Count</span>
                        </div>
                        <p className="text-2xl font-black">45,210 <span className="text-blue-500 text-sm">↗</span></p>
                     </div>
                     <div className="p-6 bg-[#1C1C1E] rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center space-x-3 text-orange-500 mb-2">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-4.418 0-8 3.582-8 8s8 12 8 12 8-7.582 8-12-3.582-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>
                           <span className="text-[10px] font-black uppercase tracking-widest">Days Streak</span>
                        </div>
                        <p className="text-2xl font-black">14 🔥</p>
                     </div>
                  </div>
               </section>
               <Library onSelectProject={handleSelectProject} />
            </div>
          ) : (
            <CaptureCenter />
          )
        ) : state.activeTab === AppTab.PROFILE ? (
          <Profile 
            state={state} 
            onUpgrade={() => setActiveOverlay('EXPORT')} 
            onLanguageChange={(lang) => setState(prev => ({ ...prev, language: lang }))}
          />
        ) : (
          <div className="pt-40 text-center text-gray-500 uppercase tracking-widest font-black">Loading...</div>
        )}
      </main>

      {/* Nav */}
      <BottomNav 
        activeTab={state.activeTab} 
        onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
        isVisible={activeOverlay === 'NONE'}
      />

      {/* Overlays */}
      {activeOverlay === 'EDITOR' && state.currentProject && (
        <Editor 
          chapter={state.currentProject.chapters[0] || { id: 'c1', title: 'New Chapter', content: '', order: 1, history: [] }} 
          onClose={() => setActiveOverlay('NONE')} 
          onOpenTimeline={() => setActiveOverlay('TIMELINE')}
          onOpenFocus={() => setActiveOverlay('FOCUS')}
          onOpenExport={() => setActiveOverlay('EXPORT')}
        />
      )}
      {activeOverlay === 'TIMELINE' && (
        <Timeline history={[]} onClose={() => setActiveOverlay('EDITOR')} />
      )}
      {activeOverlay === 'FOCUS' && (
        <FocusMode onClose={() => setActiveOverlay('EDITOR')} />
      )}
      {activeOverlay === 'GRAPH' && (
        <StructureGraph onClose={() => setActiveOverlay('NONE')} />
      )}
      {activeOverlay === 'EXPORT' && (
        <ProfessionalPublicationCenter onClose={() => setActiveOverlay('NONE')} />
      )}

      {/* Sidebar Trigger (For Graph) */}
      {state.activeTab === AppTab.WRITE && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2">
           <button onClick={() => setActiveOverlay('GRAPH')} className="px-10 py-5 bg-[#5d5dff] border border-white/20 rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(93,93,255,0.4)] hover:bg-[#6e6eff] transition-all">
              Structure Graph Quick Access
           </button>
        </div>
      )}
    </div>
  );
};

export default App;