
import React, { useState } from 'react';
import { AIPreferences, SupportedLanguage } from '../types';
import { geminiService } from '../services/geminiService';

interface AIPreferencesProps {
  preferences: AIPreferences;
  onUpdate: (prefs: AIPreferences) => void;
  onClose: () => void;
}

const AIPreferencesPage: React.FC<AIPreferencesProps> = ({ preferences, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'GUIDE'>('SETTINGS');
  const [testStatus, setTestStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [customKey, setCustomKey] = useState('');

  const handleTestConnection = async () => {
    if (!customKey) return;
    setTestStatus('LOADING');
    const success = await geminiService.testConnection(customKey, 'GOOGLE');
    setTestStatus(success ? 'SUCCESS' : 'ERROR');
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      <header className="h-24 px-8 pt-8 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:bg-white/10 transition-colors">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">AI 助理偏好</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-0.5">AI ASSISTANT PREFERENCES</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SETTINGS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
          >
            偏好設定
          </button>
          <button 
            onClick={() => setActiveTab('GUIDE')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GUIDE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
          >
            申請教學
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-8 pb-32">
        {activeTab === 'SETTINGS' ? (
          <div className="space-y-10 max-w-2xl mx-auto">
            {/* AI Personality */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">寫作性格 AI PERSONALITY</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'CREATIVE', label: '創意無限', icon: 'fa-wand-magic-sparkles', color: 'text-purple-400' },
                  { id: 'PROFESSIONAL', label: '專業嚴謹', icon: 'fa-briefcase', color: 'text-blue-400' },
                  { id: 'ACADEMIC', label: '學術邏輯', icon: 'fa-graduation-cap', color: 'text-green-400' },
                  { id: 'CASUAL', label: '輕鬆生活', icon: 'fa-mug-hot', color: 'text-orange-400' }
                ].map((tone) => (
                  <button 
                    key={tone.id}
                    onClick={() => onUpdate({ ...preferences, tone: tone.id as any })}
                    className={`p-6 rounded-[2.5rem] border transition-all text-left flex items-center space-x-4 ${preferences.tone === tone.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-500 hover:border-white/10'}`}
                  >
                    <i className={`fa-solid ${tone.icon} text-xl ${preferences.tone === tone.id ? 'text-white' : tone.color}`}></i>
                    <span className="text-sm font-bold">{tone.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Model Selection */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">模型配置 MODEL CONFIG</h3>
              <div className="bg-[#1C1C1E] p-6 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <i className="fa-solid fa-brain"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">啟動深度思考模式</p>
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-1">GEMINI 3 PRO PREVIEW</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onUpdate({ ...preferences, enableThinking: !preferences.enableThinking })}
                    className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${preferences.enableThinking ? 'bg-blue-600' : 'bg-white/10'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${preferences.enableThinking ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                
                {preferences.enableThinking && (
                  <div className="pt-4 border-t border-white/5 space-y-4 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">思考預算 (Tokens)</span>
                      <span className="text-[10px] font-black text-blue-400">MAX: 32,768</span>
                    </div>
                    <input 
                      type="range" 
                      min="8000" 
                      max="32768" 
                      step="1024"
                      value={preferences.thinkingBudget}
                      onChange={(e) => onUpdate({ ...preferences, thinkingBudget: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[14px] font-black text-white">
                      <span>{preferences.thinkingBudget.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Custom API */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">自定義 API CUSTOM API</h3>
                <span className="text-[8px] font-black bg-amber-500 text-black px-2 py-0.5 rounded uppercase tracking-widest">Professional</span>
              </div>
              <div className="bg-[#1C1C1E] p-8 rounded-[3rem] border border-white/5 space-y-8">
                <div className="flex flex-col space-y-2">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">API Provider</label>
                  <select 
                    value={preferences.provider}
                    onChange={(e) => onUpdate({ ...preferences, provider: e.target.value as any })}
                    className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-5 text-sm font-bold text-white outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="DEFAULT">SafeWrite Cloud (預設)</option>
                    <option value="CUSTOM">Custom Google Gemini API</option>
                  </select>
                </div>

                {preferences.provider === 'CUSTOM' && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Google API Key</label>
                      <div className="relative">
                        <input 
                          type="password"
                          value={customKey}
                          onChange={(e) => setCustomKey(e.target.value)}
                          placeholder="在此貼上您的 API Key..."
                          className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-5 pr-14 text-sm font-bold text-white outline-none focus:border-blue-600 transition-colors"
                        />
                        <i className="fa-solid fa-key absolute right-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Target Model</label>
                      <input 
                        type="text"
                        value={preferences.customModel}
                        onChange={(e) => onUpdate({ ...preferences, customModel: e.target.value })}
                        placeholder="gemini-3-pro-preview"
                        className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-5 text-sm font-bold text-white outline-none focus:border-blue-600 transition-colors"
                      />
                    </div>

                    <button 
                      onClick={handleTestConnection}
                      disabled={!customKey || testStatus === 'LOADING'}
                      className={`w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all ${
                        testStatus === 'SUCCESS' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        testStatus === 'ERROR' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {testStatus === 'LOADING' ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <i className={`fa-solid ${testStatus === 'SUCCESS' ? 'fa-check-circle' : testStatus === 'ERROR' ? 'fa-circle-exclamation' : 'fa-bolt-lightning'}`}></i>
                      )}
                      <span>{
                        testStatus === 'LOADING' ? '正在測試連線...' :
                        testStatus === 'SUCCESS' ? '連線成功' :
                        testStatus === 'ERROR' ? '連線失敗，請檢查金鑰' :
                        '測試 API 連線 TEST CONNECTION'
                      }</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-12 max-w-2xl mx-auto pb-40">
            {/* Google Nano Banana Intro */}
            <div className="relative p-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[3rem] border border-white/10 overflow-hidden group">
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 animate-bounce">
                     <i className="fa-solid fa-wand-magic-sparkles text-3xl text-blue-600"></i>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-3">啟動您的專屬創作引擎</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">透過申請 Google API Key，您可以直接對接 Google 最新研發的 Gemini 模型，解鎖更強大的敘事能力與思考深度。</p>
               </div>
            </div>

            {/* Application Steps */}
            <div className="space-y-6">
               <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">申請步驟 STEP-BY-STEP</h3>
               
               {[
                 {
                   step: '01',
                   title: '前往 Google AI Studio',
                   desc: '這是最簡單的申請方式，無需信用卡即可獲得免費額度。',
                   link: 'https://aistudio.google.com/',
                   icon: 'fa-rocket'
                 },
                 {
                   step: '02',
                   title: '建立 API Key',
                   desc: '點擊左側導覽列的 "Get API key"，選擇一個專案或新建專案並生成金鑰。',
                   icon: 'fa-key'
                 },
                 {
                   step: '03',
                   title: '啟用 Places API (選配)',
                   desc: '若需使用地理資訊相關創作，請前往 Cloud Console 啟用對應服務。',
                   link: 'https://console.cloud.google.com/',
                   icon: 'fa-location-dot'
                 },
                 {
                   step: '04',
                   title: '貼回 SafeWrite',
                   desc: '複製金鑰並返回偏好設定頁面，切換至 Custom API 並貼上金鑰。',
                   icon: 'fa-paste'
                 }
               ].map((item, idx) => (
                 <div key={idx} className="flex space-x-6 group">
                    <div className="flex flex-col items-center">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {item.step}
                       </div>
                       {idx < 3 && <div className="w-px h-full bg-white/5 my-2"></div>}
                    </div>
                    <div className="flex-1 pb-10">
                       <div className="flex items-center space-x-3 mb-2">
                          <i className={`fa-solid ${item.icon} text-gray-500`}></i>
                          <h4 className="text-lg font-black text-white">{item.title}</h4>
                       </div>
                       <p className="text-sm text-gray-500 leading-relaxed font-medium mb-4">{item.desc}</p>
                       {item.link && (
                         <a 
                           href={item.link} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center space-x-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300"
                         >
                            <span>前往網站</span>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                         </a>
                       )}
                    </div>
                 </div>
               ))}
            </div>

            {/* Security Notice */}
            <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start space-x-5">
               <i className="fa-solid fa-shield-halved text-amber-500 text-xl mt-1"></i>
               <div className="space-y-2">
                  <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest">隱私與安全提示</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">您的 API Key 將僅加密儲存於設備本地，我們不會將其傳送至任何第三方伺服器。請妥善保管您的金鑰，切勿洩漏給他人。</p>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black to-transparent shrink-0">
         <button 
           onClick={onClose}
           className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] shadow-2xl active:scale-95 transition-all"
         >
            完 成 設 定
         </button>
      </footer>
    </div>
  );
};

export default AIPreferencesPage;
