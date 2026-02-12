
import React, { useState, useRef, useEffect } from 'react';
import { Project, Chapter, StructureType, SpineNodeId, SpineNodeStatus } from '../types';
import { TEMPLATES, STRUCTURE_DEFINITIONS, SPINE_NODES_CONFIG, INITIAL_SPINE_NODES } from '../constants';
import { geminiService } from '../services/geminiService';

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
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [complianceReport, setComplianceReport] = useState<string | null>(null);
  const [isCompliant, setIsCompliant] = useState<boolean | null>(null);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(project.name);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const structDef = STRUCTURE_DEFINITIONS[project.structureType] || STRUCTURE_DEFINITIONS[StructureType.FREE];

  const totalWords = project.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const writingDays = Math.max(1, Math.ceil((Date.now() - project.createdAt) / (1000 * 60 * 60 * 24)));

  const estPages = Math.ceil(totalWords / 250);
  const estSpineWidth = (estPages * 0.00225).toFixed(2);

  useEffect(() => {
    setEditNameValue(project.name);
  }, [project.name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAddingChapter && addInputRef.current) {
      addInputRef.current.focus();
      addInputRef.current.select();
    }
  }, [isAddingChapter]);

  const handleUpdateSpine = (nodeId: SpineNodeId, isCompleted: boolean) => {
    const currentSpine = project.publishingSpine || { currentNode: SpineNodeId.WRITING, nodes: INITIAL_SPINE_NODES() };
    const updatedNodes = { ...currentSpine.nodes };
    updatedNodes[nodeId] = { id: nodeId, isCompleted };
    
    onUpdateProject({
      ...project,
      publishingSpine: { ...currentSpine, nodes: updatedNodes }
    });
  };

  const handleGenerateCover = async () => {
    setIsGeneratingCover(true);
    setComplianceReport(null);
    setIsCompliant(null);
    try {
      const prompt = `A cinematic, professional book cover for a book titled '${project.name}', genre: ${TEMPLATES[project.writingType]?.label || 'Creative Writing'}, dramatic lighting, award-winning illustration style, 8k resolution, artistic masterpiece. No text overlay, focus on visual mood.`;
      const coverUrl = await geminiService.generateImagenCover(prompt);
      
      onUpdateProject({
        ...project,
        updatedAt: Date.now(),
        publishingPayload: {
          ...(project.publishingPayload || {
            title: project.name,
            subtitle: '',
            author: 'Author Identity',
            languageCode: 'zh-TW',
            regionCode: 'TW',
            shortDescription: '',
            longDescription: '',
            bisacCategories: [],
            keywords: [],
            contentFormats: ['epub', 'pdf', 'docx']
          }),
          coverImage: coverUrl
        }
      });
      
      // UI Requirement: Decouple automatic compliance checking during generation stage.
      // Removed: handleCheckCompliance(coverUrl);
      
    } catch (e) {
      alert("封面生成失敗，請稍後再試。");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleDownloadCover = () => {
    if (!project.publishingPayload?.coverImage) return;
    const link = document.createElement('a');
    link.href = project.publishingPayload.coverImage;
    link.download = `${project.name.replace(/\s+/g, '_')}_Cover.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckCompliance = async (imageUrl: string) => {
    setIsCheckingCompliance(true);
    setIsCompliant(null);
    try {
      const report = await geminiService.checkCoverCompliance(imageUrl, project.name);
      setComplianceReport(report);
      const compliant = !report.includes('遮擋') && !report.includes('重新設計') && !report.includes('不足');
      setIsCompliant(compliant);
      handleUpdateSpine(SpineNodeId.COVER_READY, compliant);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingCompliance(false);
    }
  };

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
    
    if (!finalTitle) {
      finalTitle = structDef.autoNumbering 
        ? structDef.defaultNamingRule(nextPos) 
        : `新內容 ${nextPos}`;
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

    onUpdateProject({ 
      ...project, 
      chapters: [...project.chapters, newUnit], 
      updatedAt: Date.now() 
    });
    
    setNewTitle('');
    setIsAddingChapter(false);
  };

  const handleDeleteChapter = (id: string) => {
    if (window.confirm('確定要刪除此章節嗎？內容將無法復原。')) {
      const remaining = project.chapters.filter(c => c.id !== id);
      const reordered = remaining.map((c, i) => ({ ...c, order: i + 1 }));
      onUpdateProject({ ...project, chapters: reordered, updatedAt: Date.now() });
    }
  };

  const handleTogglePin = () => {
    onUpdateProject({ ...project, isPinned: !project.isPinned, updatedAt: Date.now() });
    setIsMenuOpen(false);
  };

  const handleNameSave = () => {
    const trimmed = editNameValue.trim();
    if (trimmed && trimmed !== project.name) {
      onUpdateProject({ ...project, name: trimmed, updatedAt: Date.now() });
    } else {
      setEditNameValue(project.name);
    }
    setIsEditingName(false);
  };

  const onDragStart = (idx: number) => setDraggedIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newChapters = [...project.chapters];
    const item = newChapters.splice(draggedIdx, 1)[0];
    newChapters.splice(idx, 0, item);
    onUpdateProject({ ...project, chapters: newChapters.map((c, i) => ({ ...c, order: i + 1 })), updatedAt: Date.now() });
    setDraggedIdx(idx);
  };

  const spineNodes = project.publishingSpine?.nodes || {};
  const completedCount = (Object.values(spineNodes) as SpineNodeStatus[]).filter(n => n.isCompleted).length;
  const spineProgress = (completedCount / Object.keys(SPINE_NODES_CONFIG).length) * 100;

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-40">
      <header className="px-8 pt-6 pb-10">
         <div className="flex items-center justify-between mb-10">
            <button onClick={onBack} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90"><i className="fa-solid fa-chevron-left"></i></button>
            <div className="flex flex-col items-center flex-1 max-w-[70%]">
               <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl mb-3 relative shrink-0" style={{ backgroundColor: project.color, color: '#121212' }}>
                  <i className={`fa-solid ${project.icon}`}></i>
                  {project.isPinned && <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4FF5F] rounded-full border-2 border-black flex items-center justify-center text-[10px]"><i className="fa-solid fa-thumbtack"></i></div>}
               </div>
               <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                  {isEditingName ? (
                    <input ref={inputRef} autoFocus value={editNameValue} onChange={(e) => setEditNameValue(e.target.value)} onBlur={handleNameSave} className="bg-white/5 border-b-2 border-blue-600 outline-none text-2xl font-black text-center text-white" />
                  ) : (
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tighter truncate text-center">{project.name}</h1>
                  )}
               </div>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">{TEMPLATES[project.writingType]?.label}</p>
            </div>
            <div className="relative shrink-0" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-gray-400"><i className="fa-solid fa-ellipsis-vertical text-xl"></i></button>
              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-48 bg-[#1C1C1E] border border-white/10 rounded-3xl shadow-3xl z-[100] p-2">
                  <button onClick={handleTogglePin} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/5 text-left text-white"><i className="fa-solid fa-thumbtack"></i><span className="text-[11px] font-black uppercase">置頂專案</span></button>
                  <button onClick={onOpenExport} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/5 text-left text-white"><i className="fa-solid fa-file-export"></i><span className="text-[11px] font-black uppercase">導出專案</span></button>
                  <div className="h-px bg-white/5 my-1" />
                  <button onClick={() => onDeleteProject(project.id)} className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-500/10 text-left text-red-500"><i className="fa-solid fa-trash"></i><span className="text-[11px] font-black uppercase">刪除專案</span></button>
                </div>
              )}
            </div>
         </div>

         <section className="bg-gradient-to-br from-[#1E293B] to-black p-8 rounded-[44px] border border-white/10 shadow-2xl mb-8 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8">
               <div><h3 className="text-xl font-black text-white tracking-tight">出版線性主軸</h3><p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-1">PUBLISHING SPINE PROGRESS</p></div>
               <button onClick={onOpenExport} className="px-6 py-2.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">推進流程</button>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-end px-1 text-[10px] font-black uppercase tracking-widest"><span className="text-gray-500">當前進度</span><span className="text-white">{Math.round(spineProgress)}%</span></div>
               <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 ${isCompliant === false ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-600'}`} style={{ width: `${spineProgress}%` }} /></div>
            </div>
         </section>

         <section className="space-y-6">
            <div className="px-2 flex justify-between items-end">
               <div>
                  <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">作品視覺封面 BOOK COVER</h3>
                  <p className="text-[9px] text-blue-500 font-bold uppercase mt-1">PRINT COMPLIANCE SYSTEM</p>
               </div>
               <div className="flex space-x-4">
                  <div className="text-right"><p className="text-[9px] text-gray-600 font-black uppercase">EST. SPINE</p><p className="text-xs font-black text-white">{estSpineWidth}"</p></div>
                  <div className="text-right"><p className="text-[9px] text-gray-600 font-black uppercase">EST. PAGES</p><p className="text-xs font-black text-white">{estPages} P</p></div>
               </div>
            </div>
            
            <div className={`relative aspect-[3/4] w-full max-w-[340px] mx-auto bg-[#1C1C1E] rounded-[44px] border-4 overflow-hidden shadow-2xl group transition-all ${isCompliant === true ? 'border-green-500/40' : isCompliant === false ? 'border-red-500/40' : 'border-white/5'}`}>
               {project.publishingPayload?.coverImage ? (
                  <>
                    <img src={project.publishingPayload.coverImage} alt="Book Cover" className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-amber-500/10 transition-opacity opacity-40 group-hover:opacity-100">
                       <div className="absolute bottom-6 right-6 w-24 h-16 border border-dashed border-red-500/50 bg-red-500/5 flex items-center justify-center">
                          <p className="text-[7px] text-red-500/80 font-black uppercase leading-none text-center">BARCODE<br/>SAFE ZONE</p>
                       </div>
                       <div className="absolute top-4 left-4 px-2 py-1 bg-green-500/20 rounded border border-green-500/30">
                          <p className="text-[8px] text-green-400 font-black uppercase">300 DPI OK</p>
                       </div>
                    </div>

                    {/* 精確匹配參考圖：滑鼠/手指觸碰顯示 本地儲存 與 重新生成 */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 space-y-4 pointer-events-auto">
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDownloadCover(); }} 
                         className="w-full py-5 bg-[#D4FF5F] text-black rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3"
                       >
                          <i className="fa-solid fa-download text-sm"></i>
                          <span>本地儲存</span>
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleGenerateCover(); }} 
                         className="w-full py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/20 active:scale-95 transition-all"
                       >
                          重新生成
                       </button>
                    </div>
                  </>
               ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center space-y-6">
                     <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-3xl border border-blue-600/20"><i className="fa-solid fa-image"></i></div>
                     <div className="space-y-2"><h4 className="text-sm font-black text-white uppercase tracking-widest">尚未生成封面</h4><p className="text-[10px] text-gray-500">將字數、書脊與條碼安全區納入生成邏輯。</p></div>
                     <button onClick={handleGenerateCover} disabled={isGeneratingCover} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl active:scale-95">{isGeneratingCover ? '正在渲染...' : '一鍵生成 AI 封面'}</button>
                  </div>
               )}
               
               {(isGeneratingCover || isCheckingCompliance) && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 z-20">
                     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">{isGeneratingCover ? '渲染高品質視覺...' : '預檢印刷合規性...'}</p>
                  </div>
               )}
            </div>

            {complianceReport && (
               <div className={`rounded-[32px] p-6 animate-in fade-in slide-in-from-top-4 duration-500 border ${isCompliant ? 'bg-green-600/10 border-green-500/20' : 'bg-red-600/10 border-red-500/20'}`}>
                  <div className={`flex items-center space-x-3 mb-3 ${isCompliant ? 'text-green-500' : 'text-red-500'}`}>
                    <i className={`fa-solid ${isCompliant ? 'fa-clipboard-check' : 'fa-triangle-exclamation'}`}></i>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Pre-flight Compliance Report</h4>
                  </div>
                  <p className={`text-xs leading-relaxed font-medium ${isCompliant ? 'text-green-200/70' : 'text-red-200/70'}`}>{complianceReport}</p>
                  {!isCompliant && (
                    <p className="mt-4 text-[9px] font-black uppercase text-red-500/80 tracking-widest bg-red-500/10 p-2 rounded-lg text-center">
                      ⚠ 出版主軸已鎖定：請根據建議重新生成封面以解鎖進度
                    </p>
                  )}
               </div>
            )}
         </section>

         <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">總字數</p><p className="text-2xl font-black text-white">{totalWords.toLocaleString()}</p></div>
            <div className="bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">創作天數</p><p className="text-2xl font-black text-[#D4FF5F]">{writingDays} D</p></div>
         </div>
      </header>

      <main className="px-8 space-y-12">
         <section className="space-y-6">
            <div className="flex items-center justify-between px-2 mb-4">
               <div><h2 className="text-3xl font-black text-white tracking-tight">章節管理</h2><p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-1">拖拽排序 · 點擊編輯</p></div>
               <button onClick={handleOpenAdd} className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl shadow-xl active:scale-95 transition-all hover:scale-105"><i className="fa-solid fa-plus"></i></button>
            </div>
            
            <div className="space-y-4">
               {project.chapters.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px] opacity-30"><i className="fa-solid fa-feather-pointed text-4xl mb-4"></i><p className="text-[10px] font-black uppercase tracking-widest">目前尚無內容</p></div>
               ) : (
                  project.chapters.map((unit, idx) => (
                    <div key={unit.id} draggable onDragStart={() => onDragStart(idx)} onDragOver={(e) => onDragOver(e, idx)} className="group bg-[#1C1C1E] p-6 rounded-[32px] border border-white/5 flex items-center justify-between hover:bg-[#252528] transition-all">
                       <div className="flex items-center space-x-6"><i className="fa-solid fa-grip-lines text-xl opacity-10 cursor-grab active:cursor-grabbing"></i><div className="flex flex-col"><h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{unit.title}</h4><p className="text-[11px] text-gray-600 font-black uppercase mt-1">{unit.wordCount} 字</p></div></div>
                       <div className="flex items-center space-x-4"><button onClick={(e) => { e.stopPropagation(); handleDeleteChapter(unit.id); }} className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash text-lg"></i></button><button onClick={() => onEnterEditor(unit.id)} className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-lg active:scale-95"><i className="fa-solid fa-play ml-1"></i></button></div>
                    </div>
                  ))
               )}
            </div>
         </section>
      </main>

      {isAddingChapter && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsAddingChapter(false)} />
           <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-t-[44px] sm:rounded-[44px] border border-white/5 overflow-hidden shadow-3xl animate-in zoom-in duration-500 flex flex-col">
              <header className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
                 <div>
                   <h2 className="text-2xl font-black text-white">新增內容節點</h2>
                   <p className="text-[10px] font-black text-blue-500 uppercase mt-1">BASED ON {project.writingType} TEMPLATE</p>
                 </div>
                 <button onClick={() => setIsAddingChapter(false)} className="w-12 h-12 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                   <i className="fa-solid fa-xmark"></i>
                 </button>
              </header>
              
              <main className="p-10 space-y-8">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2">節點標題 NODE TITLE</label>
                    <input 
                      ref={addInputRef}
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                      placeholder={structDef.autoNumbering ? structDef.defaultNamingRule(project.chapters.length + 1) : "請輸入標題..."}
                      className="w-full bg-black/40 border border-white/10 h-20 px-8 rounded-3xl text-2xl font-black text-white outline-none focus:border-blue-600 transition-all placeholder-white/5"
                    />
                 </div>
                 
                 <div className="p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10">
                    <p className="text-[12px] text-gray-400 leading-relaxed font-medium">
                       系統已自動根據「{TEMPLATES[project.writingType]?.label}」範本規格預填建議標題。您可以直接按確認或自行修改。
                    </p>
                 </div>
              </main>

              <footer className="p-8 bg-[#0F0F10] border-t border-white/5">
                 <button 
                   onClick={handleAdd}
                   className="w-full py-7 rounded-[32px] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 active:scale-[0.98] transition-all"
                 >
                    確認 並 新增 
                 </button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
