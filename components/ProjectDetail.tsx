
import React, { useState, useRef, useEffect } from 'react';
import { Project, Chapter, WritingModule, StructureType } from '../types';
import { TEMPLATES, STRUCTURE_DEFINITIONS } from '../constants';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onOpenModule: (moduleId: string) => void;
  onUpdateProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onEnterEditor: (chapterId: string) => void;
  onOpenExport?: () => void; 
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onOpenModule, onUpdateProject, onDeleteProject, onEnterEditor, onOpenExport }) => {
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Inline editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(project.name);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const structDef = STRUCTURE_DEFINITIONS[project.structureType] || STRUCTURE_DEFINITIONS[StructureType.FREE];

  const totalWords = project.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const writingDays = Math.max(1, Math.ceil((Date.now() - project.createdAt) / (1000 * 60 * 60 * 24)));

  // Sync edit value when project name changes externally
  useEffect(() => {
    setEditNameValue(project.name);
  }, [project.name]);

  // Handle click outside for the dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAdd = () => {
    if (structDef.autoNumbering) {
      const nextPos = project.chapters.length + 1;
      setNewTitle(structDef.defaultNamingRule(nextPos));
    } else {
      setNewTitle('');
    }
    setIsAddingChapter(true);
  };

  const handleAdd = () => {
    const nextPos = project.chapters.length + 1;
    let finalTitle = newTitle.trim();
    
    if (structDef.autoNumbering && !finalTitle) {
      finalTitle = structDef.defaultNamingRule(nextPos);
    } else if (!structDef.autoNumbering && !finalTitle) {
      finalTitle = project.structureType === StructureType.BLOCK ? '未命名區塊' : '新內容';
    }

    const newUnit: Chapter = {
      id: 'u-' + Date.now(),
      title: finalTitle,
      content: '',
      order: nextPos,
      history: [],
      wordCount: 0,
      lastEdited: Date.now(),
      createdAt: Date.now()
    };
    
    onUpdateProject({ ...project, chapters: [...project.chapters, newUnit], updatedAt: Date.now() });
    setNewTitle('');
    setIsAddingChapter(false);
  };

  const handleDeleteChapter = (id: string) => {
    const remaining = project.chapters.filter(c => c.id !== id);
    const reordered = remaining.map((c, i) => ({ ...c, order: i + 1 }));
    onUpdateProject({ ...project, chapters: reordered, updatedAt: Date.now() });
  };

  const handleTogglePin = () => {
    onUpdateProject({ ...project, isPinned: !project.isPinned, updatedAt: Date.now() });
    setIsMenuOpen(false);
  };

  // Inline Name Editing Logic
  const handleNameSave = () => {
    const trimmed = editNameValue.trim();
    if (trimmed && trimmed !== project.name) {
      onUpdateProject({ ...project, name: trimmed, updatedAt: Date.now() });
    } else {
      setEditNameValue(project.name);
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditNameValue(project.name);
    setIsEditingName(false);
  };

  const handleEditProjectFromMenu = () => {
    setIsEditingName(true);
    setIsMenuOpen(false);
  };

  const handleDeleteProjectConfirm = () => {
    if (window.confirm(`確定要刪除專案「${project.name}」嗎？此動作無法復原。`)) {
      onDeleteProject(project.id);
    }
    setIsMenuOpen(false);
  };

  const onDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    const newChapters = [...project.chapters];
    const item = newChapters.splice(draggedIdx, 1)[0];
    newChapters.splice(idx, 0, item);
    
    const orderedChapters = newChapters.map((c, i) => ({ ...c, order: i + 1 }));
    onUpdateProject({ ...project, chapters: orderedChapters, updatedAt: Date.now() });
    setDraggedIdx(idx);
  };

  const shouldHideList = project.structureType === StructureType.FREE;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-40">
      <header className="px-8 pt-6 pb-10">
         <div className="flex items-center justify-between mb-10">
            <button onClick={onBack} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
               <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            <div className="flex flex-col items-center flex-1 max-w-[70%]">
               <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl mb-3 relative shrink-0" style={{ backgroundColor: project.color, color: '#121212' }}>
                  <i className={`fa-solid ${project.icon}`}></i>
                  {project.isPinned && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4FF5F] rounded-full border-2 border-black flex items-center justify-center text-[10px]">
                      <i className="fa-solid fa-thumbtack"></i>
                    </div>
                  )}
               </div>
               
               {isEditingName ? (
                 <div className="w-full flex justify-center px-4">
                   <input
                      ref={inputRef}
                      autoFocus
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      onBlur={handleNameSave}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave();
                        if (e.key === 'Escape') handleNameCancel();
                      }}
                      className="w-full bg-white/5 border-b-2 border-blue-600 outline-none text-2xl sm:text-3xl font-black text-center text-white pb-1 tracking-tight"
                   />
                 </div>
               ) : (
                 <div 
                   className="flex items-center space-x-3 group cursor-pointer max-w-full px-4"
                   onClick={() => setIsEditingName(true)}
                 >
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tighter truncate text-center">{project.name}</h1>
                    <i className="fa-solid fa-pen text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                 </div>
               )}
               
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">{TEMPLATES[project.writingType]?.label}</p>
            </div>

            <div className="relative shrink-0" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMenuOpen ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'}`}
              >
                 <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-48 bg-[#1C1C1E] border border-white/10 rounded-3xl shadow-3xl z-[100] p-2 animate-in fade-in zoom-in duration-200">
                  <button onClick={handleTogglePin} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/5 text-left transition-colors">
                    <i className={`fa-solid fa-thumbtack ${project.isPinned ? 'text-[#D4FF5F]' : 'text-gray-500'}`}></i>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">{project.isPinned ? '取消置頂' : '置頂專案'}</span>
                  </button>
                  <button onClick={handleEditProjectFromMenu} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/5 text-left transition-colors">
                    <i className="fa-solid fa-pen-to-square text-blue-400"></i>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">編輯名稱</span>
                  </button>
                  <button onClick={() => { setIsMenuOpen(false); onOpenExport?.(); }} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/5 text-left transition-colors">
                    <i className="fa-solid fa-file-export text-blue-500"></i>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">導出專案</span>
                  </button>
                  <div className="h-px bg-white/5 my-1 mx-2" />
                  <button onClick={handleDeleteProjectConfirm} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-500/10 text-left transition-colors">
                    <i className="fa-solid fa-trash-can text-red-500"></i>
                    <span className="text-[11px] font-black uppercase tracking-widest text-red-500">刪除專案</span>
                  </button>
                </div>
              )}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 space-y-1">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">總字數統計</p>
               <div className="flex items-baseline space-x-2">
                 <p className="text-2xl font-black text-white">{totalWords.toLocaleString()}</p>
                 <span className="text-[9px] text-gray-600">/ {project.targetWordCount.toLocaleString()}</span>
               </div>
            </div>
            <div className="bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 space-y-1">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">創作天數</p>
               <p className="text-2xl font-black text-[#D4FF5F]">{writingDays} DAYS</p>
            </div>
            <div className="bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 space-y-1">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">當前進度</p>
               <div className="flex items-center space-x-3">
                  <p className="text-2xl font-black text-[#7b61ff]">{Math.min(100, Math.floor((totalWords / project.targetWordCount) * 100))}%</p>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-[#7b61ff]" style={{ width: `${Math.min(100, (totalWords / project.targetWordCount) * 100)}%` }} />
                  </div>
               </div>
            </div>
            <div className="bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 space-y-1">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">架構模組數</p>
               <p className="text-2xl font-black text-white">{project.modules.length} NODES</p>
            </div>
         </div>
      </header>

      <main className="px-8 space-y-12">
         {!shouldHideList && (
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2 mb-4">
               <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    {project.structureType === StructureType.CHAPTER ? '章節管理' : project.structureType === StructureType.SECTION ? '節點列表' : '內容區塊'}
                  </h2>
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-1">拖拽排序 · 點擊編輯</p>
               </div>
               <button onClick={handleOpenAdd} className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
                  <i className="fa-solid fa-plus"></i>
               </button>
            </div>

            <div className="space-y-4">
               {project.chapters.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px] opacity-30">
                     <i className="fa-solid fa-feather-pointed text-4xl mb-4"></i>
                     <p className="text-[10px] font-black uppercase tracking-widest">目前尚無內容，請點擊新增</p>
                  </div>
               ) : (
                  project.chapters.map((unit, idx) => (
                    <div 
                      key={unit.id} 
                      draggable={structDef.allowManualOrder}
                      onDragStart={() => structDef.allowManualOrder && onDragStart(idx)}
                      onDragOver={(e) => structDef.allowManualOrder && onDragOver(e, idx)}
                      onDragEnd={() => setDraggedIdx(null)}
                      className={`group bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 flex items-center justify-between transition-all hover:bg-[#252528] ${draggedIdx === idx ? 'opacity-40 scale-95' : ''}`}
                    >
                       <div className="flex items-center space-x-6">
                          {structDef.allowManualOrder && (
                            <button className="text-gray-700 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                              <i className="fa-solid fa-grip-lines text-xl opacity-30"></i>
                            </button>
                          )}
                          <div className="flex flex-col">
                             <h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">{unit.title}</h4>
                             <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mt-1">
                               {unit.wordCount} 字
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex items-center space-x-4">
                          <button onClick={(e) => { e.stopPropagation(); onEnterEditor(unit.id); }} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all">
                             <i className="fa-solid fa-pen text-lg"></i>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteChapter(unit.id); }} className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                             <i className="fa-solid fa-trash text-lg"></i>
                          </button>
                          <button 
                            onClick={() => onEnterEditor(unit.id)}
                            className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
                          >
                             <i className="fa-solid fa-play ml-1"></i>
                          </button>
                       </div>
                    </div>
                  ))
               )}
            </div>

            {isAddingChapter && (
               <div className="bg-[#1C1C1E] p-8 rounded-[40px] border border-blue-600/50 animate-in slide-in-from-top-4 shadow-2xl">
                  <label className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-2 block">
                    {structDef.autoNumbering ? '確認標題' : '輸入標題'}
                  </label>
                  <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="在此輸入名稱..." className="w-full bg-transparent text-2xl font-black outline-none text-white mb-6 border-b border-white/10 pb-2 focus:border-blue-600 transition-colors" />
                  <div className="flex justify-end space-x-4">
                     <button onClick={() => setIsAddingChapter(false)} className="text-xs font-black text-gray-500 uppercase tracking-widest">取消</button>
                     <button onClick={handleAdd} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">確認建立</button>
                  </div>
               </div>
            )}
          </section>
         )}

         {shouldHideList && (
           <div className="py-20 flex flex-col items-center">
              <div className="w-32 h-32 bg-[#1C1C1E] rounded-[48px] flex items-center justify-center border border-white/5 shadow-2xl mb-12">
                 <i className="fa-solid fa-note-sticky text-[#D4FF5F] text-5xl"></i>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-4">隨手寫作模式</h2>
              <p className="text-[#8E8E93] text-[14px] leading-relaxed max-w-xs text-center font-medium">
                此範本採用無章節自由書寫模式。您的所有思緒將被保存在單一主文稿中。
              </p>
           </div>
         )}
      </main>
    </div>
  );
};

export default ProjectDetail;
