
import React, { useState } from 'react';
import { Project, WritingType, WritingModule, Chapter, ModuleFunction } from '../types';
import { PROJECT_COLORS, PROJECT_ICONS, TEMPLATES } from '../constants';

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
  
  const [formData, setFormData] = useState({
    name: '',
    type: WritingType.LONG_FORM,
    targetWordCount: 5000,
    color: PROJECT_COLORS[4],
    icon: PROJECT_ICONS[0]
  });

  const resetForm = () => {
    setFormData({ name: '', type: WritingType.LONG_FORM, targetWordCount: 5000, color: PROJECT_COLORS[4], icon: PROJECT_ICONS[0] });
    setIsCreating(false);
    setIsTemplatesExpanded(false);
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const template = TEMPLATES[formData.type];
    
    // 初始化寫作模組 Skeleton
    const modules: WritingModule[] = template.skeleton.map((s, idx) => ({
      id: `m-${Date.now()}-${idx}`,
      function: s.function,
      title: s.title,
      icon: s.icon,
      description: '',
      order: idx + 1,
      isInitial: true
    }));

    // 初始化預設章節
    const initialChapters: Chapter[] = [
      {
        id: `c-${Date.now()}-1`,
        title: '第 1 章 · Chapter 1',
        content: '',
        order: 1,
        history: [],
        wordCount: 0,
        lastEdited: Date.now()
      }
    ];

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: formData.name,
      writingType: formData.type,
      targetWordCount: formData.targetWordCount,
      metadata: '剛剛建立',
      progress: 0,
      color: formData.color,
      icon: formData.icon,
      chapters: initialChapters,
      modules: modules,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      settings: { typography: 'serif', fontSize: 'normal' }
    };

    onCreateProject(newProject);
    resetForm();
  };

  const topParadigms = [
    WritingType.LONG_FORM,
    WritingType.ARCHIVE,
    WritingType.ESSAY,
    WritingType.CREATOR
  ];

  const otherParadigms = (Object.keys(TEMPLATES) as WritingType[]).filter(t => !topParadigms.includes(t));

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
            onClick={() => setIsCreating(true)}
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-90 transition-all"
          >
            <i className="fa-solid fa-plus text-white text-lg"></i>
          </button>
        </div>
        
        <div className="stack-container relative min-h-[500px]">
          {projects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className="stack-card animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ 
                zIndex: projects.length - idx,
                backgroundColor: proj.color,
                color: proj.color === '#000000' || proj.color === '#121212' || proj.color === '#1E293B' ? '#ffffff' : '#121212',
                animationDelay: `${idx * 100}ms`
              }}
              onClick={() => onSelectProject(proj)}
            >
              <div className="flex flex-col h-full justify-between relative">
                <div className="flex justify-between items-start">
                  <div className="max-w-[80%]">
                    <h3 className="text-4xl font-black tracking-tighter leading-[1] mb-2 pr-4">{proj.name}</h3>
                    <div className="flex items-center space-x-2">
                       <span className="text-[11px] font-black uppercase tracking-widest opacity-40">
                         {TEMPLATES[proj.writingType]?.label} • {proj.targetWordCount / 1000}K 目標
                       </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <i className={`fa-solid ${proj.icon} opacity-60`}></i>
                  </div>
                </div>
                
                <div className="mt-12">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-40 mb-3">
                    <span>{proj.metadata.toUpperCase()}</span>
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

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center animate-in fade-in duration-300 p-6">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={resetForm} />
           <div className="relative w-full max-w-lg bg-[#0F0F10] rounded-[48px] p-0 flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden shadow-3xl border border-white/5 h-[92vh]">
              
              <header className="px-10 py-8 border-b border-white/5 shrink-0">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h2 className="text-3xl font-black text-white tracking-tight">建立智慧資料夾</h2>
                       <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">NEW SMART REPOSITORY</p>
                    </div>
                    <button onClick={resetForm} className="w-10 h-10 rounded-full bg-white/5 text-gray-500 hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">資料夾名稱 FOLDER NAME</label>
                       <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如：我的第一本小說..." className="w-full bg-[#1C1C1E] h-16 px-6 rounded-2xl text-lg font-black text-white outline-none border border-white/5 focus:border-[#7b61ff] transition-all" />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">目標字數 TARGET (WORDS)</label>
                       <div className="flex flex-wrap gap-2">
                          {[1000, 3000, 5000, 10000].map(count => (
                             <button 
                                key={count} 
                                onClick={() => setFormData({...formData, targetWordCount: count})}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${formData.targetWordCount === count ? 'bg-[#7b61ff] text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                             >
                                {count / 1000}K
                             </button>
                          ))}
                          <div className="flex-1 flex items-center bg-white/5 rounded-xl px-4 border border-white/5 min-w-[80px]">
                             <input 
                                type="number" 
                                value={formData.targetWordCount} 
                                onChange={e => setFormData({...formData, targetWordCount: parseInt(e.target.value) || 0})}
                                className="w-full bg-transparent text-[10px] font-black text-white outline-none"
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar px-10 pt-6 pb-40 space-y-10">
                 {/* Top 2x2 Paradigms */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">寫作範式 TEMPLATE PARADIGM</label>
                    <div className="grid grid-cols-2 gap-3">
                       {topParadigms.map(type => {
                          const t = TEMPLATES[type];
                          const active = formData.type === type;
                          return (
                            <button 
                              key={type} 
                              onClick={() => setFormData({...formData, type})} 
                              className={`flex flex-col items-start p-5 rounded-[2.5rem] border transition-all h-36 justify-center ${active ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-lg' : 'bg-[#1C1C1E] border-white/5 text-gray-500 hover:border-white/10'}`}
                            >
                               <i className={`fa-solid ${t.icon} text-2xl mb-3 ${active ? 'text-white' : 'text-[#7b61ff]'}`}></i>
                               <span className="text-[11px] font-black uppercase tracking-widest leading-none">{t.label}</span>
                               <p className="text-[8px] font-bold opacity-40 mt-1 line-clamp-2">{t.description}</p>
                            </button>
                          );
                       })}
                    </div>
                 </div>

                 {/* Professional Scrolling Area */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">其餘專業範本 SPECIALIZED</label>
                       <button onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)} className="text-[9px] font-black text-[#7b61ff] uppercase tracking-widest">
                          {isTemplatesExpanded ? '收回' : '展開全部'}
                       </button>
                    </div>

                    <div className={`space-y-2 transition-all duration-500 ${isTemplatesExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none absolute h-0'}`}>
                       {otherParadigms.map(type => {
                          const t = TEMPLATES[type];
                          const active = formData.type === type;
                          return (
                             <button 
                                key={type} 
                                onClick={() => setFormData({...formData, type})}
                                className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${active ? 'bg-[#7b61ff] border-[#7b61ff] text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-500 hover:border-white/10'}`}
                             >
                                <div className="flex items-center space-x-4">
                                   <i className={`fa-solid ${t.icon} text-lg`}></i>
                                   <div className="text-left">
                                      <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">{t.label}</h4>
                                      <p className="text-[8px] font-bold opacity-40 mt-0.5">{t.enLabel}</p>
                                   </div>
                                </div>
                                {active && <i className="fa-solid fa-circle-check"></i>}
                             </button>
                          );
                       })}
                    </div>
                 </div>

                 {/* Visual Coding */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">視覺編碼 VISUAL CODING</label>
                    <div className="grid grid-cols-6 gap-3">
                       {PROJECT_COLORS.map(c => (
                          <button key={c} onClick={() => setFormData({...formData, color: c})} className={`aspect-square rounded-full border-4 transition-all ${formData.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`} style={{ backgroundColor: c }} />
                       ))}
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-10 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10] to-transparent">
                 <button 
                    onClick={handleCreate} 
                    disabled={!formData.name.trim()} 
                    className={`w-full py-7 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.97] ${!formData.name.trim() ? 'bg-gray-800 opacity-40' : 'bg-[#7b61ff] shadow-[0_20px_50px_rgba(123,97,255,0.3)]'}`}
                 >
                    啟 動 智 慧 倉 庫
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
