
import React, { useState } from 'react';
import { Project, WritingType, ModuleType } from '../types';
import { PROJECT_COLORS, PROJECT_ICONS, TEMPLATES } from '../constants';

interface LibraryProps {
  onSelectProject: (p: any) => void;
}

const Library: React.FC<LibraryProps> = ({ onSelectProject }) => {
  const [weather] = useState({ temp: '15', city: '新北市', date: 'January 20' });
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    type: WritingType.NOVEL,
    color: PROJECT_COLORS[0],
    icon: PROJECT_ICONS[0]
  });

  const [localProjects, setLocalProjects] = useState([
    {
      id: 'p1',
      name: 'The Solar Paradox',
      writingType: WritingType.NOVEL,
      metadata: 'EDITED 10M AGO',
      progress: 82,
      color: '#F5E050',
      icon: 'fa-feather-pointed',
      chapters: [{ id: 'c1', title: 'Chapter 1', content: 'Story starts...', order: 1, history: [] }],
      modules: TEMPLATES[WritingType.NOVEL].modules.map((m, i) => ({ ...m, id: `m-${i}`, order: i })),
      settings: { typography: 'serif', fontSize: 'normal' }
    },
    {
      id: 'p2',
      name: 'Urban Solitude',
      writingType: WritingType.RESEARCH,
      metadata: 'DRAFTING • CHAPTER 3',
      progress: 35,
      color: '#FF6B2C',
      icon: 'fa-camera',
      chapters: [{ id: 'c2', title: 'Draft 1', content: 'Urban life is...', order: 1, history: [] }],
      modules: TEMPLATES[WritingType.RESEARCH].modules.map((m, i) => ({ ...m, id: `m-${i}`, order: i })),
      settings: { typography: 'sans', fontSize: 'normal' }
    },
    {
        id: 'p3',
        name: 'Midnight Podcast S2',
        writingType: WritingType.SCREENPLAY,
        metadata: 'CREATED YESTERDAY',
        progress: 10,
        color: '#B2A4FF',
        icon: 'fa-film',
        chapters: [{ id: 'c3', title: 'Act I', content: 'INT. COFFEE SHOP - DAY', order: 1, history: [] }],
        modules: TEMPLATES[WritingType.SCREENPLAY].modules.map((m, i) => ({ ...m, id: `m-${i}`, order: i })),
        settings: { typography: 'sans', fontSize: 'normal' }
      }
  ]);

  const handleCreate = () => {
    if (!newProject.name) return;
    const project: any = {
      id: 'p-' + Date.now(),
      name: newProject.name,
      writingType: newProject.type,
      metadata: 'JUST CREATED',
      progress: 0,
      color: newProject.color,
      icon: newProject.icon,
      chapters: [{ id: 'c1', title: '第一章', content: '', order: 1, history: [] }],
      modules: TEMPLATES[newProject.type].modules.map((m, i) => ({ ...m, id: `m-${i}`, order: i })),
      settings: { typography: 'serif', fontSize: 'normal' },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setLocalProjects([project, ...localProjects]);
    setIsCreating(false);
    onSelectProject(project);
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
              <span className="bg-black/5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-[rgba(87,77,51,0.5)]">MACOS</span>
            </div>
          </div>
          <span className="temp">{weather.temp}°</span>
          <div className="temp-scale"><span>Celsius</span></div>
        </div>
      </section>

      {/* Stacking Card List */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <h2 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">CORE REPOSITORIES</h2>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40 active:scale-90 transition-all"
          >
            <i className="fa-solid fa-plus text-white text-sm"></i>
          </button>
        </div>
        
        <div className="stack-container relative">
          {localProjects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className="stack-card"
              style={{ 
                zIndex: localProjects.length - idx,
                backgroundColor: proj.color,
                color: '#121212'
              }}
              onClick={() => onSelectProject(proj)}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <div className="flex items-center space-x-2 mb-2 opacity-60">
                       <i className={`fa-solid ${proj.icon} text-xs`}></i>
                       <span className="text-[10px] font-black uppercase tracking-widest">{proj.writingType}</span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter leading-[0.9]">{proj.name}</h3>
                  </div>
                  <button className="card-action-btn">
                     <i className="fa-solid fa-ellipsis-vertical opacity-60"></i>
                  </button>
                </div>
                
                <div className="mt-12">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span>{proj.metadata}</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-fill bg-black/30" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create Project Dialog */}
      {isCreating && (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCreating(false)} />
           <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-t-[44px] sm:rounded-[44px] p-10 flex flex-col space-y-10 animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black tracking-tight">建立智慧資料夾</h2>
                 <button onClick={() => setIsCreating(false)} className="text-gray-500"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>

              {/* Name */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">作品名稱</label>
                 <input 
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    placeholder="例如：太陽悖論" 
                    className="w-full bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-lg font-bold outline-none focus:border-blue-500 transition-all"
                 />
              </div>

              {/* Template Type */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">寫作模板</label>
                 <div className="grid grid-cols-2 gap-3">
                    {Object.entries(TEMPLATES).map(([type, config]) => (
                       <button 
                          key={type}
                          onClick={() => setNewProject({...newProject, type: type as WritingType})}
                          className={`p-5 rounded-2xl border text-left transition-all ${newProject.type === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                       >
                          <i className={`fa-solid ${config.icon} mb-2`}></i>
                          <p className="text-[11px] font-bold">{config.label}</p>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Color & Icon */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">視覺編碼</label>
                 <div className="flex flex-wrap gap-2">
                    {PROJECT_COLORS.map(c => (
                       <button 
                          key={c} 
                          onClick={() => setNewProject({...newProject, color: c})}
                          className={`w-8 h-8 rounded-full border-2 ${newProject.color === c ? 'border-white' : 'border-transparent'}`} 
                          style={{backgroundColor: c}}
                       />
                    ))}
                 </div>
                 <div className="flex flex-wrap gap-2 pt-4">
                    {PROJECT_ICONS.map(i => (
                       <button 
                          key={i}
                          onClick={() => setNewProject({...newProject, icon: i})}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newProject.icon === i ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}
                       >
                          <i className={`fa-solid ${i}`}></i>
                       </button>
                    ))}
                 </div>
              </div>

              <button 
                 onClick={handleCreate}
                 className="w-full py-6 bg-blue-600 rounded-[30px] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
              >
                 開啟寫作容器
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
