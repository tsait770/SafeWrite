import React from 'react';
import { VersionSnapshot, SnapshotType } from '../types';

interface TimelineProps {
  history: VersionSnapshot[];
  onClose: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 z-[700] bg-[#0F0F10]/95 backdrop-blur-3xl flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-center pt-3 mb-4">
        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
      </div>
      
      <header className="px-8 pb-6 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-[13px] font-black text-white uppercase tracking-[0.3em]">時光機 TIME MACHINE</h2>
        <button className="px-5 py-2 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">標記里程碑</button>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar">
        {/* Live Status - Image 1/10 */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="relative">
            <div className="w-3.5 h-3.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            <div className="absolute inset-0 w-3.5 h-3.5 bg-blue-400 rounded-full animate-ping opacity-70" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">LIVE EDITION</span>
        </div>

        <div className="relative border-l border-white/5 ml-1.5 pl-10 space-y-12 pb-20">
          {[
            { id: 'v1', time: '07:47:08', content: 'Empty Version', type: SnapshotType.MILESTONE },
            { id: 'v2', time: '07:46:51', content: 'Empty Version', type: SnapshotType.AUTO }
          ].map((v) => (
            <div key={v.id} className="relative">
              <div className={`absolute -left-[48px] top-1.5 w-4 h-4 rounded-full ring-[6px] ring-[#0F0F10] ${v.type === SnapshotType.MILESTONE ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`} />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">{v.time}</span>
                  <p className="text-blue-400 text-sm font-bold mt-2 hover:underline cursor-pointer">{v.content}</p>
                </div>
                {v.type === SnapshotType.MILESTONE && (
                  <span className="text-[9px] font-black border border-amber-500/30 text-amber-500/60 px-2 py-0.5 rounded uppercase tracking-widest">MILESTONE</span>
                )}
              </div>
              
              <div className="flex items-center space-x-6 mt-4">
                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">RESTORE</button>
                <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">PREVIEW</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-8 bg-black/40 border-t border-white/5 space-y-6">
        <div className="flex items-start space-x-4">
           <svg className="w-5 h-5 text-amber-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0z"/></svg>
           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-relaxed">TIP: 里程碑版本為永久儲存。自動快照將在 30 天後自動執行清理程序。</p>
        </div>
        <div className="flex justify-between items-center px-2">
           <button className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">STORAGE MGMT</button>
           <button className="flex items-center space-x-2 text-[11px] font-black text-red-500/80 uppercase tracking-[0.2em]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span>CLEAR AUTO</span>
           </button>
        </div>
      </footer>
    </div>
  );
};

export default Timeline;