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
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5">
          <button onClick={() => setStep(PubStep.DASHBOARD)} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">EXPORT GALLERY</h2>
          <button className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-10">
          <div>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">Choose your<br/><span className="text-blue-500">format style.</span></h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Select a template to preview layout.</p>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PDF', 'DOCX', 'EPUB'].map(f => (
              <button key={f} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${f === selectedFormat ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 pb-20">
            {templates.map((t, idx) => (
              <div key={idx} className="space-y-4 group cursor-pointer" onClick={() => setStep(PubStep.CONFIG)}>
                <div className={`${t.color} aspect-[3/4] rounded-3xl relative shadow-2xl transition-transform hover:scale-105 overflow-hidden`}>
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
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#0F1012]">
          <button onClick={() => setStep(PubStep.GALLERY)} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">EXPORT CONFIGURATION</h2>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12">
          {/* Document Preview - Image 15 */}
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
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Output Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest">All Chapters</button>
                <button className="py-5 bg-white/5 border border-white/10 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest">Custom Range</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-[#16181C] border-2 border-blue-600 rounded-[2.5rem] text-center">
                 <span className="text-4xl font-serif text-white block mb-4">Aa</span>
                 <p className="text-sm font-bold text-white mb-1">Serif</p>
                 <p className="text-[9px] text-gray-500 uppercase font-black">Classic</p>
              </div>
              <div className="p-8 bg-[#16181C] border border-white/10 rounded-[2.5rem] text-center opacity-40">
                 <span className="text-4xl font-sans text-white block mb-4">Aa</span>
                 <p className="text-sm font-bold text-white mb-1">Sans-serif</p>
                 <p className="text-[9px] text-gray-500 uppercase font-black">Modern</p>
              </div>
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
                  <input placeholder="2023" className="w-full h-16 bg-[#16181C] border border-white/10 rounded-2xl px-6 text-sm text-white outline-none" />
                  <div className="w-full h-16 bg-[#16181C] border border-white/10 rounded-2xl px-6 flex items-center justify-between text-sm text-white">
                     <span>English</span>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                  </div>
               </div>
            </div>
          </section>
        </main>

        <footer className="p-10 bg-[#0F1012] border-t border-white/5">
          <button className="w-full py-7 bg-blue-600 rounded-[3rem] text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 transition-all">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
             <span>Generate & Export</span>
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F8F9FB] flex flex-col animate-in fade-in duration-500">
      <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-4">
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
           <div>
              <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Export & Membership</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MANAGEMENT CENTER</p>
           </div>
        </div>
        <button className="p-2 text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"/></svg></button>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12 text-[#1E293B]">
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
               <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg></div>
               <div><p className="text-base font-black">PDF Document</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Standard format</p></div>
               <div className="absolute top-6 right-6 w-2 h-2 bg-green-500 rounded-full" />
            </button>
            <button className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-start space-y-4 relative active:scale-95 transition-all opacity-60">
               <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg></div>
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
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M13.13 11.13L11 9L13.13 6.87L15.26 9L13.13 11.13M13.13 2L11 4.13L13.13 6.26L15.26 4.13L13.13 2M13.13 15.87L11 18L13.13 20.13L15.26 18L13.13 15.87Z"/></svg>
              <span>Unlock Full Potential</span>
           </button>
        </footer>
      </main>
    </div>
  );
};

export default ProfessionalPublicationCenter;