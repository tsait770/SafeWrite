
import React from 'react';
import { Project, WritingModule, ModuleType } from '../types';
import { TEMPLATES } from '../constants';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onOpenModule: (moduleId: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onOpenModule }) => {
  const templateInfo = TEMPLATES[project.writingType];

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-500">
      <header className="px-8 pt-6 pb-10">
         <button 
           onClick={onBack}
           className="mb-8 flex items-center space-x-2 text-[#8e8e93] hover:text-white transition-colors"
         >
           <i className="fa-solid fa-chevron-left text-xs"></i>
           <span className="text-[10px] font-black uppercase tracking-widest">BACK TO REPOSITORY</span>
         </button>
         
         <div className="flex items-start justify-between">
            <div className="space-y-2">
               <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{backgroundColor: project.color, color: '#121212'}}>
                     <i className={`fa-solid ${project.icon}`}></i>
                  </div>
                  <h1 className="text-4xl font-black tracking-tighter">{project.name}</h1>
               </div>
               <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8e8e93] pl-16">
                  <span>{templateInfo.label}</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{project.progress}% 完成度</span>
               </div>
            </div>
            
            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
               <i className="fa-solid fa-gear text-[#8e8e93]"></i>
            </button>
         </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 space-y-12">
         {/* Module Grid */}
         <section>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-[11px] font-black text-[#8e8e93] uppercase tracking-[0.2em]">模組功能引擎 MODULE ENGINE</h2>
               <div className="flex-1 h-px bg-white/10 ml-6" />
            </div>

            <div className="grid grid-cols-1 gap-4">
               {project.modules.sort((a,b) => a.order - b.order).map((module) => (
                  <button 
                    key={module.id}
                    onClick={() => onOpenModule(module.id)}
                    className="group relative bg-[#1C1C1E] border border-white/5 rounded-[32px] p-8 flex items-center justify-between text-left transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-blue-500/30 overflow-hidden"
                  >
                     <div className="absolute top-0 left-0 w-1.5 h-full transition-colors group-hover:bg-blue-500 bg-white/5" />
                     <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <i className={`fa-solid ${module.icon}`}></i>
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white mb-1">{module.title}</h3>
                           <p className="text-[10px] font-black text-[#8e8e93] uppercase tracking-widest">{module.description}</p>
                        </div>
                     </div>
                     <i className="fa-solid fa-chevron-right text-[#8e8e93] group-hover:translate-x-1 transition-transform"></i>
                  </button>
               ))}
            </div>
         </section>

         {/* Project Stats / Insights */}
         <section className="bg-gradient-to-tr from-blue-600/10 to-transparent p-10 rounded-[44px] border border-white/5">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">寫作洞察 INSIGHTS</h3>
            <div className="grid grid-cols-3 gap-8">
               <div>
                  <p className="text-[9px] font-black text-[#8e8e93] uppercase tracking-widest mb-1">總字數</p>
                  <p className="text-2xl font-black">12,402</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-[#8e8e93] uppercase tracking-widest mb-1">創作天數</p>
                  <p className="text-2xl font-black">24 Days</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-[#8e8e93] uppercase tracking-widest mb-1">今日增長</p>
                  <p className="text-2xl font-black text-green-500">+850</p>
               </div>
            </div>
         </section>
      </main>

      <div className="fixed bottom-32 left-8 right-8 pointer-events-none">
         <button className="w-full h-24 bg-blue-600 rounded-[30px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 flex items-center justify-center space-x-4 pointer-events-auto active:scale-95 transition-all">
            <i className="fa-solid fa-bolt-lightning text-xl"></i>
            <span>進入創作流進入主稿</span>
         </button>
      </div>
    </div>
  );
};

export default ProjectDetail;
