
import React, { useState } from 'react';
import { AppState, MembershipLevel, SupportedLanguage, AIPreferences, SecuritySettings } from '../types';
import LanguageSelector from './LanguageSelector';
import PrivacyModal from './PrivacyModal';
import AIPreferencesPage from './AIPreferences';
import SecuritySettingsPage from './SecuritySettingsPage';

interface ProfileProps {
  state: AppState;
  onUpgrade: () => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onUpdateAIPreferences: (prefs: AIPreferences) => void;
  onUpdateSecuritySettings: (settings: SecuritySettings) => void;
}

const Profile: React.FC<ProfileProps> = ({ state, onUpgrade, onLanguageChange, onUpdateAIPreferences, onUpdateSecuritySettings }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAIPreferencesOpen, setIsAIPreferencesOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
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
    'ko': '韓國語',
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
            <i className="fa-solid fa-bolt-lightning text-xs mr-2"></i>
            <span>獲得 90 天 PRO 試用</span>
          </button>
        )}
      </section>

      {/* Settings List */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">偏好設定 SETTINGS</h2>
        
        <div className="bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-800">
          <button 
            onClick={() => setIsAIPreferencesOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-blue-400">
                <i className="fa-solid fa-robot text-sm"></i>
              </div>
              <span className="text-sm font-medium text-slate-200">AI 助理偏好</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                {state.aiPreferences.provider === 'CUSTOM' ? 'Custom Active' : 'Default'}
              </span>
              <i className={`fa-solid fa-chevron-right text-slate-500 text-[10px] ${state.language === 'ar' ? 'rotate-180' : ''}`}></i>
            </div>
          </button>

          <button 
            onClick={() => setIsSecurityOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-indigo-400">
                <i className="fa-solid fa-shield-halved text-sm"></i>
              </div>
              <span className="text-sm font-medium text-slate-200">安全與備份</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${state.securitySettings.autoSnapshotEnabled ? 'text-green-400' : 'text-slate-500'}`}>
                {state.securitySettings.autoSnapshotEnabled ? 'ON' : 'OFF'}
              </span>
              <i className={`fa-solid fa-chevron-right text-slate-500 text-[10px] ${state.language === 'ar' ? 'rotate-180' : ''}`}></i>
            </div>
          </button>

          <button 
            onClick={() => setIsSelectorOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <i className="fa-solid fa-language text-sm"></i>
              </div>
              <span className="text-sm font-medium text-slate-200">介面語言 / Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">{currentLangName}</span>
              <i className={`fa-solid fa-chevron-right text-slate-500 text-[10px] ${state.language === 'ar' ? 'rotate-180' : ''}`}></i>
            </div>
          </button>

          <button 
            onClick={() => setIsPrivacyOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <i className="fa-solid fa-file-contract text-sm"></i>
              </div>
              <span className="text-sm font-medium text-slate-200">隱私權與法律資訊</span>
            </div>
            <i className={`fa-solid fa-chevron-right text-slate-500 text-[10px] ${state.language === 'ar' ? 'rotate-180' : ''}`}></i>
          </button>

          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
                <i className="fa-solid fa-moon text-sm"></i>
              </div>
              <span className="text-sm font-medium text-slate-200">深色模式</span>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center px-1">
              <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${state.language === 'ar' ? '-translate-x-4' : 'translate-x-4'}`} />
            </div>
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

      {isAIPreferencesOpen && (
        <AIPreferencesPage 
          preferences={state.aiPreferences}
          onUpdate={onUpdateAIPreferences}
          onClose={() => setIsAIPreferencesOpen(false)}
        />
      )}

      {isSecurityOpen && (
        <SecuritySettingsPage
          settings={state.securitySettings}
          onUpdate={onUpdateSecuritySettings}
          onClose={() => setIsSecurityOpen(false)}
        />
      )}

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
