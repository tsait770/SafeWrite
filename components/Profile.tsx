
import React, { useState } from 'react';
import { AppState, MembershipLevel, SupportedLanguage, AIPreferences, SecuritySettings, BackupSettings, CreditCard } from '../types';
import LanguageSelector from './LanguageSelector';
import PrivacyModal from './PrivacyModal';
import AIPreferencesPage from './AIPreferences';
import SecuritySettingsPage from './SecuritySettingsPage';
import CreditCardManager from './CreditCardManager';

interface ProfileProps {
  state: AppState;
  onUpgrade: () => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onUpdateAIPreferences: (prefs: AIPreferences) => void;
  onUpdateSecuritySettings: (settings: SecuritySettings) => void;
  onUpdateBackupSettings: (settings: BackupSettings) => void;
  onUpdateSavedCards: (cards: CreditCard[]) => void;
}

const Profile: React.FC<ProfileProps> = ({ state, onUpgrade, onLanguageChange, onUpdateAIPreferences, onUpdateSecuritySettings, onUpdateBackupSettings, onUpdateSavedCards }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAIPreferencesOpen, setIsAIPreferencesOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    onLanguageChange(lang);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const toggleGDrive = () => {
    onUpdateBackupSettings({
      ...state.backupSettings,
      googleDriveConnected: !state.backupSettings.googleDriveConnected,
      status: state.backupSettings.googleDriveConnected ? 'IDLE' : 'SYNCING',
      lastBackupTime: state.backupSettings.googleDriveConnected ? state.backupSettings.lastBackupTime : Date.now()
    });
  };

  const handleAddCard = (card: CreditCard) => {
    onUpdateSavedCards([card, ...state.savedCards]);
  };

  const handleDeleteCard = (id: string) => {
    onUpdateSavedCards(state.savedCards.filter(c => c.id !== id));
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
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          Success: Language Updated
        </div>
      )}

      <section className="bg-[#1E293B] p-8 rounded-[44px] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="flex items-center space-x-6 mb-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {state.language.slice(0, 1).toUpperCase()}
          </div>
          <div className={state.language === 'ar' ? 'mr-4 ml-0' : ''}>
            <h2 className="text-2xl font-black text-white tracking-tight">作家身分</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${state.membership === MembershipLevel.PREMIUM ? 'bg-amber-500 text-slate-950' : state.membership === MembershipLevel.PRO ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                {state.membership}
              </span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                持續創作 124 天
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          {state.membership === MembershipLevel.FREE ? (
            <button 
              onClick={onUpgrade}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[28px] text-white font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-bolt-lightning text-xs mr-2"></i>
              <span>解鎖全功能 Pro 模式</span>
            </button>
          ) : (
            <button 
              onClick={onUpgrade}
              className="w-full py-5 bg-white/5 border border-white/10 rounded-[28px] text-white font-black text-[12px] uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-gem text-xs mr-2 text-amber-500"></i>
              <span>管理您的訂閱方案</span>
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">資料備份與同步 DATA BACKUP</h2>
        <div className="bg-[#1C1C1E] p-6 rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${state.backupSettings.googleDriveConnected ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                    <i className="fa-brands fa-google-drive text-xl"></i>
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-white">Google Drive 連結</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-1">
                      {state.backupSettings.googleDriveConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                    </p>
                 </div>
              </div>
              <button 
                onClick={toggleGDrive}
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${state.backupSettings.googleDriveConnected ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${state.backupSettings.googleDriveConnected ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
           </div>

           {state.backupSettings.googleDriveConnected && (
             <div className="pt-6 border-t border-white/5 space-y-4 animate-in fade-in duration-500">
                <div className="flex justify-between items-center px-1">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">備份資料夾</span>
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{state.backupSettings.backupFolder}</span>
                </div>
                <div className="flex items-center justify-between px-1">
                   <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">端對端加密</span>
                      <i className="fa-solid fa-lock text-[8px] text-green-500/60"></i>
                   </div>
                   <button 
                     onClick={() => onUpdateBackupSettings({...state.backupSettings, isEncrypted: !state.backupSettings.isEncrypted})}
                     className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${state.backupSettings.isEncrypted ? 'bg-green-600/20' : 'bg-white/5'}`}
                   >
                     <div className={`w-4 h-4 bg-white rounded-full transition-transform ${state.backupSettings.isEncrypted ? 'translate-x-4' : 'translate-x-0'}`} />
                   </button>
                </div>
                <div className="flex justify-between items-center px-1 pt-2">
                   <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${state.backupSettings.status === 'SYNCING' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        {state.backupSettings.status === 'SYNCING' ? '正在同步中...' : '備份已完成'}
                      </span>
                   </div>
                   <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                     最後同步: {state.backupSettings.lastBackupTime ? new Date(state.backupSettings.lastBackupTime).toLocaleString() : 'N/A'}
                   </span>
                </div>
             </div>
           )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">偏好設定 SETTINGS</h2>
        
        <div className="bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-800">
          <button 
            onClick={() => setIsCardsOpen(true)}
            className="w-full flex items-center justify-between p-4 border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-700/50 rounded-lg text-emerald-400">
                <i className="fa-solid fa-credit-card text-sm"></i>
              </div>
              <span className="text-sm font-medium text-slate-200">常用信用卡</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                {state.savedCards.length} Cards
              </span>
              <i className={`fa-solid fa-chevron-right text-slate-500 text-[10px] ${state.language === 'ar' ? 'rotate-180' : ''}`}></i>
            </div>
          </button>

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

      <section className="bg-slate-900/40 p-5 rounded-3xl border border-dashed border-slate-700">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">雲端連線 CLOUD STATUS</h3>
        <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-medium uppercase tracking-[0.2em]">
          作品目前由本地 INDEXEDDB 提供離線防護。升級至 PRO 以啟動即時雙向加密同步。
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

      {isCardsOpen && (
        <CreditCardManager 
          cards={state.savedCards}
          onAdd={handleAddCard}
          onDelete={handleDeleteCard}
          onClose={() => setIsCardsOpen(false)}
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
