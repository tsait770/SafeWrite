
import React, { useState, useEffect, useRef } from 'react';
/* 修正：移除不存在於 types.ts 的 EditorMode 匯入 */
import { Chapter, UIMode } from '../types';
import { PLACEHOLDER_TEXT } from '../constants';

interface EditorProps {
  chapter: Chapter;
  onUpdateContent: (content: string) => void;
  uiMode: UIMode;
  onModeToggle: (mode: UIMode) => void;
  onOpenTimeline: () => void;
  isRestored?: boolean;
}

const Editor: React.FC<EditorProps> = ({ 
  chapter, 
  onUpdateContent, 
  uiMode, 
  onModeToggle, 
  onOpenTimeline,
  isRestored = false
}) => {
  const [content, setContent] = useState(chapter.content);
  const [readMode, setReadMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 同步內容
  useEffect(() => {
    setContent(chapter.content);
  }, [chapter.content]);

  // 回溯成功提示
  useEffect(() => {
    if (isRestored) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRestored]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    // 靜默自動儲存（背景觸發）
    onUpdateContent(newContent);
  };

  const isFocus = uiMode === UIMode.FOCUS;

  return (
    <div className={`flex flex-col h-full bg-black text-white overflow-hidden transition-all duration-500`}>
      {/* Header - 依據截圖設計 */}
      <header className={`shrink-0 h-20 flex items-center justify-between px-6 bg-[#0F0F10] border-b border-white/5 z-50 transition-transform duration-500 ${isFocus ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#7b61ff] flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(123,97,255,0.3)]">
            SW
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-[0.2em]">SAFEWRITE</p>
            <h2 className="text-sm font-bold text-white tracking-tight">{chapter.title}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* 閱讀模式切換 */}
          <button 
            onClick={() => setReadMode(!readMode)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${readMode ? 'text-[#7b61ff] bg-[#7b61ff]/10' : 'text-[#8E8E93] hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-eye text-lg"></i>
          </button>
          
          {/* FOCUS / MANAGE 切換按鈕 */}
          <button 
            onClick={() => onModeToggle(isFocus ? UIMode.MANAGEMENT : UIMode.FOCUS)}
            className={`h-10 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border transition-all ${isFocus ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-[0_0_20px_rgba(123,97,255,0.4)]' : 'bg-white/5 border-white/10 text-white'}`}
          >
            {isFocus ? 'FOCUS' : 'MANAGE'}
          </button>

          {/* 時光機按鈕 */}
          <button 
            onClick={onOpenTimeline}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#8E8E93] hover:bg-white/5 transition-all"
          >
            <i className="fa-regular fa-clock text-xl"></i>
          </button>
        </div>
      </header>

      {/* 主編輯區 */}
      <main className={`flex-1 relative overflow-y-auto no-scrollbar pt-12 pb-20 transition-all duration-700 ${readMode ? 'bg-[#0A0A0B]' : 'bg-black'}`}>
        {/* SUCCESS TOAST */}
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top duration-500">
            <div className="bg-[#7b61ff] text-white px-8 py-4 rounded-[20px] shadow-[0_15px_40px_rgba(123,97,255,0.4)] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">SUCCESS: VERSION</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">RESTORED</span>
            </div>
          </div>
        )}

        <div className={`max-w-screen-md mx-auto px-10 transition-all duration-700`}>
          <h1 className={`text-4xl font-black mb-16 tracking-tight text-white transition-all duration-700 ${readMode ? 'opacity-30 scale-95' : 'opacity-100'}`}>
            {chapter.title}
          </h1>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              placeholder={PLACEHOLDER_TEXT}
              className={`w-full bg-transparent border-none focus:ring-0 outline-none resize-none overflow-hidden transition-all duration-700 font-serif-editor ${readMode ? 'text-[#9CA3AF] text-xl leading-[2.6]' : 'text-gray-200 text-xl leading-[2.4]'}`}
              style={{ minHeight: '60vh', height: 'auto' }}
            />
          </div>
        </div>

        {/* 浮動控制鈕 */}
        <div className="fixed bottom-32 right-10 flex flex-col space-y-4">
           <div className="w-16 h-16 rounded-[28px] bg-[#7b61ff] shadow-[0_15px_30px_rgba(123,97,255,0.4)] flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer">
              <div className="w-1.5 h-3 bg-white rounded-full"></div>
           </div>
        </div>
      </main>

      {/* FOCUS 模式裝飾條 */}
      {isFocus && (
        <div className="fixed top-28 left-10 right-10 h-px bg-[#7b61ff]/20 z-40"></div>
      )}
    </div>
  );
};

export default Editor;
