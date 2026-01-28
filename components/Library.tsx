
import React, { useState } from 'react';
import { Project, WritingType } from '../types';
import { PROJECT_COLORS, PROJECT_ICONS, TEMPLATES } from '../constants';

interface LibraryProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onCreateProject: (data: { name: string, type: WritingType, color: string, icon: string }) => void;
  onUpdateProjects: (projects: Project[]) => void;
}

const Library: React.FC<LibraryProps> = ({ projects, onSelectProject, onCreateProject, onUpdateProjects }) => {
  const [weather] = useState({ temp: '15', city: '新北市', date: 'January 20' });
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: WritingType.NOVEL,
    color: PROJECT_COLORS[0],
    icon: PROJECT_ICONS[0]
  });

  const resetForm = () => {
    setFormData({ name: '', type: WritingType.NOVEL, color: PROJECT_COLORS[0], icon: PROJECT_ICONS[0] });
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    setEditingProject(proj);
    setFormData({
      name: proj.name,
      type: proj.writingType,
      color: proj.color,
      icon: proj.icon
    });
    setActiveMenuId(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    if (editingProject) {
      const updated = projects.map(p => 
        p.id === editingProject.id 
          ? { ...p, name: formData.name, writingType: formData.type, color: formData.color, icon: formData.icon } 
          : p
      );
      onUpdateProjects(updated);
    } else {
      onCreateProject(formData);
    }
    resetForm();
  };

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = projects.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p);
    onUpdateProjects(updated);
    setActiveMenuId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    onUpdateProjects(updated);
    setActiveMenuId(null);
  };

  const onDragStart = (idx: number) => {
    if (projects[idx].isPinned) return;
    setDraggedIdx(idx);
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    if (projects[idx].isPinned || projects[draggedIdx].isPinned) return;

    const newProjects = [...projects];
    const item = newProjects.splice(draggedIdx, 1)[0];
    newProjects.splice(idx, 0, item);
    onUpdateProjects(newProjects);
    setDraggedIdx(idx);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="px-8 space-y-12 pb-32">
      {/* Weather Widget */}
      <section>
        <div className="weather-card">
          <div className="weather-container">
            <div className="cloud front"><span className="left-front"></span><span className="right-front"></span></div>
            <span className="sun sunshine"></span><span className="sun"></span>
            <div className="cloud back"><span className="left-back"></span><span className="right-back"></span></div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-base text-[rgba(87,77,51,0.6)] uppercase tracking-tight">{weather.city}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-sm text-[rgba(87,77,51,0.4)]">{weather.date}</span>
            </div>
          </div>
          <span className="temp">{weather.temp}°</span>
          <div className="temp-scale"><span>攝氏 Celsius</span></div>
        </div>
      </section>

      {/* Repository Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
             <h2 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">智慧寫作書架 REPOSITORY</h2>
             <p className="text-[9px] text-[#4E4E52] font-black uppercase tracking-widest mt-1">共有 {projects.length} 個專案</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-90 hover:scale-105 transition-all"
          >
            <i className="fa-solid fa-plus text-white text-lg"></i>
          </button>
        </div>
        
        <div className="stack-container relative min-h-[500px]">
          {projects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className={`stack-card group/card animate-in fade-in slide-in-from-bottom-4 duration-500 ${draggedIdx === idx ? 'opacity-30 scale-95 ring-2 ring-white/20' : ''}`}
              style={{ 
                zIndex: projects.length - idx,
                backgroundColor: proj.color,
                color: proj.color === '#000000' || proj.color === '#121212' ? '#ffffff' : '#121212',
                animationDelay: `${idx * 100}ms`
              }}
              onDragOver={(e) => onDragOver(e, idx)}
              onClick={() => onSelectProject(proj)}
            >
              <div className="flex flex-col h-full justify-between relative">
                <div className="flex justify-between items-start">
                  <div className="max-w-[80%]">
                    <h3 className="text-4xl font-black tracking-tighter leading-[1] mb-2 pr-4">{proj.name}</h3>
                    <div className="flex items-center space-x-2">
                       {proj.isPinned && <i className="fa-solid fa-thumbtack text-[10px] opacity-40"></i>}
                       <span className="text-[11px] font-black uppercase tracking-widest opacity-40">{proj.tags.join(' • ')}</span>
                    </div>
                  </div>
                  
                  <div className="relative z-20">
                    <button 
                      draggable={!proj.isPinned}
                      onDragStart={(e) => { e.stopPropagation(); onDragStart(idx); }}
                      onDragEnd={onDragEnd}
                      className={`card-action-btn active:scale-95 ${proj.isPinned ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === proj.id ? null : proj.id);
                      }}
                    >
                       <i className="fa-solid fa-ellipsis-vertical opacity-50 pointer-events-none"></i>
                    </button>
                    
                    {activeMenuId === proj.id && (
                      <div className="absolute right-0 top-14 w-44 bg-black/90 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-2xl py-3 z-[1000] animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                         <button onClick={(e) => handleTogglePin(e, proj.id)} className="w-full px-6 py-3 flex items-center space-x-3 hover:bg-white/5 text-white/80 transition-colors">
                            <i className={`fa-solid fa-thumbtack text-xs ${proj.isPinned ? 'text-blue-500' : ''}`}></i>
                            <span className="text-[11px] font-black uppercase tracking-widest">{proj.isPinned ? '取消置頂' : '置頂專案'}</span>
                         </button>
                         <button onClick={(e) => handleOpenEdit(e, proj)} className="w-full px-6 py-3 flex items-center space-x-3 hover:bg-white/5 text-white/80 transition-colors">
                            <i className="fa-solid fa-pen-to-square text-xs text-[#7b61ff]"></i>
                            <span className="text-[11px] font-black uppercase tracking-widest">編輯專案</span>
                         </button>
                         <div className="h-px bg-white/5 my-2 mx-4" />
                         <button onClick={(e) => handleDelete(e, proj.id)} className="w-full px-6 py-3 flex items-center space-x-3 hover:bg-red-500/10 text-red-500 transition-colors">
                            <i className="fa-solid fa-trash-can text-xs"></i>
                            <span className="text-[11px] font-black uppercase tracking-widest">刪除專案</span>
                         </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-12">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-40 mb-3">
                    <span className="flex items-center">
                       {proj.metadata.toUpperCase()}
                    </span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-bar-container bg-black/5 h-2">
                    <div className="progress-fill bg-black/30" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Creation/Edit Modal - 完全遵循參考圖優化 */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center animate-in fade-in duration-300 px-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={resetForm} />
           <div className="relative w-full max-w-lg bg-[#111111] rounded-[44px] p-8 sm:p-10 flex flex-col space-y-8 animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[95vh] shadow-2xl border border-white/5 no-scrollbar">
              
              <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                    <h2 className="text-3xl font-black tracking-tight text-white">建立智慧資料夾</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">NEW SMART REPOSITORY</p>
                 </div>
                 <button onClick={resetForm} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                   <i className="fa-solid fa-xmark text-xl"></i>
                 </button>
              </div>

              <div className="space-y-10">
                 {/* 資料夾名稱輸入框 */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">資料夾名稱 FOLDER NAME</label>
                    <div className="relative">
                       <input 
                          autoFocus
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="例如：量子詩集..." 
                          className="w-full bg-[#1C1C1E] border border-white/5 h-20 px-8 rounded-3xl text-xl font-black outline-none focus:ring-2 focus:ring-[#7b61ff]/50 transition-all text-white placeholder-gray-600"
                       />
                       <i className="fa-solid fa-keyboard absolute right-8 top-1/2 -translate-y-1/2 text-gray-700 text-lg"></i>
                    </div>
                 </div>

                 {/* 寫作範式選擇區塊 */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">寫作範式 TEMPLATE PARADIGM</label>
                    <div className="grid grid-cols-2 gap-3">
                       {Object.entries(TEMPLATES).map(([key, template]) => (
                          <button
                            key={key}
                            onClick={() => setFormData({...formData, type: key as WritingType})}
                            className={`flex flex-col items-start p-5 rounded-[2.5rem] border transition-all relative overflow-hidden h-32 justify-center ${formData.type === key ? 'bg-[#7b61ff] border-[#7b61ff] shadow-[0_15px_30px_rgba(123,97,255,0.3)] text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400 hover:border-white/10'}`}
                          >
                             <i className={`fa-solid ${template.icon} text-2xl mb-3 ${formData.type === key ? 'text-white' : 'text-blue-500'}`}></i>
                             <span className="text-[11px] font-black uppercase tracking-widest">{template.label}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* 視覺編碼 (12色) */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">視覺編碼 VISUAL CODING</label>
                    <div className="grid grid-cols-6 gap-3">
                       {PROJECT_COLORS.map(c => (
                          <button 
                             key={c} 
                             onClick={() => setFormData({...formData, color: c})}
                             className={`aspect-square rounded-[1.2rem] border-4 transition-all relative ${formData.color === c ? 'border-white scale-110 z-10' : 'border-transparent opacity-100 hover:opacity-100'}`} 
                             style={{backgroundColor: c}}
                          >
                             {formData.color === c && (
                                <div className="absolute inset-0 ring-2 ring-black/20 rounded-lg" />
                             )}
                          </button>
                       ))}
                    </div>

                    {/* 圖標網格 (20圖標) */}
                    <div className="grid grid-cols-5 gap-3 mt-8">
                       {PROJECT_ICONS.map(icon => (
                          <button 
                             key={icon} 
                             onClick={() => setFormData({...formData, icon: icon})}
                             className={`aspect-square rounded-full flex items-center justify-center text-xl transition-all relative ${formData.icon === icon ? 'bg-[#7b61ff] text-white shadow-[0_0_20px_rgba(123,97,255,0.5)] z-10' : 'bg-[#1C1C1E] text-gray-700 hover:bg-white/5'}`}
                          >
                             <i className={`fa-solid ${icon}`}></i>
                             {formData.icon === icon && (
                               <div className="absolute inset-0 bg-[#7b61ff] opacity-40 blur-xl -z-10 rounded-full"></div>
                             )}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col space-y-6 pt-4">
                <button 
                   onClick={handleSubmit}
                   disabled={!formData.name.trim()}
                   className={`w-full py-7 rounded-full text-white font-black text-lg uppercase tracking-[0.3em] shadow-2xl transition-all ${!formData.name.trim() ? 'bg-gray-800 opacity-50' : 'bg-[#1F2228] border border-white/5 hover:bg-[#2A2D35] active:scale-95'}`}
                >
                   建 立 智 慧 資 料 夾
                </button>
                <p className="text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">
                  系統將自動初始化草稿結構與 AI 分析模組
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
