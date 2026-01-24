import React, { useState } from 'react';
import { Chapter, MembershipLevel, UIMode } from '../types';

interface EditorProps {
  chapter: Chapter;
  onClose: () => void;
  onOpenTimeline: () => void;
  onOpenFocus: () => void;
  onOpenExport: () => void; // 新增回調
}

const Editor: React.FC<EditorProps> = ({ chapter, onClose, onOpenTimeline, onOpenFocus, onOpenExport }) => {
  const [content, setContent] = useState(chapter.content);

  return (
    <div className="fixed inset-0 z-[600] bg-[#0A0A0B] flex flex-col animate-in fade-in duration-500">
      {/* Top Header */}
      <header className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-[#0F0F10]">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">SAFEWRITE PRO</p>
            <h2 className="text-sm font-bold text-white tracking-tight">{chapter.title}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm3 8H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z"/></svg>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">ENCRYPTED</span>
          </div>
          <button onClick={onOpenTimeline} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>
        </div>
      </header>

      {/* Mode Indicator */}
      <div className="flex justify-center py-4 bg-[#111112]">
        <button onClick={onOpenFocus} className="px-8 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] hover:text-white hover:bg-white/10 transition-all">
          PROFESSIONAL MODE
        </button>
      </div>

      {/* Writing Surface */}
      <main className="flex-1 overflow-y-auto px-8 md:px-32 py-16 no-scrollbar">
        <h1 className="text-4xl font-black mb-12 tracking-tight text-white font-serif-editor"># {chapter.title}</h1>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent border-none focus:ring-0 text-xl leading-[2.4] text-gray-300 font-serif-editor resize-none"
          placeholder="在此開始撰寫您的傳奇..."
        />
      </main>

      {/* Formatting Toolbar & Publish */}
      <footer className="h-24 bg-[#0F0F10] border-t border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="w-12 h-12 flex items-center justify-center text-gray-400 font-black hover:bg-white/5 rounded-xl transition-colors">H1</button>
          <button className="w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-400 font-black rounded-xl border border-blue-500/20">B</button>
          <button className="w-12 h-12 flex items-center justify-center text-gray-400 italic font-serif-editor hover:bg-white/5 rounded-xl transition-colors">I</button>
          <div className="w-px h-8 bg-white/5 mx-3" />
          <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:bg-white/5 rounded-xl transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/></svg>
          </button>
        </div>

        <button 
          onClick={onOpenExport}
          className="px-10 h-14 bg-blue-600 rounded-[20px] text-white font-black text-xs uppercase tracking-[0.3em] flex items-center space-x-4 shadow-2xl shadow-blue-900/30 active:scale-95 transition-all hover:bg-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
          <span>PUBLISH</span>
        </button>
      </footer>
    </div>
  );
};

export default Editor;