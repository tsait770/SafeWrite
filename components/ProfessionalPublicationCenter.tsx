
import React, { useState, useEffect } from 'react';
import { Project, PublishingPayload } from '../types';

enum PubStep { CONFIG, GALLERY, FINALIZATION, DELIVERY, SUCCESS }

interface ProfessionalPublicationCenterProps {
  project: Project | null;
  onClose: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className="text-[13px] font-bold text-gray-400 group-hover:text-white transition-colors">{question}</span>
        <i className={`fa-solid fa-chevron-down text-[10px] text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="pb-6 text-[12px] text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300 font-medium">
          {answer}
        </div>
      )}
    </div>
  );
};

const ProfessionalPublicationCenter: React.FC<ProfessionalPublicationCenterProps> = ({ project, onClose }) => {
  const [step, setStep] = useState<PubStep>(PubStep.CONFIG);
  const [outputMode, setOutputMode] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [fontMode, setFontMode] = useState<'SERIF' | 'SANS'>('SERIF');
  const [pageNumbering, setPageNumbering] = useState(true);
  const [headersFooters, setHeadersFooters] = useState(false);
  
  const [targetPlatform, setTargetPlatform] = useState('');
  const [deliveryPhase, setDeliveryPhase] = useState(0);

  // Publishing Payload State
  const [payload, setPayload] = useState<PublishingPayload>({
    title: project?.name || 'The Solar Paradox',
    subtitle: '',
    author: project?.publishingPayload?.author || 'Author Identity',
    language: 'English',
    description: '',
    categories: [],
    keywords: [],
    contentFormats: ['pdf']
  });

  const selfPublishing = [
    { id: 'Amazon KDP', name: 'Amazon KDP', sub: 'KINDLE DIRECT PUBLISHING', meta: 'Official self-publishing platform · Global distribution', color: '#FADE4B', icon: 'fa-amazon' },
    { id: 'Apple Books', name: 'Apple Books', sub: 'APPLE PUBLISHING', meta: 'Official Apple publishing channel', color: '#1E90FF', icon: 'fa-apple' },
    { id: 'Google Books', name: 'Google Books', sub: 'PARTNER PROGRAM', meta: 'Global book discovery & distribution', color: '#EA4335', icon: 'fa-google' },
    { id: 'Draft2Digital', name: 'Draft2Digital', sub: 'MULTI-PLATFORM AGGREGATOR', meta: 'Global distribution to Kobo, Apple, and libraries', color: '#10B981', icon: 'fa-share-nodes' }
  ];

  const contentPlatforms = [
    { id: 'Medium', name: 'Medium 專欄', sub: 'DIGITAL STORYTELLING', meta: 'Content publishing & audience platform', color: '#FFFFFF', icon: 'fa-medium' },
    { id: 'Substack', name: 'Substack', sub: 'SERIAL / NEWSLETTER', meta: 'Newsletter publication hub', color: '#FF6719', icon: 'fa-envelope-open-text' }
  ];

  const deliverySteps = [
    { title: '內容標準化與 AST 解析', en: 'CONTENT NORMALIZATION & AST PARSING', icon: 'fa-microchip' },
    { title: '生成 DOCX 編輯母檔', en: 'GENERATING EDITORIAL DOCX ARTIFACT', icon: 'fa-microchip' },
    { title: '封裝 PDF 印刷級手稿', en: 'PACKAGING HIGH-FIDELITY PDF', icon: 'fa-rocket' },
    { title: '構建 EPUB 3 出版規格電子書', en: 'BUILDING EPUB 3 STANDARDS E-BOOK', icon: 'fa-microchip' },
    { title: '加密傳輸至出版商通道', en: 'ENCRYPTED DELIVERY TO PLATFORM API', icon: 'fa-rocket' }
  ];

  useEffect(() => {
    if (step === PubStep.DELIVERY) {
      const interval = setInterval(() => {
        setDeliveryPhase(prev => {
          if (prev < deliverySteps.length - 1) return prev + 1;
          clearInterval(interval);
          setTimeout(() => setStep(PubStep.SUCCESS), 2000);
          return prev;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // STAGE 1: EXPORT CONFIGURATION
  if (step === PubStep.CONFIG) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white">
        <header className="h-20 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-start text-white opacity-60">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-100">Export Configuration</h2>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Help</button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar space-y-8">
           <div className="bg-[#121214] rounded-[44px] p-10 flex flex-col relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-4xl font-black tracking-tighter mb-1">{payload.title}</h1>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-10">PAGE 1 OF 243 • CHAPTER 1</p>
                <div className="flex flex-col space-y-1">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Preview</p>
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed max-w-[140px]">Visual representation based on current settings.</p>
                      <button className="px-8 py-3 bg-[#1A1A1E] border border-white/5 rounded-2xl text-[10px] font-black text-blue-500 uppercase tracking-widest">Ready</button>
                   </div>
                </div>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-2">Output Options</label>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setOutputMode('ALL')} className={`h-20 rounded-[32px] font-black text-[10px] uppercase tracking-widest transition-all ${outputMode === 'ALL' ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-[#121214] text-gray-500 border border-white/5'}`}>All Chapters</button>
                 <button onClick={() => setOutputMode('CUSTOM')} className={`h-20 rounded-[32px] font-black text-[10px] uppercase tracking-widest transition-all ${outputMode === 'CUSTOM' ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-[#121214] text-gray-500 border border-white/5'}`}>Custom Range</button>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setFontMode('SERIF')} className={`h-56 rounded-[44px] flex flex-col items-center justify-center space-y-4 transition-all border-4 ${fontMode === 'SERIF' ? 'bg-[#121214] border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.2)]' : 'bg-[#0A0A0B] border-white/5 opacity-50'}`}>
                 <span className="text-5xl font-serif">Aa</span>
                 <div className="text-center"><p className="text-sm font-black text-white">Serif</p><p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Classic</p></div>
              </button>
              <button onClick={() => setFontMode('SANS')} className={`h-56 rounded-[44px] flex flex-col items-center justify-center space-y-4 transition-all border-4 ${fontMode === 'SANS' ? 'bg-[#121214] border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.2)]' : 'bg-[#0A0A0B] border-white/5 opacity-50'}`}>
                 <span className="text-5xl font-sans">Aa</span>
                 <div className="text-center"><p className="text-sm font-black text-white">Sans-serif</p><p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Modern</p></div>
              </button>
           </div>

           <div className="space-y-4">
              <div className="bg-[#121214] h-20 rounded-[32px] px-8 flex items-center justify-between border border-white/5">
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Page Numbering</span>
                 <button onClick={() => setPageNumbering(!pageNumbering)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${pageNumbering ? 'bg-blue-600' : 'bg-gray-700'}`}><div className={`w-6 h-6 bg-white rounded-full transition-transform ${pageNumbering ? 'translate-x-6' : 'translate-x-0'}`} /></button>
              </div>
              <div className="bg-[#121214] h-20 rounded-[32px] px-8 flex items-center justify-between border border-white/5">
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Headers & Footers</span>
                 <button onClick={() => setHeadersFooters(!headersFooters)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${headersFooters ? 'bg-blue-600' : 'bg-gray-700'}`}><div className={`w-6 h-6 bg-white rounded-full transition-transform ${headersFooters ? 'translate-x-6' : 'translate-x-0'}`} /></button>
              </div>
           </div>

           <div className="space-y-4 pb-32">
              <input type="text" value={payload.author} onChange={e => setPayload({...payload, author: e.target.value})} placeholder="Author Identity" className="w-full h-20 bg-[#121214] border border-white/5 rounded-[32px] px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
              <input type="text" placeholder="ISBN-13 (Optional)" className="w-full h-20 bg-[#121214] border border-white/5 rounded-[32px] px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
              <div className="grid grid-cols-2 gap-4">
                 <div className="h-20 bg-[#121214] border border-white/5 rounded-[32px] px-8 flex items-center text-sm font-bold text-gray-300">2026</div>
                 <div className="h-20 bg-[#121214] border border-white/5 rounded-[32px] px-8 flex items-center justify-between text-sm font-bold text-gray-300"><span>{payload.language}</span><i className="fa-solid fa-chevron-down text-[10px] opacity-40"></i></div>
              </div>
           </div>
        </main>

        <footer className="p-8 pb-12 shrink-0 bg-black">
           <button onClick={() => setStep(PubStep.GALLERY)} className="w-full h-24 bg-blue-600 text-white rounded-[48px] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><i className="fa-solid fa-arrow-right text-[10px]"></i></div>
              <span className="text-[12px] font-black uppercase tracking-[0.4em]">Proceed to Distribution</span>
           </button>
        </footer>
      </div>
    );
  }

  // STAGE 2: GLOBAL ONE-CLICK GALLERY
  if (step === PubStep.GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-start text-white"><i className="fa-solid fa-chevron-left text-xl"></i></button>
          <div className="text-center">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">Global One-Click Publishing</h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Official Delivery Infrastructure</p>
          </div>
          <div className="w-12" />
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-16">
          <section className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-10 rounded-[48px] border border-blue-600/20">
              <h3 className="text-2xl font-black tracking-tight mb-2">From Draft to the World</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Deliver your work through official global publishing channels. This is where your journey from manuscript to published work completes.</p>
            </div>
          </section>

          <section className="space-y-10">
            <div className="px-2">
              <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">Select Publishing Destination</h3>
              <p className="text-[13px] text-blue-500 font-bold mt-2">You don’t need to handle technical details. Select a destination — we’ll handle the rest.</p>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-2">Self-Publishing Platforms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selfPublishing.map(p => (
                  <button key={p.id} onClick={() => { setTargetPlatform(p.id); setStep(PubStep.FINALIZATION); }} className="bg-[#121214] rounded-[44px] p-8 border border-white/5 text-left transition-all hover:scale-[1.02] hover:bg-[#1A1A1C] group">
                    <div className="flex items-center space-x-5 mb-6">
                      <div className="w-16 h-16 rounded-[24px] bg-black border border-white/10 flex items-center justify-center text-3xl" style={{ color: p.color }}><i className={`fa-brands ${p.icon}`}></i></div>
                      <div><h5 className="text-xl font-black tracking-tight">{p.name}</h5><p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{p.sub}</p></div>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed h-10 line-clamp-2">{p.meta}</p>
                    <div className="mt-6 flex items-center justify-between"><span className="text-[9px] font-black bg-blue-600/20 text-blue-500 px-3 py-1.5 rounded-full uppercase tracking-widest">Official Channel</span><i className="fa-solid fa-arrow-right text-gray-800 group-hover:text-blue-500 transition-colors"></i></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-2">Content Platforms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contentPlatforms.map(p => (
                  <button key={p.id} onClick={() => { setTargetPlatform(p.id); setStep(PubStep.FINALIZATION); }} className="bg-[#121214] rounded-[44px] p-8 border border-white/5 text-left transition-all hover:scale-[1.02] hover:bg-[#1A1A1C]">
                    <div className="flex items-center space-x-5 mb-6">
                      <div className="w-16 h-16 rounded-[24px] bg-black border border-white/10 flex items-center justify-center text-3xl" style={{ color: p.color }}><i className={`fa-brands ${p.icon}`}></i></div>
                      <div><h5 className="text-xl font-black tracking-tight">{p.name}</h5><p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{p.sub}</p></div>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed h-10 line-clamp-2">{p.meta}</p>
                    <div className="mt-6"><span className="text-[9px] font-black bg-white/5 text-gray-500 px-3 py-1.5 rounded-full uppercase tracking-widest">Digital Publication</span></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-20">
               <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-2">Professional Q&A</h3>
               <div className="bg-[#121214] rounded-[48px] px-10 py-4 border border-white/5 mt-6">
                  <FAQItem question="SafeWrite 會代表我出版嗎？" answer="SafeWrite 作為您的專業發佈基礎設施。我們透過官方 API 管道處理責任移轉，確保您的稿件符合出版標準並正確送達平台，但最終版權與控制權 100% 屬於您。" />
                  <FAQItem question="這與檔案匯出有何不同？" answer="匯出只是產生文件。出版系統包含了 Metadata 校驗、封面整合以及與出版商官方後台的對接。這是一個專業的責任移轉過程。" />
               </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // STAGE 3: MANUSCRIPT FINALIZATION
  if (step === PubStep.FINALIZATION) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white">
        <header className="h-20 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5">
          <button onClick={() => setStep(PubStep.GALLERY)} className="w-10 h-10 flex items-center justify-start text-white"><i className="fa-solid fa-chevron-left text-lg"></i></button>
          <div className="text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">MANUSCRIPT FINALIZATION</h2>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mt-0.5">TARGET: {targetPlatform.toUpperCase()}</p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12">
          <section className="space-y-6">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">MANUSCRIPT DETAILS</label>
             <div className="space-y-4">
                <div className="bg-[#121214] h-20 rounded-3xl px-8 flex items-center border border-white/5"><h3 className="text-xl font-black tracking-tight">{payload.title}</h3></div>
                <input value={payload.subtitle} onChange={e => setPayload({...payload, subtitle: e.target.value})} placeholder="Subtitle or Tagline (Optional)" className="w-full h-20 bg-[#121214] border border-white/5 rounded-3xl px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
                <input value={payload.author} onChange={e => setPayload({...payload, author: e.target.value})} placeholder="Author Identity" className="w-full h-20 bg-[#121214] border border-white/5 rounded-3xl px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
             </div>
          </section>

          <section className="space-y-6">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">DESCRIPTION / BLURB</label>
             <textarea value={payload.description} onChange={e => setPayload({...payload, description: e.target.value})} placeholder="What is your work about?" className="w-full h-64 bg-[#121214] border border-white/5 rounded-[44px] p-8 text-sm font-medium text-gray-400 outline-none focus:border-blue-600 resize-none leading-relaxed" />
          </section>

          <div className="bg-blue-600/5 border border-blue-600/10 p-8 rounded-[44px] flex items-start space-x-5">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1"><i className="fa-solid fa-info text-[10px]"></i></div>
             <p className="text-[12px] text-gray-500 font-medium leading-relaxed">Your work will be delivered as a professional publication package. All content remains under your full ownership through the responsibility transfer protocol.</p>
          </div>
        </main>

        <footer className="p-8 pb-12 shrink-0">
           <button onClick={() => setStep(PubStep.DELIVERY)} className="w-full h-24 bg-blue-600 text-white rounded-[44px] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
              <i className="fa-solid fa-paper-plane text-xs"></i>
              <span className="text-[12px] font-black uppercase tracking-[0.4em]">DELIVER TO {targetPlatform.toUpperCase()}</span>
           </button>
        </footer>
      </div>
    );
  }

  // STAGE 4: DELIVERY SEQUENCE (OPTIMIZED & UNIFIED ANIMATION)
  if (step === PubStep.DELIVERY) {
    const currentStep = deliverySteps[deliveryPhase];
    const circumference = 741.42; // 2 * PI * 118
    const progressPercent = ((deliveryPhase + 1) / deliverySteps.length) * 100;
    
    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-700 text-center px-8">
        <div className="relative w-80 h-80 flex items-center justify-center mb-16 border border-blue-600/20 rounded-[48px] bg-black/40 shadow-[inset_0_0_40px_rgba(37,99,235,0.05)]">
           <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="118" className="stroke-white/5 fill-none" strokeWidth="8" />
                <circle 
                  cx="128" 
                  cy="128" 
                  r="118" 
                  className="stroke-blue-600 fill-none transition-all duration-[2000ms] ease-in-out" 
                  strokeWidth="8" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={circumference * (1 - progressPercent / 100)} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 text-4xl animate-pulse border border-blue-600/20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                    <i className={`fa-solid ${currentStep.icon}`}></i>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6 max-w-xl">
           <h2 className="text-4xl font-black tracking-tighter text-white animate-in slide-in-from-bottom-2 duration-700">{currentStep.title}</h2>
           <p className="text-[11px] text-blue-500 font-black uppercase tracking-[0.5em] opacity-80">{currentStep.en}</p>
        </div>

        <div className="mt-20 w-full max-w-xs space-y-6">
           {deliverySteps.map((s, i) => (
             <div key={i} className={`flex items-center space-x-6 transition-all duration-700 ${i <= deliveryPhase ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-1000 ${
                  i < deliveryPhase ? 'bg-blue-600 border-blue-600' : 
                  i === deliveryPhase ? 'bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse' : 
                  'bg-transparent border-white/20'
                }`} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${i === deliveryPhase ? 'text-white' : 'text-gray-600'}`}>{s.title}</span>
             </div>
           ))}
        </div>

        <footer className="absolute bottom-12 w-full text-center">
           <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">SAFEWRITE PUBLISHING AGENT ACTIVE</p>
        </footer>
      </div>
    );
  }

  // STAGE 5: SUCCESS
  if (step === PubStep.SUCCESS) {
    return (
      <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-12 animate-in fade-in duration-700 text-center">
         <div className="w-44 h-44 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_100px_rgba(37,99,235,0.25)] mb-16 animate-in zoom-in duration-1000">
            <i className="fa-solid fa-check text-6xl"></i>
         </div>

         <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-black tracking-tighter leading-tight text-white">Published successfully.</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Your work has been delivered to <span className="text-white font-black">{targetPlatform}</span> official distribution channel.
            </p>
         </div>

         <div className="mt-16 w-full max-w-md bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-widest">
               <span className="text-gray-600">CURRENT STATUS</span>
               <span className="text-blue-500 flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 animate-pulse"></div>UNDER REVIEW</span>
            </div>
            <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-widest">
               <span className="text-gray-600">EST. PROCESSING TIME</span>
               <span className="text-white">24–72 HOURS</span>
            </div>
            <div className="pt-8 border-t border-white/5">
               <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] leading-relaxed">
                 THIS SUBMISSION WAS SENT THROUGH THE OFFICIAL PUBLISHER CHANNEL.
               </p>
            </div>
         </div>

         <div className="mt-20 w-full max-w-md">
            <button 
              onClick={onClose}
              className="w-full h-24 bg-white text-black rounded-[48px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all hover:bg-gray-100"
            >
              VIEW PUBLISHING STATUS
            </button>
            <p className="mt-8 text-[10px] text-gray-700 font-black uppercase tracking-widest">SAFEWRITE PROFESSIONAL INFRASTRUCTURE</p>
         </div>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
