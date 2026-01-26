
import React from 'react';
import { VersionSnapshot, SnapshotType } from '../types';

interface TimelineProps {
  history: VersionSnapshot[];
  onClose: () => void;
  onRestore: (snapshot: VersionSnapshot) => void;
  onPreview: (snapshot: VersionSnapshot) => void;
  onCreateMilestone: () => void;
  onClearAuto: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  history, 
  onClose, 
  onRestore, 
  onPreview,
  onCreateMilestone,
  onClearAuto
}) => {
  return (
    <div className="fixed inset-0 z-[1000] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0F0F10] border-l border-white/5 shadow-2xl flex flex-col h-full rounded-l-[40px] overflow-hidden animate-in slide-in-from-right duration-500">
        <div className="flex justify-center pt-3 mb-4">
          <div className="w-12 h-1.5 bg-white/10 rounded-full" />
        </div>

        <header className="px-8 pb-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">時光機 TIME MACHINE</h2>
          </div>
          <button 
            onClick={onCreateMilestone}
            className="px-4 py-2 rounded-lg border border-[#7b61ff]/30 bg-[#7b61ff]/5 text-[#7b61ff] text-[10px] font-black uppercase tracking-[0.1em] hover:bg-[#7b61ff]/10 transition-all"
          >
            標記里程碑
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12">
          {/* LIVE STATUS */}
          <div className="flex items-center space-x-4 mb-10">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-70" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">LIVE EDITION</span>
              <p className="text-[9px] text-[#8E8E93] italic mt-1 leading-relaxed">系統正在待命，每隔 2 分鐘將執行增量快照</p>
            </div>
          </div>

          <div className="relative border-l border-white/10 ml-2 pl-10 space-y-12 pb-20">
            {history.length > 0 ? (
              history.map((snapshot) => (
                <div key={snapshot.id} className="relative group">
                  {/* Timeline Point */}
                  <div className={`absolute -left-[48px] top-1.5 w-4 h-4 rounded-full ring-[6px] ring-[#0F0F10] transition-all ${
                    snapshot.type === SnapshotType.MILESTONE 
                    ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                    : 'bg-white/20'
                  }`} />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.25em]">
                        {new Date(snapshot.timestamp).toLocaleTimeString('zh-TW', { hour12: false })}
                      </span>
                      <p className="text-white text-sm font-bold mt-2 leading-tight">
                        {snapshot.title || (snapshot.content.slice(0, 20) + '...')}
                      </p>
                    </div>
                    {snapshot.type === SnapshotType.MILESTONE && (
                      <span className="text-[8px] font-black border border-amber-500/40 text-amber-500/80 px-2 py-0.5 rounded uppercase tracking-widest">
                        MILESTONE
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-4">
                    <button 
                      onClick={() => onRestore(snapshot)}
                      className="text-[10px] font-black text-[#7b61ff] uppercase tracking-widest hover:text-white transition-colors"
                    >
                      RESTORE
                    </button>
                    <button 
                      onClick={() => onPreview(snapshot)}
                      className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest hover:text-white transition-colors"
                    >
                      PREVIEW
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="relative">
                <div className="absolute -left-[48px] top-1.5 w-4 h-4 rounded-full ring-[6px] ring-[#0F0F10] bg-white/10" />
                <p className="text-xs text-[#8E8E93] italic">尚無歷史快照記錄</p>
              </div>
            )}
          </div>
        </main>

        <footer className="p-8 bg-black/40 border-t border-white/5 space-y-6">
          <div className="flex items-start space-x-4">
             <i className="fa-solid fa-circle-info text-amber-500/60 mt-0.5"></i>
             <p className="text-[9px] text-[#8E8E93] uppercase font-black tracking-widest leading-[1.6]">
               TIP: 里程碑版本為永久儲存。自動快照將在 30 天後自動執行清理程序。
             </p>
          </div>
          <div className="flex justify-between items-center px-2">
             <button className="text-[10px] font-black text-[#7b61ff] uppercase tracking-[0.2em] hover:text-white transition-all">
                STORAGE MGMT
             </button>
             <button 
               onClick={onClearAuto}
               className="flex items-center space-x-2 text-[10px] font-black text-red-500/70 uppercase tracking-[0.2em] hover:text-red-500 transition-all"
             >
                <i className="fa-regular fa-trash-can"></i>
                <span>CLEAR AUTO</span>
             </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Timeline;
