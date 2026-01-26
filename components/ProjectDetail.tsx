
import React, { useState } from 'react';
import { Project, ModuleItem, ProjectTemplate } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onSelectModule: (id: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project: initialProject, onBack, onSelectModule }) => {
  const [project, setProject] = useState(initialProject);
  const [isEdit, setIsEdit] = useState(false);

  const moveModule = (idx: number, dir: 'up' | 'down') => {
    const newModules = [...project.modules];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= newModules.length) return;
    [newModules[idx], newModules[target]] = [newModules[target], newModules[idx]];
    setProject({ ...project, modules: newModules });
  };

  const renderSection = (title: string, icon: string, types: string[]) => {
    const items = project.modules.filter(m => types.includes(m.type));
    return (
      <div className="space-y-6">
         <div className="flex items-center space-x-3 px-2">
            <i className={`fa-solid ${icon} text-gray-500 text-xs`}></i>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{title}</h3>
         </div>
         <div className="grid gap-4">
            {items.map((item, i) => (
               <div 
                 key={item.id} 
                 onClick={() => !isEdit && onSelectModule(item.id)}
                 className="p-7 bg-[#1c1c1e] rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-[#7b61ff]/30 transition-all group"
               >
                  <div className="flex items-center space-x-5">
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#7b61ff]">
                        <i className={`fa-solid ${icon}`}></i>
                     </div>
                     <div>
                        <h4 className="text-base font-bold">{item.title}</h4>
                        <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mt-1">Ready for Sync</p>
                     </div>
                  </div>
                  {isEdit ? (
                    <div className="flex space-x-2">
                       <button onClick={(e) => { e.stopPropagation(); moveModule(i, 'up'); }} className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 hover:text-white"><i className="fa-solid fa-chevron-up"></i></button>
                       <button onClick={(e) => { e.stopPropagation(); moveModule(i, 'down'); }} className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 hover:text-white"><i className="fa-solid fa-chevron-down"></i></button>
                    </div>
                  ) : (
                    <i className="fa-solid fa-chevron-right text-gray-800"></i>
                  )}
               </div>
            ))}
            <button className="py-8 border-2 border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center space-x-3 text-gray-600 hover:text-[#7b61ff] hover:border-[#7b61ff]/20 transition-all">
               <i className="fa-solid fa-plus text-xs"></i>
               <span className="text-[10px] font-black uppercase tracking-widest">新增模組</span>
            </button>
         </div>
      </div>
    );
  };

  return (
    <div className="px-10 pb-40 animate-in slide-in-from-bottom-8 duration-700">
      <header className="py-10 flex items-center justify-between mb-8">
         <button onClick={onBack} className="w-14 h-14 rounded-[1.8rem] bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">
            <i className="fa-solid fa-chevron-left text-lg"></i>
         </button>
         <div className="flex items-center space-x-4">
            <button onClick={() => setIsEdit(!isEdit)} className={`text-[10px] font-black uppercase tracking-widest ${isEdit ? 'text-[#7b61ff]' : 'text-gray-500'}`}>
               {isEdit ? 'DONE' : 'SORT'}
            </button>
            <div className="w-1.5 h-1.5 rounded-full bg-[#7b61ff] shadow-[0_0_10px_#7b61ff]"></div>
         </div>
      </header>

      <section className="mb-14">
         <h2 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{project.name}</h2>
         <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-sm">智慧容器已啟動。每個模組均具備獨立加密路徑與 AI 偵測支援。</p>
      </section>

      <div className="space-y-16">
         {renderSection('稿件與章節流', 'fa-pen-nib', ['CHAPTER'])}
         {(project.template === ProjectTemplate.NOVEL) && renderSection('角色與世界觀', 'fa-user-ninja', ['CHARACTER', 'LORE'])}
         {renderSection('參考資料與備註', 'fa-note-sticky', ['NOTE', 'SOURCE'])}
      </div>
    </div>
  );
};

export default ProjectDetail;
