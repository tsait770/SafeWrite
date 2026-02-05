
import React from 'react';
import { SecuritySettings } from '../types';

interface SecuritySettingsPageProps {
  settings: SecuritySettings;
  onUpdate: (settings: SecuritySettings) => void;
  onClose: () => void;
}

const SecuritySettingsPage: React.FC<SecuritySettingsPageProps> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      <header className="h-24 px-8 pt-8 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:bg-white/10 transition-colors">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">安全與備份</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-0.5">SECURITY & BACKUP</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-8 pb-40">
        <div className="space-y-10 max-w-2xl mx-auto">
          {/* Section Header */}
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">安全與備份 SECURITY</h3>
          
          {/* Main Control Card (Mirroring provided reference images) */}
          <div className="bg-[#1C1C1E] rounded-[48px] p-8 space-y-10 border border-white/5 shadow-2xl">
            {/* Master Toggle Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">自動快照保護</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em] mt-1">AUTO SNAPSHOT MASTER</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdate({ ...settings, autoSnapshotEnabled: !settings.autoSnapshotEnabled })}
                className={`w-16 h-9 rounded-full flex items-center px-1.5 transition-all duration-300 ${settings.autoSnapshotEnabled ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings.autoSnapshotEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            {settings.autoSnapshotEnabled && (
              <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
                <div className="h-px bg-white/5 w-full" />
                
                {/* Snapshot Mode (Segmented Control) */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">觸發模式 SNAPSHOT MODE</p>
                  <div className="flex bg-black/40 rounded-[28px] p-1.5 h-16">
                    <button 
                      onClick={() => onUpdate({ ...settings, autoSnapshotMode: 'interval' })}
                      className={`flex-1 rounded-[22px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${settings.autoSnapshotMode === 'interval' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
                    >
                      固定時間制
                    </button>
                    <button 
                      onClick={() => onUpdate({ ...settings, autoSnapshotMode: 'idle' })}
                      className={`flex-1 rounded-[22px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${settings.autoSnapshotMode === 'idle' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
                    >
                      動作停止制
                    </button>
                  </div>
                </div>

                {/* Slider Control */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                      {settings.autoSnapshotMode === 'interval' ? '時間間隔 (分鐘)' : '停止輸入秒數 (秒)'}
                    </p>
                    <span className="text-[14px] font-black text-blue-400 uppercase tracking-tighter">
                      {settings.autoSnapshotMode === 'interval' ? `${settings.autoSnapshotIntervalMinutes} MIN` : `${settings.autoSnapshotIdleSeconds} SEC`}
                    </span>
                  </div>
                  
                  <div className="relative px-1">
                    {settings.autoSnapshotMode === 'interval' ? (
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="1"
                        value={settings.autoSnapshotIntervalMinutes}
                        onChange={(e) => onUpdate({ ...settings, autoSnapshotIntervalMinutes: parseInt(e.target.value) })}
                        className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{ background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((settings.autoSnapshotIntervalMinutes - 1) / 9) * 100}%, #000 ${((settings.autoSnapshotIntervalMinutes - 1) / 9) * 100}%, #000 100%)` }}
                      />
                    ) : (
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        step="5"
                        value={settings.autoSnapshotIdleSeconds}
                        onChange={(e) => onUpdate({ ...settings, autoSnapshotIdleSeconds: parseInt(e.target.value) })}
                        className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{ background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((settings.autoSnapshotIdleSeconds - 10) / 110) * 100}%, #000 ${((settings.autoSnapshotIdleSeconds - 10) / 110) * 100}%, #000 100%)` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional info section */}
          <div className="p-8 bg-blue-500/5 border border-white/5 rounded-[40px] flex items-start space-x-5">
             <i className="fa-solid fa-circle-info text-blue-500 text-xl mt-1"></i>
             <div className="space-y-2">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">系統保護機制</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium uppercase tracking-wider">
                  自動快照能確保您的文字在意外關閉或斷電時獲得救贖。動作停止制適合高頻創作，固定時間制適合沉浸式長篇書寫。
                </p>
             </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black to-transparent shrink-0">
         <button 
           onClick={onClose}
           className="w-full py-7 bg-white text-black font-black text-sm uppercase tracking-[0.4em] rounded-[32px] shadow-2xl active:scale-95 transition-all"
         >
            完 成 設 定
         </button>
      </footer>
    </div>
  );
};

export default SecuritySettingsPage;
