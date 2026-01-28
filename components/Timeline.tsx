
import React, { useState } from 'react';
import { VersionSnapshot, SnapshotType, MembershipLevel } from '../types';

interface TimelineProps {
  history: VersionSnapshot[];
  onClose: () => void;
  onRestore: (snapshot: VersionSnapshot) => void;
  onPreview: (snapshot: VersionSnapshot) => void;
  onCreateMilestone: () => void;
  onClearAuto: () => void;
  membership?: MembershipLevel;
}

const Timeline: React.FC<TimelineProps> = ({ 
  history, 
  onClose, 
  onRestore, 
  onPreview,
  onCreateMilestone,
  onClearAuto,
  membership = MembershipLevel.FREE
}) => {
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleRestoreClick = (snapshot: VersionSnapshot) => {
    setRestoringId(snapshot.id);
    onRestore(snapshot);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0F0F10] border-l border-white/5 shadow-2xl flex flex-col h-full rounded-l-[44px] overflow-hidden animate-in slide-in-from-right duration-500 text-slate-200">
        <div className="flex justify-center pt-4 shrink-0">
          <div className="w-14 h-1.5 bg-slate-800 rounded-full" />
        </div>

        <header className="px-10 pt-6 pb-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-[14px] font-black text-white uppercase tracking-[0.4em]">時光機</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-1">TIME MACHINE MGMT</p>
          </div>
          <button 
            onClick={onCreateMilestone}
            className="px-5 py-2.5 rounded-xl border border-blue-500/30 bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95"
          >
            標記里程碑
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-12 no-scrollbar relative">
          {/* Live Edition: 呼吸燈動畫 */}
          <div className="flex items-center space-x-5 mb-12">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Live Edition</span>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">系統正在監控增量變化...</p>
            </div>
          </div>

          {/* 垂直線性軸 */}
          <div className="absolute left-[47px] top-32 bottom-20 w-[1px] bg-white/5" />

          <div className="space-y-12 relative">
            {history.length === 0 ? (
              <div className="pl-14 pt-2">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest italic leading-relaxed">
                  目前尚無快照記錄。<br/>創作兩分鐘後系統將自動開始執行。
                </p>
              </div>
            ) : (
              history.map((snapshot) => (
                <div key={snapshot.id} className={`flex group transition-all duration-300 ${restoringId === snapshot.id ? 'opacity-40' : ''}`}>
                  {/* 版本節點樣式 */}
                  <div className="w-4 h-4 rounded-full mt-1 shrink-0 z-10 mr-10 transition-transform group-hover:scale-125 ring-[6px] ring-[#0F0F10]">
                    {snapshot.type === SnapshotType.MILESTONE ? (
                      <div className="w-full h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-slate-700 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {new Date(snapshot.timestamp).toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      {snapshot.type === SnapshotType.MILESTONE && (
                        <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded uppercase tracking-widest">
                          MILESTONE
                        </span>
                      )}
                    </div>
                    
                    <p 
                      className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4 cursor-pointer hover:text-white transition-colors font-serif-editor"
                      onClick={() => onPreview(snapshot)}
                    >
                      {snapshot.content.trim() || '空內容快照'}
                    </p>

                    <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleRestoreClick(snapshot)} 
                        disabled={restoringId !== null}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 hover:text-blue-400 flex items-center space-x-2"
                      >
                        {restoringId === snapshot.id ? (
                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <i className="fa-solid fa-rotate-left"></i>
                        )}
                        <span>{restoringId === snapshot.id ? 'Restoring' : 'Restore'}</span>
                      </button>
                      <button onClick={() => onPreview(snapshot)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white">
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        <footer className="p-10 bg-black/20 border-t border-white/5 space-y-6 shrink-0">
          <div className="flex items-start space-x-4 opacity-50">
             <i className="fa-solid fa-shield-halved text-amber-500 mt-1"></i>
             <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">
               所有快照均採增量技術，不佔用額外儲存空間。自動快照將在 30 天後自動清理。
             </p>
          </div>
          <div className="flex justify-between items-center px-2 pt-2">
             <button className="text-[10px] font-black text-blue-600 hover:text-blue-500 uppercase tracking-[0.3em]">
                容量管理
             </button>
             <button 
               onClick={onClearAuto}
               className="flex items-center space-x-2 text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-[0.3em] transition-all"
             >
                <i className="fa-regular fa-trash-can"></i>
                <span>清除自動快照</span>
             </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Timeline;
