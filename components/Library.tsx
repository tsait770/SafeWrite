
import React, { useState } from 'react';
import { Project, ProjectTemplate } from '../types';

interface LibraryProps {
  onSelectProject: (p: Project) => void;
}

const COLORS = [
  '#7b61ff', '#d4ff70', '#ff5c00', '#ff8a65', '#b39ddb', '#4caf50',
  '#2196f3', '#f44336', '#e91e63', '#9c27b0', '#009688', '#ffc107'
];

const ICONS = [
  'fa-book', 'fa-feather', 'fa-scroll', 'fa-pen-nib', 'fa-clapperboard',
  'fa-flask', 'fa-earth-asia', 'fa-user-ninja', 'fa-newspaper', 'fa-microscope',
  'fa-brain', 'fa-ghost', 'fa-shield-heart', 'fa-compass', 'fa-mountain-sun',
  'fa-robot', 'fa-dna', 'fa-rocket', 'fa-dragon', 'fa-book-open'
];

const Library: React.FC<LibraryProps> = ({ onSelectProject }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    color: COLORS[0],
    icon: ICONS[0],
    template: ProjectTemplate.NOVEL
  });

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'p1',
      name: '量子意識與靈魂重啟',
      template: ProjectTemplate.NOVEL,
      color: '#7b61ff',
      icon: 'fa-brain',
      textColor: 'text-white',
      stats: { wordCount: 45000, updatedAt: Date.now() },
      modules: [
        { id: 'm1', title: '序章：觀測者', type: 'CHAPTER', content: '所有的現實都在被觀測的那一刻坍縮...', order: 0 },
        { id: 'm2', title: '角色：蘇格拉', type: 'CHARACTER', content: '年齡：不詳。能力：悖論偵測。', order: 1 }
      ],
      // Adding missing properties for Sidebar compatibility
      chapters: [
        { id: 'm1', title: '序章：觀測者', type: 'CHAPTER', content: '所有的現實都在被觀測的那一刻坍縮...', order: 0 }
      ],
      visualOutline: []
    },
    {
      id: 'p2',
      name: '末日異能：零號檔案',
      template: ProjectTemplate.NOVEL,
      color: '#ff5c00',
      icon: 'fa-dragon',
      textColor: 'text-white',
      stats: { wordCount: 12000, updatedAt: Date.now() },
      modules: [],
      chapters: [],
      visualOutline: []
    }
  ]);

  const handleCreate = () => {
    if (!newProject.name) return;
    const project: Project = {
      id: `p-${Date.now()}`,
      name: newProject.name,
      template: newProject.template,
      color: newProject.color,
      icon: newProject.icon,
      textColor: 'text-white',
      stats: { wordCount: 0, updatedAt: Date.now() },
      modules: [],
      chapters: [],
      visualOutline: []
    };
    setProjects([project, ...projects]);
    setShowCreate(false);
  };

  return (
    <div className="px-10 py-10 min-h-screen">
      {/* 天氣與頂部標題 */}
      <section className="mb-12">
        <div className="bg-white rounded-[40px] p-8 flex justify-between items-center text-black mb-10 shadow-xl overflow-hidden relative">
          <div className="z-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Weather Check</h2>
            <p className="text-4xl font-black tracking-tighter mt-1">15°C New York</p>
          </div>
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#ffc107] rounded-full blur-3xl opacity-20"></div>
          <i className="fa-solid fa-cloud-sun text-5xl opacity-80 z-10"></i>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
           <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">Smart Folders</h2>
           <button onClick={() => setShowCreate(true)} className="w-10 h-10 rounded-2xl bg-[#7b61ff] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
              <i className="fa-solid fa-plus"></i>
           </button>
        </div>
      </section>

      {/* Wallet Stack Cards */}
      <div className="stack-container">
        {projects.map((proj, idx) => (
          <div 
            key={proj.id}
            onClick={() => onSelectProject(proj)}
            className="stack-card"
            style={{ 
              backgroundColor: proj.color,
              zIndex: projects.length - idx
            }}
          >
            <div className="flex justify-between items-start mb-12">
               <div>
                  <div className="px-3 py-1 bg-black/10 backdrop-blur-md rounded-full w-fit mb-3">
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{proj.template}</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter leading-none">{proj.name}</h3>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-xl">
                  <i className={`fa-solid ${proj.icon} opacity-60`}></i>
               </div>
            </div>

            <div className="flex items-end justify-between">
               <div className="flex flex-col">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Words Counted</p>
                  <p className="text-xl font-black">{proj.stats.wordCount.toLocaleString()}</p>
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-black/20 ai-active-indicator"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 建立對話框 */}
      {showCreate && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowCreate(false)} />
           <div className="relative w-full max-w-lg bg-[#1c1c1e] rounded-[3.5rem] border border-white/5 p-10 shadow-2xl animate-in zoom-in duration-500">
              <h2 className="text-2xl font-black tracking-tighter mb-8">建立作品集資料夾</h2>
              <div className="space-y-8">
                 <input 
                   type="text" value={newProject.name} placeholder="作品名稱..." 
                   onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 h-16 rounded-2xl px-6 outline-none focus:border-[#7b61ff]/50 transition-all font-bold"
                 />
                 <div className="grid grid-cols-6 gap-3">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setNewProject({...newProject, color: c})} className={`h-10 rounded-xl ${newProject.color === c ? 'ring-2 ring-white ring-offset-4 ring-offset-[#1c1c1e]' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                 </div>
                 <div className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto no-scrollbar py-2">
                    {ICONS.map(i => (
                      <button key={i} onClick={() => setNewProject({...newProject, icon: i})} className={`h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl ${newProject.icon === i ? 'text-[#7b61ff] bg-[#7b61ff]/10' : 'text-gray-600'}`}>
                         <i className={`fa-solid ${i}`}></i>
                      </button>
                    ))}
                 </div>
                 <button onClick={handleCreate} className="w-full py-6 bg-[#7b61ff] rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em]">創建智慧資料夾</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Library;
