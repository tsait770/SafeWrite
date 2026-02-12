
import React, { useState, useEffect } from 'react';
import { AIPreferences } from '../types';
import { geminiService } from '../services/geminiService';
import { AI_MODEL_GROUPS } from '../constants';

interface AIPreferencesProps {
  preferences: AIPreferences;
  onUpdate: (prefs: AIPreferences) => void;
  onClose: () => void;
}

const AIPreferencesPage: React.FC<AIPreferencesProps> = ({ preferences, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'GUIDE'>('SETTINGS');
  const [testStatus, setTestStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [customKey, setCustomKey] = useState('');
  const [customModelId, setCustomModelId] = useState(preferences.customModel || '');
  const [hasSelectedKey, setHasSelectedKey] = useState(false);

  // 檢查當前是否有已選擇的 API Key
  useEffect(() => {
    const checkKeyStatus = async () => {
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasSelectedKey(selected);
      }
    };
    checkKeyStatus();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // 緩解 Race Condition
      setHasSelectedKey(true);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus('LOADING');
    // 如果是手動輸入金鑰，則使用手動的金鑰進行測試
    const targetKey = preferences.provider === 'CUSTOM' ? customKey : (process.env.API_KEY || '');
    const success = await geminiService.testConnection(targetKey, 'GOOGLE');
    setTestStatus(success ? 'SUCCESS' : 'ERROR');
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden font-sans">
      
      {/* 頂部導航列 - 採用玻璃擬態與線性對齊 */}
      <header className="h-24 px-8 pt-8 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-5">
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 active:bg-white/10 transition-all border border-white/5"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">AI 助理偏好</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.25em] mt-0.5">AI ASSISTANT PREFERENCES</p>
          </div>
        </div>
        
        {/* 切換分頁控制器 */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SETTINGS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
          >
            偏好設定
          </button>
          <button 
            onClick={() => setActiveTab('GUIDE')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GUIDE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
          >
            申請教學
          </button>
        </div>
      </header>

      {/* 主內容滾動區 */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-12 pb-48">
        
        {activeTab === 'SETTINGS' ? (
          <div className="space-y-14 max-w-2xl mx-auto">
            
            {/* 1. 寫作性格 Personality */}
            <section className="space-y-5">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center">
                 <i className="fa-solid fa-wand-sparkles mr-3 text-purple-500 text-xs"></i>
                 寫作性格 AI PERSONALITY
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'CREATIVE', label: '創意無限', sub: '生動且極具想像力', icon: 'fa-wand-magic-sparkles', color: '#B2A4FF', text: 'text-purple-400' },
                  { id: 'PROFESSIONAL', label: '專業嚴謹', sub: '精確的邏輯與語法', icon: 'fa-briefcase', color: '#7b61ff', text: 'text-blue-400' },
                  { id: 'ACADEMIC', label: '學術邏輯', sub: '嚴格遵循研究標準', icon: 'fa-graduation-cap', color: '#D4FF5F', text: 'text-green-400' },
                  { id: 'CASUAL', label: '輕鬆生活', sub: '如好友般的交談', icon: 'fa-mug-hot', color: '#FF9F7A', text: 'text-orange-400' }
                ].map((tone) => (
                  <button 
                    key={tone.id}
                    onClick={() => onUpdate({ ...preferences, tone: tone.id as any })}
                    className={`p-6 rounded-[32px] border transition-all text-left flex flex-col items-start space-y-4 ${preferences.tone === tone.id ? 'bg-blue-600 border-blue-600 shadow-2xl' : 'bg-[#1C1C1E] border-white/5 opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${preferences.tone === tone.id ? 'bg-white/20 text-white' : 'bg-black/20 ' + tone.text}`}>
                      <i className={`fa-solid ${tone.icon}`}></i>
                    </div>
                    <div>
                       <span className={`text-base font-black tracking-tight ${preferences.tone === tone.id ? 'text-white' : 'text-gray-200'}`}>{tone.label}</span>
                       <p className={`text-[10px] font-bold mt-1 ${preferences.tone === tone.id ? 'text-white/60' : 'text-gray-600'}`}>{tone.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 2. 模型配置 Model Config */}
            <section className="space-y-5">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center">
                 <i className="fa-solid fa-microchip mr-3 text-blue-500 text-xs"></i>
                 模型配置 MODEL CONFIG
              </h3>
              <div className="bg-[#1C1C1E] rounded-[44px] border border-white/5 overflow-hidden shadow-xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">目前啟用引擎: <span className="text-blue-500">{preferences.selectedModel.toUpperCase()}</span></p>
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                </div>
                <div className="max-h-[340px] overflow-y-auto no-scrollbar p-6 space-y-8">
                  {AI_MODEL_GROUPS.map((group) => (
                    <div key={group.name} className="space-y-3">
                       <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-2">{group.name}</h4>
                       <div className="grid grid-cols-1 gap-1.5">
                          {group.models.map(model => (
                            <button 
                              key={model.id}
                              onClick={() => onUpdate({ ...preferences, selectedModel: model.id })}
                              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${preferences.selectedModel === model.id ? 'bg-blue-600 text-white shadow-xl scale-[1.01]' : 'hover:bg-white/5 text-gray-500'}`}
                            >
                               <div className="flex items-center space-x-4">
                                  <span className={`w-2 h-2 rounded-full ${preferences.selectedModel === model.id ? 'bg-white shadow-[0_0_10px_white]' : 'bg-transparent'}`}></span>
                                  <span className="text-[15px] font-black tracking-tight">{model.name}</span>
                                  {model.isRecommended && <span className={`text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-widest ${preferences.selectedModel === model.id ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-500'}`}>Recommended</span>}
                               </div>
                               {preferences.selectedModel === model.id && <i className="fa-solid fa-circle-check text-white"></i>}
                            </button>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. 使用預算管理 AI USAGE BUDGET */}
            <section className="space-y-5">
               <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center">
                  <i className="fa-solid fa-chart-line mr-3 text-emerald-500 text-xs"></i>
                  使用預算管理 AI USAGE BUDGET
               </h3>
               <div className="bg-[#1C1C1E] p-10 rounded-[44px] border border-white/5 space-y-10 shadow-2xl">
                  <div className="space-y-6">
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">每月消耗上限 (USD)</p>
                           <p className="text-[9px] text-gray-600 font-bold mt-1 tracking-tight">SYSTEM AUTO-THROTTLE THRESHOLD</p>
                        </div>
                        <div className="flex items-baseline space-x-2">
                           <span className="text-gray-600 text-sm font-black">$</span>
                           <input 
                              type="number"
                              value={preferences.budgetLimit}
                              onChange={(e) => onUpdate({...preferences, budgetLimit: parseFloat(e.target.value) || 0})}
                              className="w-24 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-right text-xl font-black text-white focus:border-blue-600 outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                           <span className="text-gray-500">已消耗: <span className="text-white">${preferences.currentUsage.toFixed(2)}</span></span>
                           <span className={preferences.currentUsage >= preferences.budgetLimit ? 'text-red-500' : 'text-blue-500'}>
                              {Math.min(100, Math.floor((preferences.currentUsage / (preferences.budgetLimit || 1)) * 100))}%
                           </span>
                        </div>
                        <div className="h-3 w-full bg-black rounded-full overflow-hidden p-0.5 border border-white/5">
                           <div 
                              className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) ${preferences.currentUsage >= preferences.budgetLimit ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`} 
                              style={{ width: `${Math.min(100, (preferences.currentUsage / (preferences.budgetLimit || 1)) * 100)}%` }}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-5 pt-10 border-t border-white/5">
                     <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">當預算超標時之系統協議</label>
                     <div className="grid grid-cols-1 gap-2.5">
                        {[
                          { id: 'STOP', label: '暫停 AI 服務', sub: '確保不產生額外費用', icon: 'fa-circle-stop' },
                          { id: 'SWITCH', label: '切換至低成本模型', sub: '使用 Flash 引擎節省支出', icon: 'fa-arrows-rotate' },
                          { id: 'NOTIFY', label: '僅發送通知提醒', sub: '不中斷創作流程', icon: 'fa-bell' }
                        ].map(action => (
                          <button 
                            key={action.id}
                            onClick={() => onUpdate({...preferences, onLimitAction: action.id as any})}
                            className={`flex items-center justify-between p-5 rounded-[24px] border transition-all ${preferences.onLimitAction === action.id ? 'bg-white text-black border-white shadow-xl scale-[1.01]' : 'bg-black/20 border-white/5 text-gray-500'}`}
                          >
                             <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${preferences.onLimitAction === action.id ? 'bg-black/5 text-black' : 'bg-white/5'}`}>
                                   <i className={`fa-solid ${action.icon}`}></i>
                                </div>
                                <div className="text-left">
                                   <span className="text-sm font-black tracking-tight">{action.label}</span>
                                   <p className={`text-[9px] font-bold tracking-tight ${preferences.onLimitAction === action.id ? 'text-black/50' : 'text-gray-700'}`}>{action.sub}</p>
                                </div>
                             </div>
                             {preferences.onLimitAction === action.id && <i className="fa-solid fa-circle-check"></i>}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* 4. 自定義模型設定 CUSTOM MODEL - 根據參考圖優化 */}
            <section className="space-y-5">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center">
                   <i className="fa-solid fa-key mr-3 text-amber-500 text-xs"></i>
                   自定義模型設定 CUSTOM MODEL
                </h3>
                <span className="text-[10px] font-black bg-[#FADE4B] text-black px-4 py-1 rounded-lg uppercase tracking-widest border-none font-sans">PROFESSIONAL</span>
              </div>
              <div className="bg-[#1C1C1E] p-10 rounded-[44px] border border-white/5 space-y-10 shadow-2xl">
                <div className="flex flex-col space-y-8">
                   
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">API PROVIDER / SERVICE</label>
                      <div className="relative">
                         <select 
                           value={preferences.provider}
                           onChange={(e) => onUpdate({ ...preferences, provider: e.target.value as any })}
                           className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-base font-black text-white outline-none focus:border-blue-600 appearance-none transition-all"
                         >
                           <option value="DEFAULT" className="bg-[#1C1C1E]">SafeWrite Proxy Gateway</option>
                           <option value="CUSTOM" className="bg-[#1C1C1E]">OpenAI / Claude / Others</option>
                         </select>
                         <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none text-xs"></i>
                      </div>
                   </div>

                   {preferences.provider === 'DEFAULT' ? (
                     /* Google API Key Authorization 引導 (SafeWrite Proxy) */
                     <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">GOOGLE API KEY AUTHORIZATION</label>
                           <div className="p-10 bg-[#1A2538]/60 border border-blue-500/20 rounded-[2.5rem] relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-30"></div>
                              <p className="text-[14px] text-gray-300 leading-relaxed font-medium relative z-10">
                                為了使用高品質模型與視訊生成，您必須授權一個來自付費 Google Cloud 專案的 API Key。
                              </p>
                              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-400/40 hover:text-blue-300 transition-all relative z-10">
                                查看帳單設定與計費說明
                              </a>
                           </div>
                        </div>

                        <button 
                          onClick={handleSelectKey}
                          className={`w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-4 transition-all shadow-xl active:scale-[0.98] ${
                            hasSelectedKey ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-blue-600 text-white shadow-blue-900/30'
                          }`}
                        >
                          {hasSelectedKey ? (
                             <><i className="fa-solid fa-circle-check text-base"></i><span>已授權付費 API KEY</span></>
                          ) : (
                             <><i className="fa-solid fa-key"></i><span>選擇 Google Cloud API KEY</span></>
                          )}
                        </button>
                     </div>
                   ) : (
                     /* 手動輸入金鑰 (OpenAI / Claude / Others) */
                     <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">GOOGLE API KEY (必填)</label>
                           <div className="relative">
                              <input 
                                type="password"
                                value={customKey}
                                onChange={(e) => setCustomKey(e.target.value)}
                                placeholder="在此貼上您的 API Key..."
                                className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-base font-black text-white outline-none focus:border-blue-600 transition-all placeholder-white/5"
                              />
                              <i className="fa-solid fa-shield-halved absolute right-6 top-1/2 -translate-y-1/2 text-gray-800"></i>
                           </div>
                        </div>
                     </div>
                   )}

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">MODEL ID / VERSION IDENTIFIER</label>
                      <input 
                        type="text"
                        value={customModelId}
                        onChange={(e) => {
                          setCustomModelId(e.target.value);
                          onUpdate({...preferences, customModel: e.target.value});
                        }}
                        placeholder="例如: gemini-3-pro-preview"
                        className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-lg font-black text-white outline-none focus:border-blue-600 transition-all placeholder-white/5"
                      />
                   </div>

                   <button 
                      onClick={handleTestConnection}
                      disabled={(preferences.provider === 'CUSTOM' && !customKey) || (preferences.provider === 'DEFAULT' && !hasSelectedKey) || testStatus === 'LOADING'}
                      className={`w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-4 transition-all shadow-xl active:scale-[0.98] ${
                        testStatus === 'SUCCESS' ? 'bg-green-600 text-white shadow-green-900/20' :
                        testStatus === 'ERROR' ? 'bg-red-600 text-white shadow-red-900/20' :
                        'bg-[#2C2C2E] text-gray-400 border border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {testStatus === 'LOADING' ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <i className={`fa-solid ${testStatus === 'SUCCESS' ? 'fa-check-circle' : testStatus === 'ERROR' ? 'fa-circle-exclamation' : 'fa-bolt-lightning'}`}></i>
                      )}
                      <span>{
                        testStatus === 'LOADING' ? '正在測試連線協定...' :
                        testStatus === 'SUCCESS' ? '連線成功 SUCCESS' :
                        testStatus === 'ERROR' ? '連線失敗 ERROR' :
                        '測試 API 連線 TEST CONNECTION'
                      }</span>
                    </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* 教學頁面 - 採用引導式設計 */
          <div className="space-y-16 max-w-2xl mx-auto pb-48">
            
            {/* 宣傳卡片 */}
            <div className="relative p-12 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[44px] border border-white/10 overflow-hidden group shadow-2xl">
               <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-[2000ms]"></div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-3xl mb-8 animate-[soft-float_3s_ease-in-out_infinite]">
                     <i className="fa-solid fa-wand-magic-sparkles text-4xl text-blue-600"></i>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4">啟動您的專屬創作引擎</h3>
                  <p className="text-base text-white/70 leading-relaxed font-medium max-w-md">透過申請 Google API Key，您可以直接對接最新的 Gemini 研發引擎，獲得無損的寫作建議與深度分析。</p>
                  
                  <a 
                    href="https://aistudio.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-12 px-10 py-5 bg-white text-black rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-4"
                  >
                     <i className="fa-solid fa-rocket text-lg"></i>
                     <span>立即前往 Google AI Studio</span>
                  </a>
               </div>
            </div>

            {/* 步驟列表 */}
            <div className="space-y-10">
               <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">申請步驟 STEP-BY-STEP</h3>
               <div className="space-y-4">
                  {[
                    { step: '01', title: '進入 Google AI Studio', desc: '這是開發者獲取 Gemini 最快捷的途徑，無需信用卡即可啟用免費額度。', link: 'https://aistudio.google.com/', icon: 'fa-globe' },
                    { step: '02', title: '建立 API Key', desc: '在左側導覽列找到 "Get API key"，您可以選擇既有專案或新建一個來生成。', icon: 'fa-key' },
                    { step: '03', title: '配置 SafeWrite', desc: '在偏好設定頁面，點擊「選擇 Google Cloud API KEY」並完成授權。', icon: 'fa-paste' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#1C1C1E] p-8 rounded-[32px] border border-white/5 flex items-start space-x-8 group">
                       <div className="w-16 h-16 rounded-[22px] bg-black/40 border border-white/5 flex items-center justify-center text-xl font-black text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                          {item.step}
                       </div>
                       <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                             <h4 className="text-xl font-black text-white tracking-tight">{item.title}</h4>
                             <i className={`fa-solid ${item.icon} text-gray-700 text-xs`}></i>
                          </div>
                          <p className="text-[14px] text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-blue-300 pt-2">
                               <span>訪問官網傳送門</span>
                               <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* 安全提示 */}
            <div className="bg-white/5 rounded-[32px] p-8 border border-dashed border-white/10 flex items-center space-x-6">
               <i className="fa-solid fa-user-shield text-gray-600 text-2xl"></i>
               <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                 您的 API Key 僅會透過官方的安全對話框授權，SafeWrite 伺服器絕不會主動抓取或儲存您的私有金鑰，請放心使用。
               </p>
            </div>
          </div>
        )}
      </main>

      {/* 底部動作列 */}
      <footer className="absolute bottom-0 inset-x-0 p-8 sm:p-12 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0">
         <div className="max-w-2xl mx-auto">
            <button 
              onClick={onClose}
              className="w-full py-7 bg-white text-black font-black text-sm uppercase tracking-[0.4em] rounded-[44px] shadow-2xl active:scale-[0.98] transition-all duration-300"
            >
               確 認 偏 好 設 定
            </button>
         </div>
      </footer>

      {/* 動畫定義 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes soft-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}} />
    </div>
  );
};

export default AIPreferencesPage;
