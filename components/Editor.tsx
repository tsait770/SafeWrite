
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chapter, UIMode, OutlineNode, MembershipLevel } from '../types';
import { PLACEHOLDER_TEXT } from '../constants';
import { marked } from 'marked';
import AIPanel from './AIPanel';

interface EditorProps {
  chapter: Chapter;
  onUpdateContent: (content: string) => void;
  uiMode: UIMode;
  onModeToggle: (mode: UIMode) => void;
  onOpenTimeline: () => void;
  onOpenCollaboration: () => void;
  isRestored?: boolean;
  onBack?: () => void;
  onUpdateOutline: (nodes: OutlineNode[]) => void;
  membership?: MembershipLevel;
}

const Editor: React.FC<EditorProps> = ({ 
  chapter, 
  onUpdateContent, 
  uiMode, 
  onModeToggle, 
  onOpenTimeline,
  onOpenCollaboration,
  isRestored = false,
  onBack,
  onUpdateOutline,
  membership = MembershipLevel.FREE
}) => {
  const [content, setContent] = useState(chapter.content);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // UI 獨立控制
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const touchStartRef = useRef<number | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(chapter.content);
  }, [chapter.content]);

  // 監控捲動進度
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    };
    const ref = containerRef.current;
    ref?.addEventListener('scroll', handleScroll);
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, [isPreviewMode]);

  const renderedHTML = useMemo(() => {
    if (!isPreviewMode) return '';
    return marked.parse(content || '');
  }, [content, isPreviewMode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdateContent(newContent);
    
    // 寫作狀態偵測：開始輸入時隱藏所有 UI
    setIsTyping(true);
    setIsHeaderVisible(false);
    setIsToolbarVisible(false);

    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const isFocus = uiMode === UIMode.FOCUS || isPreviewMode;

  // 切換預覽模式 (眼睛模式)：進入即全沉浸
  const togglePreviewMode = () => {
    const next = !isPreviewMode;
    setIsPreviewMode(next);
    if (next) {
      setIsHeaderVisible(false);
      setIsToolbarVisible(false);
    } else {
      setIsHeaderVisible(true);
      setIsToolbarVisible(true);
    }
  };

  // 切換專注模式：進入即全沉浸
  const toggleFocusMode = () => {
    const nextMode = uiMode === UIMode.FOCUS ? UIMode.MANAGEMENT : UIMode.FOCUS;
    onModeToggle(nextMode);
    if (nextMode === UIMode.FOCUS) {
      setIsHeaderVisible(false);
      setIsToolbarVisible(false);
    } else {
      setIsHeaderVisible(true);
      setIsToolbarVisible(true);
    }
  };

  // 手勢偵測邏輯
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const deltaY = touchEnd - touchStartRef.current;
    const threshold = 40; 

    if (deltaY > threshold) {
      // 下滑：呼叫頂部導覽，隱藏底部
      setIsHeaderVisible(true);
      setIsToolbarVisible(false);
    } else if (deltaY < -threshold) {
      // 上滑：呼叫底部工具，隱藏頂部
      setIsToolbarVisible(true);
      setIsHeaderVisible(false);
    }
    
    touchStartRef.current = null;
  };

  const handleContentClick = () => {
    // 點擊內容區塊作為「總控開關」
    if (isFocus) {
      const targetState = !isHeaderVisible;
      setIsHeaderVisible(targetState);
      setIsToolbarVisible(targetState);
    }
  };

  const toolbarActions = [
    { icon: 'fa-rotate-left', action: () => document.execCommand('undo') },
    { icon: 'fa-rotate-right', action: () => document.execCommand('redo') },
    { separator: true },
    { icon: 'fa-bold', action: () => {} },
    { icon: 'fa-italic', action: () => {} },
    { icon: 'fa-heading', action: () => {} },
  ];

  return (
    <div 
      className="flex flex-col h-full bg-black text-white overflow-hidden relative select-none sm:select-text"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* 頂部進度條 (常駐於眼睛閱讀模式，但與 Header 視覺分離) */}
      {isPreviewMode && (
        <div className="fixed top-0 left-0 w-full h-[env(safe-area-inset-top,2px)] bg-white/5 z-[150] pointer-events-none">
          <div 
            className="h-full bg-[#7b61ff] transition-all duration-300 shadow-[0_0_15px_rgba(123,97,255,1)]" 
            style={{ width: `${scrollProgress}%` }} 
          />
        </div>
      )}

      {/* 頂部導覽 (由下滑呼叫) */}
      <header 
        className={`fixed top-0 left-0 right-0 pt-[env(safe-area-inset-top,0px)] bg-[#0F0F10]/95 backdrop-blur-3xl border-b border-white/5 z-[100] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
          ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-white/10">
               <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex flex-col">
              <p className="text-[8px] font-black text-[#8E8E93] uppercase tracking-[0.2em]">SAFEWRITE</p>
              <h2 className="text-xs font-bold text-white tracking-tight truncate max-w-[120px]">{chapter.title}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={togglePreviewMode}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPreviewMode ? 'text-[#7b61ff] bg-[#7b61ff]/10' : 'text-[#8E8E93]'}`}
            >
              <i className="fa-solid fa-eye text-base"></i>
            </button>
            <button 
              onClick={toggleFocusMode}
              className={`h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${uiMode === UIMode.FOCUS ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-lg shadow-purple-900/40' : 'bg-white/5 border-white/10 text-white'}`}
            >
              {uiMode === UIMode.FOCUS ? 'FOCUS' : 'MANAGE'}
            </button>
            <button onClick={onOpenTimeline} className="w-10 h-10 rounded-full flex items-center justify-center text-[#8E8E93]">
              <i className="fa-regular fa-clock text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      <main 
        ref={containerRef}
        onClick={handleContentClick}
        className={`flex-1 relative overflow-y-auto no-scrollbar transition-all duration-1000 ${isPreviewMode ? 'bg-black pt-20' : 'bg-[#050505] pt-28'} pb-48`}
      >
        <div className={`max-w-screen-md mx-auto px-6 sm:px-10 transition-all duration-1000 ${isFocus ? 'scale-[1.01]' : ''}`}>
          {!isPreviewMode && (
            <input
              type="text"
              value={chapter.title}
              onChange={(e) => onUpdateContent(e.target.value)} 
              className={`w-full bg-transparent text-3xl sm:text-5xl font-black mb-12 outline-none border-none focus:ring-0 transition-all duration-1000 tracking-tighter ${isFocus ? 'text-center text-white placeholder-white/5' : 'text-white'}`}
              placeholder="標題..."
            />
          )}
          
          <div className="relative">
            {isPreviewMode ? (
              <div 
                className="prose-preview w-full font-serif-editor animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 text-[1.1rem] sm:text-[1.3rem] leading-[2.2] sm:leading-[2.6] text-slate-300"
                dangerouslySetInnerHTML={{ __html: renderedHTML }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleChange}
                onFocus={() => {
                   setIsHeaderVisible(false);
                   setIsToolbarVisible(false);
                }}
                placeholder={PLACEHOLDER_TEXT}
                className={`w-full bg-transparent border-none focus:ring-0 outline-none resize-none overflow-hidden transition-all duration-1000 font-serif-editor 
                  ${isFocus ? 'px-2 text-center text-slate-200 caret-[#7b61ff] selection:bg-[#7b61ff]/30 text-lg sm:text-xl leading-[2.3] sm:leading-[2.5]' : 'text-gray-200 text-lg sm:text-xl leading-[2.2] sm:leading-[2.4]'}`}
                style={{ minHeight: '80vh' }}
              />
            )}
          </div>
        </div>

        {/* 底部排版工具 (由上滑呼叫) */}
        <div 
          className={`fixed bottom-[calc(2.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 flex items-center bg-[#1A1A1B]/95 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] space-x-1.5 z-[100] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
            ${isToolbarVisible ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0'}`}
        >
           {toolbarActions.map((item, idx) => (
             item.separator ? (
               <div key={idx} className="w-px h-6 bg-white/10 mx-1" />
             ) : (
               <button key={idx} onClick={item.action} className="w-11 h-11 flex items-center justify-center rounded-full text-white/40 active:text-white active:bg-white/10 transition-colors">
                 <i className={`fa-solid ${item.icon} text-base`}></i>
               </button>
             )
           ))}
           <div className="w-px h-6 bg-white/10 mx-1" />
           <button 
             className="h-11 px-5 flex items-center space-x-2 rounded-full bg-[#7b61ff] text-white shadow-lg active:scale-95 transition-all"
             onClick={(e) => { e.stopPropagation(); setIsAIPanelOpen(!isAIPanelOpen); }}
           >
              <i className="fa-solid fa-bolt-lightning text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI助理</span>
           </button>
        </div>
      </main>

      {isAIPanelOpen && (
        <AIPanel 
          content={content} 
          isNight={true} 
          onClose={() => setIsAIPanelOpen(false)} 
          onUpdateOutline={onUpdateOutline} 
        />
      )}
    </div>
  );
};

export default Editor;
