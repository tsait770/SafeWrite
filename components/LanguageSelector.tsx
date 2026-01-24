
import React, { useState, useMemo } from 'react';
import { SupportedLanguage } from '../types';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'es', name: 'Español' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'pt-PT', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
];

const PRIMARY_CODES: SupportedLanguage[] = ['en', 'es', 'pt-BR', 'fr', 'de', 'ja', 'ko', 'ar'];

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
  onClose: () => void;
}

// 修正 TypeScript 錯誤：將 LanguageItem 移出並明確定義 Props 型別，以支援 key 屬性
interface LanguageItemProps {
  lang: LanguageOption;
  currentLanguage: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
  onClose: () => void;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ lang, currentLanguage, onSelect, onClose }) => (
  <button
    onClick={() => {
      onSelect(lang.code);
      onClose();
    }}
    className={`w-full h-[52px] px-6 flex items-center justify-between transition-all active:scale-[0.98] ${
      currentLanguage === lang.code ? 'bg-blue-600/10 text-blue-500' : 'text-slate-200 hover:bg-white/5'
    }`}
  >
    <span className="text-[16px] font-medium leading-[1.4]">{lang.name}</span>
    {currentLanguage === lang.code && (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </button>
);

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onSelect, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Recommended (Current + 2 system-like guesses, here simplified)
  const recommended = useMemo(() => {
    return LANGUAGES.filter(l => l.code === currentLanguage || l.code === 'en' || l.code === 'zh-TW').slice(0, 3);
  }, [currentLanguage]);

  // 2. Primary
  const primary = useMemo(() => {
    return LANGUAGES.filter(l => PRIMARY_CODES.includes(l.code) && !recommended.find(r => r.code === l.code));
  }, [recommended]);

  // 3. All (Sorted)
  const allSorted = useMemo(() => {
    return [...LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredAll = useMemo(() => {
    if (!searchQuery) return allSorted;
    return allSorted.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.code.includes(searchQuery.toLowerCase()));
  }, [allSorted, searchQuery]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center animate-in fade-in duration-300 px-0 sm:px-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#1E293B]/80 backdrop-blur-2xl border-t sm:border border-slate-700/50 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight">語言設定 / Language</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {!isExpanded ? (
            <div className="space-y-6 pt-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* Recommended Section */}
              <section>
                <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Recommended</h3>
                <div className="space-y-0.5">
                  {recommended.map(l => (
                    <LanguageItem 
                      key={l.code} 
                      lang={l} 
                      currentLanguage={currentLanguage} 
                      onSelect={onSelect} 
                      onClose={onClose} 
                    />
                  ))}
                </div>
              </section>

              {/* Primary Section */}
              <section>
                <h3 className="px-6 text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2">Primary Languages</h3>
                <div className="space-y-0.5">
                  {primary.map(l => (
                    <LanguageItem 
                      key={l.code} 
                      lang={l} 
                      currentLanguage={currentLanguage} 
                      onSelect={onSelect} 
                      onClose={onClose} 
                    />
                  ))}
                </div>
              </section>

              {/* View All Button */}
              <div className="px-6 pt-2">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  查看所有語言 / View All
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right duration-500">
              {/* Search Bar */}
              <div className="p-4 sticky top-0 bg-[#1E293B] z-10">
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="搜尋語言 / Search languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500 transition-all"
                  />
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Back to main */}
              <button 
                onClick={() => setIsExpanded(false)}
                className="px-6 py-3 text-xs font-bold text-blue-500 flex items-center space-x-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                <span>返回建議列表 / Back</span>
              </button>

              <div className="space-y-0.5 mt-2">
                {filteredAll.map(l => (
                  <LanguageItem 
                    key={l.code} 
                    lang={l} 
                    currentLanguage={currentLanguage} 
                    onSelect={onSelect} 
                    onClose={onClose} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
