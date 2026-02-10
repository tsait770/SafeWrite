
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

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#1C1C1E]/90 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden flex flex-col max-h-[80vh]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-white">Select Language</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelect(lang.code);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all active:scale-95 ${currentLanguage === lang.code ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center space-x-4">
                {currentLanguage === lang.code && <i className="fa-solid fa-check text-xs"></i>}
                <span className="text-lg font-bold">{lang.name}</span>
              </div>
              <span className="text-[10px] font-black uppercase opacity-40">{lang.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
