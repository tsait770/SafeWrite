
import React from 'react';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center animate-in fade-in duration-300 px-0 sm:px-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#1E293B]/80 backdrop-blur-2xl border-t sm:border border-slate-700/50 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight">隱私權與法律資訊</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {/* Section 1: Privacy Policy */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.2em]">Privacy Policy</h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
              <p>SafeWrite 優先保護您的創作隱私。所有稿件默認存儲於設備本地資料庫（IndexedDB），未經授權不會上傳至雲端。</p>
              <p>當您使用 Gemini AI 助理時，僅會傳送當前選定的文本內容以進行分析，且該數據遵循 Google AI 隱私規範處理。</p>
            </div>
          </section>

          {/* Section 2: Third-Party Notices */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.2em]">Third-Party Notices</h3>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-wider">Weather Card UI</p>
                <p className="text-[9px] text-slate-500">Author: zanina-yassine | Source: UIverse</p>
              </div>
              <div className="text-[9px] font-mono text-slate-400 leading-normal bg-black/20 p-3 rounded-lg border border-white/5">
                Copyright (c) zanina-yassine<br /><br />
                MIT License: Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files...
                <br /><br />
                The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
              </div>
            </div>
          </section>

          {/* Section 3: Open Source */}
          <section className="space-y-4 pb-10">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Open Source Libraries</h3>
            <div className="grid grid-cols-2 gap-2">
              {['React', 'TailwindCSS', 'Lucide Icons', 'Marked', 'jsPDF', 'docx'].map(lib => (
                <div key={lib} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] text-slate-400 border border-white/5">{lib}</div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
