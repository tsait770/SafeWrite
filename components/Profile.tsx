
import React, { useState } from 'react';
import { AppState, MembershipLevel, SupportedLanguage } from '../types';
import LanguageSelector from './LanguageSelector';
import PrivacyModal from './PrivacyModal';

interface ProfileProps {
  state: AppState;
  onUpgrade: () => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const Profile: React.FC<ProfileProps> = ({ state, onUpgrade, onLanguageChange }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    onLanguageChange(lang);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const currentLangName = {
    'en': 'English',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    'es': 'Español',
    'pt-BR': 'Português (Brasil)',
    'pt-PT': 'Português',
    'de': 'Deutsch',
    'fr': 'Français',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'sv': 'Svenska',
    'tr': 'Türkçe',
    'ru': 'Русский',
    'ja': '日本語',
    'ko': '한국어',
    'th': 'ไทย',
    'vi': 'Tiếng Việt',
    'id': 'Bahasa Indonesia',
    'ms': 'Bahasa Melayu',
    'ar': 'العربية',
    'hi': 'हिन्दी',
  }[state.language] || state.language;

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir={state.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          Success: Language Updated
        </div>
      )}

      {/* User Status Card */}
      <section className="bg-[#1E293B] p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-xl">
            {state.language.slice(0, 1).toUpperCase()}
          </div>
          <div className={state.language === 'ar' ? 'mr-4 ml-0' : ''}>
            <h2 className="text-xl font-bold text-white">作家身分</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${state.membership === MembershipLevel.PREMIUM ? 'bg-amber-500 text-slate-950' : 'bg-blue-500/10 text-blue-400'}`}>
                {state.membership}
              </span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                持續創作 124 天
              </span>
            </div>
          </div>
        </div>

        {state.membership === MembershipLevel.FREE && (
          <button 
            onClick={onUpgrade}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            <span>獲得 90 天 PRO 試用</span>
          </button>
        )}
      </section>

      {/* Settings List */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">偏好設定 SETTINGS</h2>
        
        <div className="bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-800">
          <button 
            onClick={() => setIsSelectorOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M12 9V5M8.5 10.5A11.248 11.248 0 015.67 5.904M21 21l-4.35-4.35M11 19a11 11 0 00-9.858-6.142" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-200">介面語言 / Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">{currentLangName}</span>
              <svg className={`w-4 h-4 text-slate-500 ${state.language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>

          <button 
            onClick={() => setIsPrivacyOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-200">隱私權與法律資訊</span>
            </div>
            <svg className={`w-4 h-4 text-slate-500 ${state.language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-200">深色模式</span>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center px-1">
              <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${state.language === 'ar' ? '-translate-x-4' : 'translate-x-4'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <span className="text-sm font-medium text-slate-200">離線同步模式</span>
            </div>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Active</span>
          </div>
        </div>
      </section>

      {/* Cloud & Support */}
      <section className="bg-slate-900/40 p-5 rounded-3xl border border-dashed border-slate-700">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">雲端連線 CLOUD STATUS</h3>
        <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
          作品目前由本地 IndexedDB 提供離線防護。升級至 PRO 以啟動即時雙向加密同步。
        </p>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Offline Protected</span>
        </div>
      </section>
      
      <div className="text-center pb-10">
        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em]">SafeWrite System v1.1.0-App</p>
      </div>

      {isSelectorOpen && (
        <LanguageSelector 
          currentLanguage={state.language}
          onSelect={handleLanguageSelect}
          onClose={() => setIsSelectorOpen(false)}
        />
      )}

      {isPrivacyOpen && (
        <PrivacyModal 
          onClose={() => setIsPrivacyOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
