
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

  // 新增 240 選項
  const retentionOptions: (number | 'NEVER')[] = [30, 60, 90, 120, 180, 240, 360, 'NEVER'];

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* 頂部導航列 */}
      <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-5">
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 active:bg-white/10 transition-all border border-white/5"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">安全與備份</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.25em] mt-0.5">SECURITY & PROTECTION</p>
          </div>
        </div>
      </header>

      {/* 滾動內容區 */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-12 pb-44">
        <div className="max-w-2xl mx-auto space-y-12">
          
          {/* 系統保護機制說明卡片 */}
          <section className="bg-gradient-to-br from-[#1C1C1E] to-[#121214] rounded-[44px] p-10 border border-white/5 shadow-2xl space-y-6">
            <div className="flex items-center space-x-5 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-[#D4FF5F]/10 flex items-center justify-center text-[#D4FF5F] shadow-inner border border-[#D4FF5F]/20">
                <i className="fa-solid fa-shield-halved text-2xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-black text-white tracking-tight">系統保護機制</h4>
                <p className="text-[9px] text-[#D4FF5F] font-black uppercase tracking-[0.2em]">PROTECTION PROTOCOL</p>
              </div>
            </div>
            <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
              自動快照能確保您的文字在意外中獲得救贖。快照保留期限設定後，系統將根據您的選擇自動清理過期快照以節省空間，但<span className="text-[#D4FF5F]">「里程碑」版本將永遠保留</span>。
            </p>
          </section>

          {/* 自動快照主開關 */}
          <section className="bg-[#1C1C1E] rounded-[44px] p-8 border border-white/5 shadow-xl">
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
              
              {/* 自動快照清除期限 */}
              <section className="space-y-6">
                <div className="px-2">
                  <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center">
                    <i className="fa-solid fa-trash-can mr-3 text-red-500/60 text-xs"></i>
                    自動快照清除期限 CLEANUP PERIOD
                  </h3>
                </div>
                <div className="bg-[#1C1C1E] rounded-[44px] p-8 border border-white/5">
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
                   <div className="mt-8 p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                      <p className="text-[12px] text-amber-500/80 leading-relaxed font-bold">
                        <i className="fa-solid fa-circle-exclamation mr-2"></i>
                        僅自動快照受清理期限影響，里程碑版本將獲得終身永久保留保障，不受此限制。
                      </p>
                   </div>
                </div>
              </section>

              {/* 觸發與參數設定 */}
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 flex items-center">
                  <i className="fa-solid fa-sliders mr-3 text-blue-500/60 text-xs"></i>
                  觸發設定 TRIGGERING
                </h3>
                <div className="bg-[#1C1C1E] rounded-[44px] p-8 space-y-10 border border-white/5">
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
                        max={settings.autoSnapshotMode === 'interval' ? 15 : 120} 
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
                            ? ((settings.autoSnapshotIntervalMinutes - 1) / 14) * 100 
                            : ((settings.autoSnapshotIdleSeconds - 10) / 110) * 100
                          }%, #000 ${
                            settings.autoSnapshotMode === 'interval' 
                            ? ((settings.autoSnapshotIntervalMinutes - 1) / 14) * 100 
                            : ((settings.autoSnapshotIdleSeconds - 10) / 110) * 100
                          }%, #000 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 數據救贖保障說明 */}
          <section className="bg-gradient-to-tr from-[#1E293B] to-[#0F172A] p-10 rounded-[44px] border border-blue-600/10 flex flex-col items-center space-y-8 shadow-2xl relative overflow-hidden">
             <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl" />
             <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-600/20 shadow-lg">
               <i className="fa-solid fa-microchip text-3xl"></i>
             </div>
             <div className="space-y-4 text-center">
                <h4 className="text-[16px] font-black text-white uppercase tracking-[0.3em]">SAFEWRITE 數據救贖保障</h4>
                <p className="text-[14px] text-gray-400 leading-relaxed font-medium">
                  採用「本地先行」與「即時快照」技術。即使發生斷電或程式閃退，系統仍能精準救贖每一道創作思緒。
                </p>
             </div>
          </section>
        </div>
      </main>

      {/* 底部按鈕 */}
      <footer className="absolute bottom-0 inset-x-0 p-8 sm:p-12 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0">
         <div className="max-w-2xl mx-auto">
            <button 
              onClick={onClose}
              className="w-full py-7 bg-white text-black font-black text-sm uppercase tracking-[0.4em] rounded-[44px] shadow-2xl active:scale-[0.98] transition-all duration-300"
            >
               確 認 設 定
            </button>
         </div>
      </footer>
    </div>
  );
};

export default SecuritySettingsPage;
