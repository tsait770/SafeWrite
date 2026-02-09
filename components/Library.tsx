
import React, { useState, useEffect } from 'react';
import { Project, WritingType, StructureUnit, StructureType } from '../types';
import { PROJECT_COLORS, PROJECT_ICONS, TEMPLATES, TEMPLATE_STRUCTURE_MAP, STRUCTURE_DEFINITIONS } from '../constants';

interface LibraryProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onCreateProject: (data: Project) => void;
  onUpdateProjects: (projects: Project[]) => void;
}

const Library: React.FC<LibraryProps> = ({ projects, onSelectProject, onCreateProject, onUpdateProjects }) => {
  const [weather] = useState({ temp: '15', city: '新北市', date: 'January 20' });
  const [isCreating, setIsCreating] = useState(false);
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // 直接編輯狀態
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  // SafeWrite 核心色盤：22 個不重複顏色
  const corePalette = [
    '#FADE4B', // 1. 太陽黃
    '#FF6B2C', // 2. 活力橘
    '#D4FF5F', // 3. 螢光綠
    '#B2A4FF', // 4. 夢幻紫 (預設選中)
    '#9EABB3', '#B2967D', '#8E9775', '#E28E8E', '#7C9473', '#AFB9C8',
    '#9BABB8', '#D7C0AE', '#967E76', '#7286D3', '#A4BE7B', '#EDCDBB',
    '#6D8299', '#D4ADFC', '#B99470', '#7895B2', '#A1C298', '#C6A683'
  ];

  const [formData, setFormData] = useState({
    name: '',
    type: WritingType.NOVEL,
    targetWordCount: 5000,
    color: '#B2A4FF',
    icon: PROJECT_ICONS[0]
  });

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const resetForm = () => {
    setFormData({ name: '', type: WritingType.NOVEL, targetWordCount: 5000, color: '#B2A4FF', icon: PROJECT_ICONS[0] });
    setIsCreating(false);
    setIsTemplatesExpanded(false);
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const structType = TEMPLATE_STRUCTURE_MAP[formData.type] || StructureType.FREE;
    const def = STRUCTURE_DEFINITIONS[structType];
    
    const initialUnits: StructureUnit[] = [];
    if (structType !== StructureType.FREE) {
        initialUnits.push({
            id: `u-${Date.now()}-0`,
            title: def.autoNumbering ? def.defaultNamingRule(1) : (structType === StructureType.BLOCK ? '未命名區塊' : '第一部分'),
            content: '',
            order: 1,
            wordCount: 0,
            lastEdited: Date.now(),
            createdAt: Date.now()
        });
    }

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: formData.name,
      writingType: formData.type,
      structureType: structType,
      targetWordCount: formData.targetWordCount,
      metadata: '剛剛建立',
      progress: 0,
      color: formData.color,
      icon: formData.icon,
      chapters: initialUnits,
      modules: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      settings: { typography: 'serif', fontSize: 'normal' },
      isPinned: false
    };

    onCreateProject(newProject);
    resetForm();
    onSelectProject(newProject);
  };

  const handleTogglePin = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const updatedProjects = projects.map(p => 
      p.id === project.id ? { ...p, isPinned: !p.isPinned } : p
    );
    onUpdateProjects(updatedProjects);
    setActiveMenuId(null);
  };

  const handleStartInlineEdit = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setTempName(project.name);
    setActiveMenuId(null);
  };

  const handleSaveInlineEdit = (projId: string) => {
    const trimmed = tempName.trim();
    if (trimmed) {
      const updatedProjects = projects.map(p => 
        p.id === projId ? { ...p, name: trimmed, updatedAt: Date.now() } : p
      );
      onUpdateProjects(updatedProjects);
    }
    setEditingProjectId(null);
  };

  const handleDelete = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (window.confirm(`確定要刪除專案「${project.name}」嗎？此動作無法復原。`)) {
      const updatedProjects = projects.filter(p => p.id !== project.id);
      onUpdateProjects(updatedProjects);
    }
    setActiveMenuId(null);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isPinned === b.isPinned) return b.updatedAt - a.updatedAt;
    return a.isPinned ? -1 : 1;
  });

  const mainParadigms = [
    WritingType.NOVEL,
    WritingType.DIARY,
    WritingType.BLOG,
    WritingType.CUSTOM
  ];

  const scrollParadigms = (Object.keys(TEMPLATES) as WritingType[]).filter(t => !mainParadigms.includes(t));

  return (
    <div className="px-4 sm:px-8 space-y-8 sm:space-y-12 pb-40 max-w-7xl mx-auto">
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

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
             <h2 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">智慧寫作書架 REPOSITORY</h2>
             <p className="text-[9px] text-[#4E4E52] font-black uppercase tracking-widest mt-1">共有 {projects.length} 個專案</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-12 h-12 rounded-full bg-[#2563eb] flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-90 hover:scale-105 transition-all"
          >
            <i className="fa-solid fa-plus text-white text-lg"></i>
          </button>
        </div>
        
        <div className="stack-container relative">
          {sortedProjects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className="stack-card animate-in fade-in slide-in-from-bottom-8 duration-500"
              style={{ 
                zIndex: sortedProjects.length - idx,
                backgroundColor: proj.color,
                color: proj.color === '#000000' || proj.color === '#121212' || proj.color === '#1E293B' ? '#ffffff' : '#121212',
                animationDelay: `${idx * 100}ms`
              }}
              onClick={() => onSelectProject(proj)}
            >
              <div className="flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-1">
                  <div className="max-w-[85%]">
                    <div className="flex items-center space-x-3 mb-1.5 min-h-[40px]">
                      {proj.isPinned && <i className="fa-solid fa-thumbtack text-xs opacity-60"></i>}
                      
                      {editingProjectId === proj.id ? (
                        <input
                          autoFocus
                          value={tempName}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setTempName(e.target.value)}
                          onBlur={() => handleSaveInlineEdit(proj.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInlineEdit(proj.id);
                            if (e.key === 'Escape') setEditingProjectId(null);
                          }}
                          className="bg-black/10 border-b-2 border-current outline-none text-[28px] sm:text-[34px] font-black tracking-tighter leading-none w-full px-1"
                        />
                      ) : (
                        <h3 
                          onClick={(e) => handleStartInlineEdit(e, proj)}
                          className="text-[28px] sm:text-[34px] font-black tracking-tighter leading-none truncate cursor-text hover:underline decoration-2 underline-offset-4"
                        >
                          {proj.name}
                        </h3>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                         {proj.tags && proj.tags.length > 0 ? `${proj.tags[0]} • ` : ''}{TEMPLATES[proj.writingType]?.label}
                       </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === proj.id ? null : proj.id);
                      }}
                      className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                    >
                      <i className="fa-solid fa-ellipsis-vertical text-lg opacity-60"></i>
                    </button>

                    {activeMenuId === proj.id && (
                      <div 
                        className="absolute right-0 top-12 w-44 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[200] p-1 animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={(e) => handleTogglePin(e, proj)}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-left transition-colors"
                        >
                          <i className={`fa-solid fa-thumbtack ${proj.isPinned ? 'text-[#D4FF5F]' : 'text-gray-400'}`}></i>
                          <span className="text-[11px] font-black text-white uppercase tracking-wider">{proj.isPinned ? '取消置頂' : '置頂專案'}</span>
                        </button>
                        <button 
                          onClick={(e) => handleStartInlineEdit(e, proj)}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-left transition-colors"
                        >
                          <i className="fa-solid fa-pen-to-square text-blue-400"></i>
                          <span className="text-[11px] font-black text-white uppercase tracking-wider">編輯名稱</span>
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, proj)}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-left transition-colors"
                        >
                          <i className="fa-solid fa-trash-can text-red-500"></i>
                          <span className="text-[11px] font-black text-red-500 uppercase tracking-wider">刪除專案</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto pb-2">
                  <div className="flex justify-between items-end mb-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                      {proj.metadata || 'JUST NOW'}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
                      {proj.progress}%
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-fill bg-black/20" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isCreating && (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={resetForm} />
           <div className="relative w-full max-w-3xl bg-[#0F0F10] rounded-t-[48px] sm:rounded-[48px] p-0 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in duration-500 overflow-hidden shadow-3xl border border-white/5 h-[92vh] sm:h-auto sm:max-h-[85vh]">
              
              <header className="px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 shrink-0 flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">建立智慧資料夾</h2>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">NEW SMART REPOSITORY PROTOCOL</p>
                 </div>
                 <button onClick={resetForm} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-lg"></i>
                 </button>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-10 pt-6 sm:pt-8 pb-32 space-y-8 sm:space-y-10">
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">資料夾名稱 FOLDER NAME</label>
                       <input 
                         autoFocus
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})} 
                         placeholder="例如：我的第一本小說..." 
                         className="w-full bg-[#1C1C1E] h-16 sm:h-20 px-6 sm:px-8 rounded-[1.5rem] sm:rounded-[2rem] text-lg sm:text-xl font-black text-white outline-none border border-white/5 focus:border-[#7b61ff] transition-all placeholder-white/5" 
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">目標字數 TARGET (WORDS)</label>
                       <div className="flex gap-2">
                          {[1000, 3000, 5000, 10000].map(count => (
                             <button 
                                key={count} 
                                onClick={() => setFormData({...formData, targetWordCount: count})}
                                className={`h-10 sm:h-12 flex-1 rounded-full text-[10px] sm:text-[11px] font-black transition-all ${formData.targetWordCount === count ? 'bg-[#7b61ff] text-white shadow-lg' : 'bg-[#1C1C1E] text-gray-500 border border-white/5 hover:bg-white/5'}`}
                             >
                                {count / 1000}K
                             </button>
                          ))}
                       </div>
                       <div className="w-full bg-[#1C1C1E] h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl border border-white/5 flex items-center">
                          <input 
                             type="number" 
                             value={formData.targetWordCount} 
                             onChange={e => setFormData({...formData, targetWordCount: parseInt(e.target.value) || 0})}
                             className="w-full bg-transparent text-base sm:text-lg font-black text-white outline-none"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">核心寫作範式 CORE PARADIGMS</label>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                       {mainParadigms.map((type) => {
                          const t = TEMPLATES[type];
                          const active = formData.type === type;
                          return (
                            <button 
                              key={type} 
                              onClick={() => setFormData({...formData, type})} 
                              className={`flex flex-col items-start p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border transition-all h-[180px] sm:h-[220px] lg:h-[240px] text-left relative group ${active ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-[0_15px_40px_rgba(123,97,255,0.4)]' : 'bg-[#1C1C1E] border-white/5 text-gray-400 hover:border-white/10'}`}
                            >
                               <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110 ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                                  <i className={`fa-solid ${t.icon} text-xl sm:text-2xl`} style={{ color: active ? 'white' : '#7b61ff' }}></i>
                               </div>
                               <span className={`text-[14px] sm:text-[16px] font-black uppercase tracking-widest leading-none mb-2 sm:mb-3 ${active ? 'text-white' : 'text-slate-200'}`}>{t.label}</span>
                               <p className={`text-[10px] sm:text-[11px] font-medium line-clamp-2 sm:line-clamp-3 leading-relaxed ${active ? 'text-white/80' : 'text-gray-500'}`}>{t.description}</p>
                            </button>
                          );
                       })}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">其餘專業範本 SPECIALIZED ARCHIVES</label>
                       <button onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)} className="text-[9px] font-black text-[#7b61ff] uppercase tracking-widest flex items-center gap-2">
                          {isTemplatesExpanded ? '收起 COLLAPSE' : '展開全部 VIEW ALL'}
                          <i className={`fa-solid fa-chevron-${isTemplatesExpanded ? 'up' : 'down'}`}></i>
                       </button>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-700 ${isTemplatesExpanded ? 'opacity-100 max-h-[1000px] visible mt-4' : 'opacity-0 max-h-0 invisible overflow-hidden'}`}>
                       {scrollParadigms.map(type => {
                          const t = TEMPLATES[type];
                          const active = formData.type === type;
                          return (
                             <button 
                                key={type} 
                                onClick={() => setFormData({...formData, type})}
                                className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border transition-all ${active ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-lg' : 'bg-[#1C1C1E] border-white/5 text-gray-500 hover:border-white/10'}`}
                             >
                                <div className="flex items-center space-x-4 text-left">
                                   <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                                      <i className={`fa-solid ${t.icon} text-base sm:text-lg`} style={{ color: active ? 'white' : '#7b61ff' }}></i>
                                   </div>
                                   <div>
                                      <h4 className={`text-[11px] sm:text-[12px] font-black uppercase tracking-widest leading-none ${active ? 'text-white' : 'text-slate-200'}`}>{t.label}</h4>
                                      <p className="text-[8px] sm:text-[9px] font-bold opacity-40 mt-1">{t.enLabel}</p>
                                   </div>
                                </div>
                                {active && <i className="fa-solid fa-circle-check text-white"></i>}
                             </button>
                          );
                       })}
                    </div>
                 </div>

                 <div className="space-y-4 pb-12">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">視覺編碼 VISUAL CODING</label>
                    <div className="flex flex-wrap gap-4 sm:gap-6 justify-start">
                       {corePalette.map(c => (
                          <button 
                            key={c} 
                            onClick={() => setFormData({...formData, color: c})} 
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center border-4 ${formData.color === c ? 'scale-125 border-white shadow-2xl opacity-100 z-10' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                            style={{ backgroundColor: c }}
                          >
                             {formData.color === c && <i className="fa-solid fa-check text-[10px] text-black"></i>}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10] to-transparent shrink-0">
                 <button 
                    onClick={handleCreate} 
                    disabled={!formData.name.trim()} 
                    className={`w-full py-6 sm:py-8 rounded-[2rem] sm:rounded-[2.5rem] text-white font-black text-xs sm:text-sm uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.97] hover:scale-[1.01] ${!formData.name.trim() ? 'bg-gray-800 opacity-40' : 'bg-[#7b61ff] shadow-[0_25px_60px_rgba(123,97,255,0.3)]'}`}
                 >
                    啟 動 智 慧 倉 庫 PROTOCOL
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
