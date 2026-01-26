
import React, { useState, useRef } from 'react';
import { ModuleItem, Project, UIMode } from '../types';
import { useEditor } from '../contexts/EditorContext';

interface EditorProps {
  module: ModuleItem;
  project: Project;
  uiMode: UIMode;
  onModeToggle: (mode: UIMode) => void;
  onBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ module, project, uiMode, onModeToggle, onBack }) => {
  const { content, setContent, saveStatus } = useEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mentionMenu, setMentionMenu] = useState<{ x: number; y: number } | null>(null);
  const isFocus = uiMode === UIMode.FOCUS;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '@') {
      const rect = textareaRef.current?.getBoundingClientRect();
      if (rect) setMentionMenu({ x: rect.left, y: 150 });
    } else if (e.key === 'Escape') {
      setMentionMenu(null);
    }
  };

  const insertMention = (title: string) => {
    setContent(content + `【${title}】`);
    setMentionMenu(null);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      {/*沈浸式動畫遮罩*/}
      <div className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-1000 ${isFocus ? 'bg-black/40' : 'opacity-0'}`}></div>

      <header className={`shrink-0 h-24 flex items-end justify-between px-10 pb-5 z-[200] transition-all duration-700 ${isFocus ? '-translate-y-full opacity-0' : ''}`}>
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white">
             <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
               <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'SAVING' ? 'bg-[#7b61ff] animate-pulse' : 'bg-[#7b61ff]'}`}></span>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#7b61ff]">
                  {saveStatus === 'SAVING' ? 'SYNCING MODULE...' : 'ENCRYPTED LOCAL CACHE'}
               </p>
            </div>
            <h2 className="text-lg font-black tracking-tight">{module.title}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           <button onClick={() => onModeToggle(isFocus ? UIMode.MANAGEMENT : UIMode.FOCUS)} className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
             {isFocus ? 'EXIT FOCUS' : 'FOCUS'}
           </button>
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto no-scrollbar z-10 transition-all duration-1000 ${isFocus ? 'pt-40 px-16 scale-105' : 'pt-16 px-10'}`}>
        <div className="max-w-screen-md mx-auto relative">
           <textarea
             ref={textareaRef}
             value={content}
             onKeyDown={handleKeyDown}
             onChange={(e) => setContent(e.target.value)}
             placeholder="開始寫作，輸入 @ 呼叫聯動模組..."
             className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none font-serif-editor text-xl leading-[2.6] text-gray-200"
             style={{ minHeight: '75vh' }}
           />

           {mentionMenu && (
             <div className="fixed z-[500] bg-[#1c1c1e] border border-white/10 rounded-3xl shadow-2xl p-4 w-64 animate-in fade-in zoom-in duration-300" style={{ left: mentionMenu.x, top: mentionMenu.y }}>
                <div className="flex items-center justify-between mb-4 px-2">
                   <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">引用聯動模組</span>
                   <i className="fa-solid fa-wand-magic-sparkles text-[#7b61ff] text-xs"></i>
                </div>
                <div className="space-y-1">
                   {project.modules.filter(m => m.id !== module.id).map(m => (
                     <button key={m.id} onClick={() => insertMention(m.title)} className="w-full text-left p-3 rounded-xl hover:bg-[#7b61ff]/20 hover:text-[#7b61ff] text-sm font-bold transition-all flex items-center space-x-3">
                        <span className="opacity-40 text-[9px] uppercase font-black">{m.type.slice(0,3)}</span>
                        <span>{m.title}</span>
                     </button>
                   ))}
                </div>
             </div>
           )}
        </div>
      </main>

      <footer className={`fixed bottom-0 w-full h-24 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-between px-10 z-[200] transition-transform duration-700 ${isFocus ? 'translate-y-full' : ''}`}>
         <div className="flex items-center space-x-10 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <div className="flex items-center space-x-3">
               <i className="fa-solid fa-feather-pointed text-[#7b61ff]"></i>
               <span>{content.length} 文字</span>
            </div>
            <span>約 {Math.max(1, Math.ceil(content.length / 400))} 分鐘讀時</span>
         </div>
      </footer>
    </div>
  );
};

export default Editor;
