
import React, { useState } from 'react';

enum PubStep { DASHBOARD, GALLERY, CONFIG }

const ProfessionalPublicationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<PubStep>(PubStep.DASHBOARD);
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  const templates = [
    { name: 'Modern Novel', format: 'PDF, DOCX', type: 'PREMIUM', color: 'bg-[#FDFBF7]' },
    { name: 'Academic', format: 'PDF', type: 'Free', color: 'bg-[#F3F4F6]' },
    { name: 'Classic EPUB', format: 'EPUB', type: 'PREMIUM', color: 'bg-[#000000]' },
    { name: 'Screenplay', format: 'PDF, DOCX', type: 'Free', color: 'bg-[#FFFFFF]' }
  ];

  if (step === PubStep.GALLERY) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#0F0F10] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between border-b border-white/5">
          <button onClick={() => setStep(PubStep.DASHBOARD)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">EXPORT GALLERY</h2>
          <button className="text-gray-400"><i className="fa-solid fa-magnifying-glass"></i></button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-10">
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">Choose your<br/><span className="text-blue-500">format style.</span></h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Select a template to preview layout.</p>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PDF', 'DOCX', 'EPUB'].map(f => (
              <button key={f} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${f === selectedFormat ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 pb-20">
            {templates.map((t, idx) => (
              <div key={idx} className="space-y-4 group cursor-pointer" onClick={() => setStep(PubStep.CONFIG)}>
                <div className={`${t.color} aspect-[3/4] rounded-3xl relative shadow-2xl transition-transform hover:scale-105 overflow-hidden border border-white/5`}>
                  {t.type === 'PREMIUM' && <span className="absolute top-4 left-4 bg-amber-500/20 text-amber-500 text-[8px] font-black px-2 py-1 rounded-full border border-amber-500/30">★ PREMIUM</span>}
                  <div className="absolute inset-x-8 top-12 bottom-12 border border-gray-200/50 p-4 opacity-10">
                    <div className="h-2 w-full bg-gray-300 rounded mb-2" />
                    <div className="h-2 w-3/4 bg-gray-300 rounded" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{t.name}</h4>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{t.format} • {t.type}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (step === PubStep.CONFIG) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#0A0B0D] flex flex-col animate-in slide-in-from-right duration-500">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between border-b border-white/5 bg-[#0F1012]">
          <button onClick={() => setStep(PubStep.GALLERY)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">EXPORT CONFIGURATION</h2>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12 pb-48">
          {/* Document Preview */}
          <div className="bg-[#16181C] rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
               <h4 className="text-2xl font-black text-white mb-2">The Silent Ocean</h4>
               <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-10">Page 1 of 243 • Chapter 1</p>
               <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-400">Document Preview</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px] mt-2">Visual representation based on current settings.</p>
                  </div>
                  <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black px-4 py-1.5 rounded-xl border border-blue-500/20 uppercase tracking-widest">READY</span>
               </div>
            </div>
          </div>

          {/* Configuration Options */}
          <section className="space-y-10">
            <div>
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-1">Output Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">All Chapters</button>
                <button className="py-5 bg-white/5 border border-white/10 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest">Custom Range</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button className="p-8 bg-[#16181C] border-2 border-blue-600 rounded-[2.5rem] text-center active:scale-95 transition-all">
                 <span className="text-4xl font-serif text-white block mb-4">Aa</span>
                 <p className="text-sm font-bold text-white mb-1">Serif</p>
                 <p className="text-[9px] text-gray-500 uppercase font-black">Classic</p>
              </button>
              <button className="p-8 bg-[#16181C] border border-white/10 rounded-[2.5rem] text-center opacity-40 active:scale-95 transition-all">
                 <span className="text-4xl font-sans text-white block mb-4">Aa</span>
                 <p className="text-sm font-bold text-white mb-1">Sans-serif</p>
                 <p className="text-[9px] text-gray-500 uppercase font-black">Modern</p>
              </button>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between p-6 bg-[#16181C] rounded-[2rem] border border-white/5">
                  <span className="text-sm font-bold text-white">Page Numbering</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full translate-x-6" /></div>
               </div>
               <div className="flex items-center justify-between p-6 bg-[#16181C] rounded-[2rem] border border-white/5">
                  <span className="text-sm font-bold text-white">Headers & Footers</span>
                  <div className="w-12 h-6 bg-white/10 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full" /></div>
               </div>
            </div>

            <div className="space-y-4">
               <input placeholder="Elena Fisher" className="w-full h-16 bg-[#16181C] border border-white/10 rounded-2xl px-6 text-sm text-white focus:border-blue-500 outline-none transition-all" />
               <input placeholder="ISBN-13 (Optional)" className="w-full h-16 bg-[#16181C] border border-white/10 rounded-2xl px-6 text-sm text-white focus:border-blue-500 outline-none transition-all" />
               <div className="grid grid-cols-2 gap-4">
                  <input placeholder="2025" className="w-full h-16 bg-[#16181C] border border-white/10 rounded-2xl px-6 text-sm text-white outline-none" />
                  <div className="w-full h-16 bg-[#16181C] border border-white/10 rounded-2xl px-6 flex items-center justify-between text-sm text-white">
                     <span>Traditional Chinese</span>
                     <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                  </div>
               </div>
            </div>
          </section>
        </main>

        <footer className="fixed bottom-0 inset-x-0 p-10 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D] to-transparent shrink-0">
          <button 
            onClick={() => { alert('Document generated successfully!'); onClose(); }}
            className="w-full py-7 bg-blue-600 rounded-[3rem] text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
          >
             <i className="fa-solid fa-file-export text-xl"></i>
             <span>Generate & Export</span>
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F8F9FB] flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-4">
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors">
             <i className="fa-solid fa-chevron-left text-xl"></i>
           </button>
           <div>
              <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Export & Membership</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MANAGEMENT CENTER</p>
           </div>
        </div>
        <button className="p-2 text-gray-400"><i className="fa-solid fa-gear text-xl"></i></button>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12 text-[#1E293B] pb-40">
        <section>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">EXPORT FORMATS</h3>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View History</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setSelectedFormat('PDF'); setStep(PubStep.GALLERY); }}
              className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-start space-y-4 relative active:scale-95 transition-all"
            >
               <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><i className="fa-solid fa-file-pdf text-3xl"></i></div>
               <div><p className="text-base font-black">PDF Document</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Standard format</p></div>
               <div className="absolute top-6 right-6 w-2 h-2 bg-green-500 rounded-full" />
            </button>
            <button className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-start space-y-4 relative active:scale-95 transition-all opacity-60">
               <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><i className="fa-solid fa-book text-3xl"></i></div>
               <div><p className="text-base font-black">EPUB E-Book</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">For Kindle & Apple</p></div>
               <span className="absolute top-6 right-6 text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-lg uppercase">PRO</span>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">CURRENT PLAN</p>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-widest">ACTIVE</span>
           </div>
           <h4 className="text-4xl font-black mb-8 leading-none">Free Basic</h4>
           <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-blue-500 w-[75%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
           </div>
           <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <span>3 / 4 Exports used this month</span>
              <span>75%</span>
           </div>
        </section>

        <footer className="pb-10">
           <button className="w-full py-7 bg-[#5d5dff] rounded-[3rem] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(93,93,255,0.4)] active:scale-95 transition-all">
              <i className="fa-solid fa-bolt-lightning"></i>
              <span>Unlock Full Potential</span>
           </button>
        </footer>
      </main>
    </div>
  );
};

export default ProfessionalPublicationCenter;
