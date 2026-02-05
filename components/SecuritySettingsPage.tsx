
import React, { useState, useEffect } from 'react';
import { SecuritySettings } from '../types';

interface SecuritySettingsPageProps {
  settings: SecuritySettings;
  onUpdate: (settings: SecuritySettings) => void;
  onClose: () => void;
}

const SecuritySettingsPage: React.FC<SecuritySettingsPageProps> = ({ settings, onUpdate, onClose }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 新增 360D 選項
  const retentionOptions: (number | 'NEVER')[] = [30, 60, 90, 120, 150, 180, 360, 'NEVER'];

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0A0B] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* 頂部模糊導航列 */}
      <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-5">
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 active:bg-white/10 transition-all border border-white/5"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">安全與備份</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.25em] mt-0.5">SECURITY & PROTECTION</p>
          </div>
        </div>
      </header>

      {/* 滾動內容區 */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-12 pb-44">
        <div className="max-w-2xl mx-auto space-y-12">
          
          {/* 模組一：自動快照主開關 */}
          <section className="bg-[#1C1C1E] rounded-[40px] p-8 border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-inner">
                  <i className="fa-solid fa-clock-rotate-left text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white tracking-tight">自動快照保護</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">AUTO SNAPSHOT MASTER</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdate({ ...settings, autoSnapshotEnabled: !settings.autoSnapshotEnabled })}
                className={`w-20 h-10 rounded-full flex items-center px-1.5 transition-all duration-500 ${settings.autoSnapshotEnabled ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/10'}`}
              >
                <div className={`w-7 h-7 bg-white rounded-full shadow-lg transition-transform duration-500 cubic-bezier(0.19,1,0.22,1) ${settings.autoSnapshotEnabled ? 'translate-x-10' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

          {settings.autoSnapshotEnabled && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
              
              {/* 模組二：自動快照清除期限 */}
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 flex items-center">
                  <i className="fa-solid fa-clock-rotate-left mr-3 text-blue-500/60 text-xs"></i>
                  自動快照清除期限 CLEANUP PERIOD
                </h3>
                <div className="bg-[#1C1C1E] rounded-[40px] p-8 border border-white/5">
                   <div className="grid grid-cols-4 gap-3">
                      {retentionOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => onUpdate({ ...settings, autoSnapshotCleanupDays: option })}
                          className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                            settings.autoSnapshotCleanupDays === option 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40 scale-105' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
                          }`}
                        >
                          {option === 'NEVER' ? '永不' : `${option}D`}
                        </button>
                      ))}
                   </div>
                   <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-6 text-center italic">
                     * 僅自動快照受此限制影響，「里程碑」將永久留存。
                   </p>
                </div>
              </section>

              {/* 模組三：觸發與參數設定 */}
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 flex items-center">
                  <i className="fa-solid fa-sliders mr-3 text-blue-500/60 text-xs"></i>
                  觸發設定 TRIGGERING
                </h3>
                <div className="bg-[#1C1C1E] rounded-[40px] p-8 space-y-10 border border-white/5">
                  <div className="flex bg-black/40 rounded-[28px] p-1.5 h-16 border border-white/5">
                    <button 
                      onClick={() => onUpdate({ ...settings, autoSnapshotMode: 'interval' })}
                      className={`flex-1 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${settings.autoSnapshotMode === 'interval' ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      固定時間制
                    </button>
                    <button 
                      onClick={() => onUpdate({ ...settings, autoSnapshotMode: 'idle' })}
                      className={`flex-1 rounded-[22px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${settings.autoSnapshotMode === 'idle' ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      動作停止制
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="flex justify-between items-end px-1">
                      <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          {settings.autoSnapshotMode === 'interval' ? '時間間隔' : '靜止秒數'}
                        </p>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-0.5">Adjustment Range</p>
                      </div>
                      <span className="text-3xl font-black text-blue-400 tracking-tighter">
                        {settings.autoSnapshotMode === 'interval' ? `${settings.autoSnapshotIntervalMinutes} MIN` : `${settings.autoSnapshotIdleSeconds} SEC`}
                      </span>
                    </div>
                    
                    <div className="relative px-1 group">
                      <input 
                        type="range" 
                        min={settings.autoSnapshotMode === 'interval' ? 1 : 10} 
                        max={settings.autoSnapshotMode === 'interval' ? 10 : 120} 
                        step={settings.autoSnapshotMode === 'interval' ? 1 : 5}
                        value={settings.autoSnapshotMode === 'interval' ? settings.autoSnapshotIntervalMinutes : settings.autoSnapshotIdleSeconds}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (settings.autoSnapshotMode === 'interval') {
                            onUpdate({ ...settings, autoSnapshotIntervalMinutes: val });
                          } else {
                            onUpdate({ ...settings, autoSnapshotIdleSeconds: val });
                          }
                        }}
                        className="w-full h-3 bg-black rounded-full appearance-none cursor-pointer accent-blue-600 transition-all"
                        style={{ 
                          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                            settings.autoSnapshotMode === 'interval' 
                            ? ((settings.autoSnapshotIntervalMinutes - 1) / 9) * 100 
                            : ((settings.autoSnapshotIdleSeconds - 10) / 110) * 100
                          }%, #000 ${
                            settings.autoSnapshotMode === 'interval' 
                            ? ((settings.autoSnapshotIntervalMinutes - 1) / 9) * 100 
                            : ((settings.autoSnapshotIdleSeconds - 10) / 110) * 100
                          }%, #000 100%)`,
                          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 系統提示卡片：數據救贖保障 (對齊截圖與文字需求) */}
          <section className="p-10 bg-blue-600/5 border border-blue-600/10 rounded-[48px] flex flex-col items-center space-y-8 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10" />
             <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-600/20 shadow-lg">
               <i className="fa-solid fa-shield-halved text-3xl"></i>
             </div>
             <div className="space-y-6 text-center w-full">
                <div className="space-y-1">
                   <h4 className="text-[15px] font-black text-blue-500 uppercase tracking-[0.25em]">SAFEWRITE 數據救贖保障</h4>
                   <p className="text-[9px] text-blue-500/60 font-black uppercase tracking-[0.15em]">DATA REDEMPTION PROTOCOL</p>
                </div>
                <div className="space-y-6">
                   <p className="text-[14px] text-gray-400 leading-relaxed font-medium px-4">
                     採用「本地先行」與「即時快照」技術。即使發生斷電或程式閃退，系統仍能精準救贖每一道創作思緒。
                   </p>
                   <div className="p-6 bg-black/40 rounded-[28px] border border-white/5">
                      <p className="text-[13px] text-white leading-relaxed font-bold">
                        <span className="mr-2">📌</span>
                        僅自動快照受清理期限影響，里程碑版本將獲得終身永久保留保障，不受此限制。
                      </p>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>

      {/* 底部功能按鈕 */}
      <footer className="absolute bottom-0 inset-x-0 p-8 sm:p-12 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0">
         <div className="max-w-2xl mx-auto">
            <button 
              onClick={onClose}
              className="w-full py-7 bg-white text-black font-black text-sm uppercase tracking-[0.4em] rounded-[32px] shadow-[0_25px_60px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all duration-300 hover:bg-slate-100"
            >
               確 認 設 定
            </button>
         </div>
      </footer>
    </div>
  );
};

export default SecuritySettingsPage;
