
import React, { useState, useRef } from 'react';
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
    // 排序：置頂在前，且保持其餘項目的相對順序
    const pinned = updated.filter(p => p.isPinned);
    const unpinned = updated.filter(p => !p.isPinned);
    onUpdateProjects([...pinned, ...unpinned]);
    setActiveMenuId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    onUpdateProjects(updated);
    setActiveMenuId(null);
  };

  const onDragStart = (idx: number) => {
    // 規則：置頂資料夾不可移動
    if (projects[idx].isPinned) return;
    setDraggedIdx(idx);
  };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    // 規則：目標不能是置頂資料夾，且拖移源也不能是置頂資料夾
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

  const isModalOpen = isCreating || !!editingProject;

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
              className={`stack-card animate-in fade-in slide-in-from-bottom-4 duration-500 ${draggedIdx === idx ? 'opacity-30 scale-95 ring-2 ring-white/20' : ''}`}
              style={{ 
                zIndex: projects.length - idx,
                backgroundColor: proj.color,
                color: '#121212',
                animationDelay: `${idx * 100}ms`,
                cursor: proj.isPinned ? 'default' : 'pointer'
              }}
              onDragOver={(e) => onDragOver(e, idx)}
              onClick={() => onSelectProject(proj)}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-center space-x-2 mb-2">
                       {proj.isPinned && <i className="fa-solid fa-thumbtack text-[10px] text-black/40"></i>}
                       {proj.isFavorite && <i className="fa-solid fa-heart text-[10px] text-red-500/60"></i>}
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{proj.tags.join(' • ')}</span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter leading-[1] mb-2 truncate pr-4">{proj.name}</h3>
                  </div>
                  
                  <div className="relative">
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
                       <i className="fa-solid fa-ellipsis-vertical opacity-60 pointer-events-none"></i>
                    </button>
                    
                    {activeMenuId === proj.id && (
                      <div className="absolute right-0 top-14 w-44 bg-black/90 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-2xl py-3 z-[1000] animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                         <button onClick={(e) => handleTogglePin(e, proj.id)} className="w-full px-6 py-3 flex items-center space-x-3 hover:bg-white/5 text-white/80 transition-colors">
                            <i className={`fa-solid fa-thumbtack text-xs ${proj.isPinned ? 'text-blue-500' : ''}`}></i>
                            <span className="text-[11px] font-black uppercase tracking-widest">{proj.isPinned ? '取消置頂' : '置頂資料夾'}</span>
                         </button>
                         <button onClick={(e) => handleOpenEdit(e, proj)} className="w-full px-6 py-3 flex items-center space-x-3 hover:bg-white/5 text-white/80 transition-colors">
                            <i className="fa-solid fa-pen-to-square text-xs text-[#7b61ff]"></i>
                            <span className="text-[11px] font-black uppercase tracking-widest">編輯資料夾</span>
                         </button>
                         <div className="h-px bg-white/5 my-2 mx-4" />
                         <button onClick={(e) => handleDelete(e, proj.id)} className="w-full px-6 py-3 flex items-center space-x-3 hover:bg-red-500/10 text-red-500 transition-colors">
                            <i className="fa-solid fa-trash-can text-xs"></i>
                            <span className="text-[11px] font-black uppercase tracking-widest">刪除資料夾</span>
                         </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-14">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                    <span className="flex items-center">
                       <i className="fa-regular fa-clock mr-1.5 text-[9px]"></i>
                       {proj.metadata}
                    </span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-bar-container bg-black/10">
                    <div className="progress-fill bg-black/40" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Universal Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={resetForm} />
           <div className="relative w-full max-w-lg bg-[#111111] rounded-t-[44px] sm:rounded-[44px] p-6 sm:p-8 flex flex-col space-y-4 animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[92vh] shadow-2xl border border-white/5">
              
              <div className="flex justify-between items-start pt-2">
                 <div className="flex flex-col">
                    <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                      {editingProject ? '編輯智慧資料夾' : '建立智慧資料夾'}
                    </h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">
                      {editingProject ? 'UPDATE SMART REPOSITORY' : 'NEW SMART REPOSITORY'}
                    </p>
                 </div>
                 <button onClick={resetForm} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                   <i className="fa-solid fa-xmark text-xl"></i>
                 </button>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">資料夾名稱 FOLDER NAME</label>
                 <div className="relative">
                   <input 
                      autoFocus
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="例如：量子詩集..." 
                      className="w-full bg-[#1A1A1A] border border-white/5 h-14 px-6 rounded-[22px] text-lg font-bold outline-none focus:border-[#7b61ff] transition-all text-white"
                   />
                   <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600">
                      <i className="fa-solid fa-keyboard"></i>
                   </div>
                 </div>
              </div>

              {/* Template Paradigm */}
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">寫作範式 TEMPLATE PARADIGM</label>
                 <div className="grid grid-cols-2 gap-2.5">
                    {Object.entries(TEMPLATES).map(([type, config]) => (
                       <button 
                          key={type}
                          onClick={() => setFormData({...formData, type: type as WritingType})}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${formData.type === type ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-lg shadow-purple-900/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                       >
                          <i className={`fa-solid ${config.icon} text-base mb-1 ${formData.type === type ? 'text-white' : 'text-[#7b61ff]'}`}></i>
                          <p className="text-[10px] font-black uppercase tracking-tighter leading-none">{config.label}</p>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Visual Coding Section */}
              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">視覺編碼 VISUAL CODING</label>
                    <div className="grid grid-cols-6 gap-2">
                       {PROJECT_COLORS.map(c => (
                          <button 
                             key={c} 
                             onClick={() => setFormData({...formData, color: c})}
                             className={`aspect-square rounded-[8px] border-[2px] transition-transform active:scale-90 ${formData.color === c ? 'border-white scale-105' : 'border-transparent opacity-80'}`} 
                             style={{backgroundColor: c}}
                          />
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-5 gap-2 pb-2">
                    {PROJECT_ICONS.map(i => (
                       <button 
                          key={i}
                          onClick={() => setFormData({...formData, icon: i})}
                          className={`aspect-square rounded-full flex items-center justify-center transition-all ${formData.icon === i ? 'bg-[#7b61ff] text-white scale-110 shadow-lg shadow-purple-900/40' : 'bg-[#1A1A1A] text-gray-500 hover:text-gray-300'}`}
                       >
                          <i className={`fa-solid ${i} text-base`}></i>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button 
                   onClick={handleSubmit}
                   disabled={!formData.name.trim()}
                   className={`w-full py-5 rounded-full text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center ${!formData.name.trim() ? 'bg-gray-700 opacity-50' : 'bg-[#7b61ff] active:scale-95'}`}
                >
                   <span>{editingProject ? '更 新 智 慧 資 料 夾' : '建 立 智 慧 資 料 夾'}</span>
                </button>
                <p className="text-center text-[9px] text-gray-700 font-black uppercase tracking-[0.1em] mt-3">
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
