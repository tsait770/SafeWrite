
import React, { useState } from 'react';
import { VersionSnapshot, MembershipLevel, SnapshotType } from '../types';

interface TimelineProps {
  history: VersionSnapshot[];
  membership: MembershipLevel;
  isNight: boolean;
  onRestore: (snapshot: VersionSnapshot) => void;
  onPreview: (snapshot: VersionSnapshot) => void;
  onCreateMilestone: () => void;
  onClearSnapshots: () => void;
  onClose: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  history, 
  membership, 
  onCreateMilestone, 
  onRestore, 
  onPreview, 
  onClearSnapshots,
  onClose 
}) => {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleRestoreClick = (snapshot: VersionSnapshot) => {
    setRestoringId(snapshot.id);
    onRestore(snapshot);
    // 模擬恢復延遲
    setTimeout(() => setRestoringId(null), 800);
  };

  const handleClearClick = () => {
    if (window.confirm('確定要清除所有自動快照嗎？這將只保留「里程碑」版本。')) {
      setIsClearing(true);
      setTimeout(() => {
        onClearSnapshots();
        setIsClearing(false);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0F0F10] border-l border-white/5 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-500 text-slate-200">
        {/* Header */}
        <div className="p-8 border-b border-white/5 shrink-0">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-white">時光機</h2>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">TIME MACHINE MANAGEMENT</p>
            </div>
            <button
              onClick={onCreateMilestone}
              className="px-5 py-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95"
            >
              標記里程碑
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar relative">
          {/* Live Status */}
          <div className="flex items-center space-x-4 mb-10">
            <div className="relative">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
              <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">LIVE EDITION ACTIVE</span>
          </div>

          {/* Vertical Timeline Axis */}
          <div className="absolute left-[43px] top-24 bottom-24 w-px bg-white/5" />

          <div className="space-y-12 relative">
            {history.length === 0 ? (
              <div className="pl-12 pt-4">
                <p className="text-[11px] text-slate-600 leading-relaxed uppercase tracking-widest italic">
                  系統正在監控變動...<br/>每隔 2 分鐘將自動執行增量快照。
                </p>
              </div>
            ) : (
              history.map((snapshot) => (
                <div key={snapshot.id} className={`flex group transition-all duration-300 ${restoringId === snapshot.id ? 'opacity-40 translate-x-2' : ''}`}>
                  {/* Version Node */}
                  <div className="w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 mr-8 transition-transform group-hover:scale-125 ring-[6px] ring-[#0F0F10]">
                    {snapshot.type === SnapshotType.MILESTONE ? (
                      <div className="w-full h-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)] rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-slate-700 rounded-full" />
                    )}
                  </div>

                  {/* Version Detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {new Date(snapshot.timestamp).toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      {snapshot.type === SnapshotType.MILESTONE && (
                        <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded tracking-widest">
                          MILESTONE
                        </span>
                      )}
                    </div>
                    
                    <p 
                      className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4 cursor-pointer hover:text-white transition-colors font-serif-editor" 
                      onClick={() => onPreview(snapshot)}
                    >
                      {snapshot.content.trim() || '空版本記錄'}
                    </p>

                    <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleRestoreClick(snapshot)} 
                        disabled={restoringId !== null}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 hover:text-blue-400 flex items-center space-x-2"
                      >
                        {restoringId === snapshot.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span>正在還原</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-rotate-left"></i>
                            <span>RESTORE</span>
                          </>
                        )}
                      </button>
                      <button onClick={() => onPreview(snapshot)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-300">
                        PREVIEW
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
          <div className="flex items-start space-x-4">
            <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest">
              提示：里程碑版本將永久保留。自動生成的快照將在 30 天後進入循環清理程序。
            </p>
          </div>
          <div className="flex items-center justify-between px-2">
            <button className="text-[10px] font-black text-blue-600 hover:text-blue-500 uppercase tracking-[0.3em] transition-colors">
              STORAGE MGMT
            </button>
            <button 
              onClick={handleClearClick}
              disabled={isClearing}
              className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-[0.3em] transition-all flex items-center space-x-2"
            >
              {isClearing ? (
                <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <i className="fa-regular fa-trash-can text-sm"></i>
              )}
              <span>CLEAR AUTO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
