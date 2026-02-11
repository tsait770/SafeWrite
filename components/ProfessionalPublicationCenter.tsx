import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import ExportConfig from './ExportConfig';

enum PubStep { TEMPLATE_GALLERY, CONFIG, DISTRIBUTION_GALLERY, FINALIZATION, DELIVERY_SEQUENCE, SUCCESS }

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
        className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className="text-[13px] font-bold text-gray-400 group-hover:text-white transition-colors">{question}</span>
        <i className={`fa-solid fa-chevron-up text-[10px] text-blue-500 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="pb-8 text-[12px] text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300 font-medium">
          {answer}
        </div>
      )}
    </div>
  );
};

const ProfessionalPublicationCenter: React.FC<ProfessionalPublicationCenterProps> = ({ project, onClose }) => {
  const [step, setStep] = useState<PubStep>(PubStep.TEMPLATE_GALLERY);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('t2');
  const [targetPlatform, setTargetPlatform] = useState('');
  const [deliveryPhase, setDeliveryPhase] = useState(0);

  const [config, setConfig] = useState({
    author: project?.publishingPayload?.author || 'Author Identity',
    isbn: project?.publishingPayload?.isbn13 || '',
    pubYear: '2026',
    language: project?.publishingPayload?.language || 'English',
    selectedFont: (project?.settings?.typography as 'serif' | 'sans') || 'serif',
    exportRange: 'all' as 'all' | 'custom',
    isPageNumbering: true,
    isHeadersFooters: false
  });

  const handleUpdateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const templates = [
    { id: 't1', name: 'Modern Novel', subtitle: 'Professional serif layout', type: 'FREE', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop' },
    { id: 't2', name: 'Academic Paper', subtitle: 'Standard APA format', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop' },
    { id: 't3', name: 'Screenplay', subtitle: 'Industry standard layout', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop' },
    { id: 't4', name: 'Technical Manual', subtitle: 'Structured technical guide', type: 'FREE', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
  ];

  const deliverySteps = [
    { title: '內容標準化與 AST 解析', en: 'CONTENT NORMALIZATION & AST PARSING', icon: 'fa-microchip' },
    { title: '生成編輯母檔校驗', en: 'GENERATING EDITORIAL ARTIFACT', icon: 'fa-microchip' },
    { title: '封裝印刷級 PDF 手稿', en: 'PACKAGING HIGH-FIDELITY PDF', icon: 'fa-rocket' },
    { title: '構建出版規格電子書', en: 'BUILDING STANDARDS E-BOOK', icon: 'fa-microchip' },
    { title: '加密傳輸至出版商通道', en: 'ENCRYPTED DELIVERY TO API', icon: 'fa-rocket' }
  ];

  useEffect(() => {
    if (step === PubStep.DELIVERY_SEQUENCE) {
      const interval = setInterval(() => {
        setDeliveryPhase(prev => {
          if (prev < deliverySteps.length - 1) return prev + 1;
          clearInterval(interval);
          setTimeout(() => setStep(PubStep.SUCCESS), 1500);
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (step === PubStep.TEMPLATE_GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#121417] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-6 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-start text-white"><i className="fa-solid fa-chevron-left text-xl"></i></button>
          <h2 className="text-[17px] font-black tracking-tight">Export Gallery</h2>
          <button className="w-10 h-10 flex items-center justify-end text-white"><i className="fa-solid fa-ellipsis"></i></button>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
            <input type="text" placeholder="Search templates..." className="w-full h-[60px] bg-[#1C1C1E] rounded-2xl pl-14 pr-6 text-sm font-medium text-white outline-none placeholder-gray-500" />
          </div>
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PDF', 'DOCX', 'EPUB'].map((f, i) => (
              <button key={f} className={`px-8 py-3 rounded-full text-[13px] font-black tracking-widest transition-all shrink-0 ${i === 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#2C2C2E] text-gray-400'}`}>{f}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 pb-32">
            {templates.map((t) => (
              <div key={t.id} className="flex flex-col space-y-4 cursor-pointer" onClick={() => { setSelectedTemplateId(t.id); setStep(PubStep.CONFIG); }}>
                <div className={`aspect-[3/4] rounded-[24px] relative overflow-hidden bg-gray-900 border-2 ${selectedTemplateId === t.id ? 'border-blue-500' : 'border-transparent'}`}>
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.type === 'FREE' ? 'bg-[#3A3A3C]' : 'bg-blue-600 shadow-xl'}`}>{t.type}</div>
                </div>
                <div><h4 className="text-[17px] font-black tracking-tight">{t.name}</h4><p className="text-[12px] text-gray-500 font-medium tracking-tight mt-1">{t.subtitle}</p></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (step === PubStep.CONFIG) {
    return (
      <ExportConfig 
        project={project}
        onBack={() => setStep(PubStep.TEMPLATE_GALLERY)}
        onNext={() => setStep(PubStep.DISTRIBUTION_GALLERY)}
        config={config}
        onUpdate={handleUpdateConfig}
      />
    );
  }

  if (step === PubStep.DISTRIBUTION_GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-center shrink-0 relative border-b border-white/5">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full absolute left-8">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">DELIVERY & SUBMISSION</h2>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-12 no-scrollbar space-y-16">
          {/* Top Banner */}
          <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-10 rounded-[56px] border border-blue-600/20">
             <h3 className="text-2xl font-black tracking-tight mb-2 text-white">From Draft to the World</h3>
             <p className="text-sm text-gray-400 leading-relaxed font-medium">Deliver your work through official global publishing channels. This is where your journey from manuscript to published work completes.</p>
          </div>

          {/* Section 1: Submission */}
          <div className="space-y-6">
             <div className="px-2">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">投 遞 與 出 版 S U B M I S S I O N</h3>
                <p className="text-[10px] text-gray-800 font-bold mt-1.5 uppercase tracking-widest">直接投遞至出版平台或指定編輯</p>
             </div>
             
             <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center space-x-6">
                   <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-paper-plane text-2xl"></i></div>
                   <div>
                      <h4 className="text-2xl font-black tracking-tight leading-none">一鍵自動投遞</h4>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-2">DIRECT PUBLISHING</p>
                   </div>
                </div>
                <div className="bg-black/50 h-[72px] rounded-[24px] px-8 flex items-center justify-between border border-white/5 shadow-inner">
                   <div className="flex items-center space-x-4 text-gray-500">
                      <i className="fa-solid fa-building-columns text-lg"></i>
                      <span className="text-[15px] font-bold">選擇目標出版社...</span>
                   </div>
                   <i className="fa-solid fa-chevron-down text-gray-800 text-[10px]"></i>
                </div>
                <button 
                  onClick={() => { setTargetPlatform('出版社'); setStep(PubStep.FINALIZATION); }} 
                  className="w-full h-20 bg-white text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all hover:bg-gray-100"
                >
                  啟 動 全 球 投 遞 程 序
                </button>
             </div>
          </div>

          {/* Section 2: Direct Publishing */}
          <div className="space-y-6">
             <div className="px-2 pt-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">一 鍵 自 動 投 遞 D I R E C T P U B L I S H I N G</h3>
                <p className="text-[13px] text-[#D4FF5F] font-black tracking-tight mt-1.5">直接對接全球主流發行商</p>
             </div>

             <div className="space-y-8">
                {/* Amazon KDP */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-[#FADE4B] text-3xl">
                            <i className="fa-brands fa-amazon"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Amazon KDP</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">KINDLE DIRECT PUBLISHING</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 bg-[#FADE4B] text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">全球發行</div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Amazon KDP'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-20 bg-[#FADE4B] text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      投 遞 至 A M A Z O N K D P
                    </button>
                </div>

                {/* Apple Books */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-white text-3xl">
                            <i className="fa-brands fa-apple"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Apple Books</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">APPLE PUBLISHING</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">數位出版</div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Apple Books'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-20 bg-white text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      發 佈 至 A P P L E B O O K S
                    </button>
                </div>

                {/* Google Books */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-[#EA4335] text-3xl">
                            <i className="fa-brands fa-google"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Google Books</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">PARTNER PROGRAM</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">數位出版</div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Google Books'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-20 bg-[#EA4335] text-white rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      發 佈 至 G O O G L E B O O K S
                    </button>
                </div>

                {/* Substack */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-[#FF6719] text-3xl">
                            <i className="fa-brands fa-substack"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Substack</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">建立您的訂閱電子報與寫作社群。</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">數位出版</div>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed h-10 line-clamp-2 px-2">Serial / Newsletter publication hub</p>
                    <button 
                      onClick={() => { setTargetPlatform('Substack'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-20 bg-[#FF6719] text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      發 佈 至 S U B S T A C K
                    </button>
                </div>

                {/* Draft2Digital */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-[#10B981] text-3xl">
                            <i className="fa-solid fa-share-nodes"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Draft2Digital</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">MULTI-PLATFORM AGGREGATOR</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">數位出版</div>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed h-10 line-clamp-2 px-2">Global distribution to Apple, Kobo, and libraries</p>
                    <button 
                      onClick={() => { setTargetPlatform('Draft2Digital'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-20 bg-[#10B981] text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      發 佈 至 D R A F T 2 D I G I T A L
                    </button>
                </div>

                {/* Traditional Submission Package */}
                <button onClick={() => { setTargetPlatform('Traditional submission'); setStep(PubStep.FINALIZATION); }} className="w-full bg-[#121214] rounded-[56px] p-12 border border-white/5 border-dashed text-left transition-all hover:scale-[1.01] hover:bg-[#1A1A1C] group">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-2xl text-blue-500"><i className="fa-solid fa-file-lines"></i></div>
                    <div><h5 className="text-xl font-black tracking-tight">Traditional Submission Package</h5><p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">FOR AGENT & PUBLISHER REVIEW</p></div>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed mb-10 px-2">No direct submission required. We prepare industry-standard submission materials including synopsis, bio, and sample chapters.</p>
                  <div className="flex justify-end"><i className="fa-solid fa-chevron-right text-gray-800 group-hover:text-blue-500 transition-colors"></i></div>
                </button>
             </div>
          </div>

          <section className="pb-24">
             <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-2">PROFESSIONAL Q & A</h3>
             <div className="bg-[#121214] rounded-[48px] px-10 py-4 border border-white/5 mt-6 shadow-2xl">
                <FAQItem question="SafeWrite 會代表我出版嗎？" answer="SafeWrite 作為您的專業發佈基礎設施。我們透過官方 API 管道處理責任移轉，確保您的稿件符合出版標準並正確送達平台，但最終版權與控制權 100% 屬於您。" />
                <FAQItem question="這與檔案匯出有何不同？" answer="匯出只是產生文件。出版系統包含了 Metadata 校驗、封面整合以及與出版商官方後台的對接。這是一個專業的責任移轉過程。" />
             </div>
          </section>
        </main>
      </div>
    );
  }

  if (step === PubStep.FINALIZATION) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5">
          <button onClick={() => setStep(PubStep.DISTRIBUTION_GALLERY)} className="w-10 h-10 flex items-center justify-start text-white opacity-60"><i className="fa-solid fa-chevron-left text-lg"></i></button>
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
                <div className="bg-[#121214] h-20 rounded-3xl px-8 flex items-center border border-white/5"><h3 className="text-xl font-black tracking-tight">{project?.name}</h3></div>
                <input value={config.author} onChange={e => handleUpdateConfig('author', e.target.value)} placeholder="Author Identity" className="w-full h-20 bg-[#121214] border border-white/5 rounded-3xl px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
                <input value={config.isbn} onChange={e => handleUpdateConfig('isbn', e.target.value)} placeholder="ISBN-13 (Optional)" className="w-full h-20 bg-[#121214] border border-white/5 rounded-3xl px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
             </div>
          </section>
          <section className="space-y-6">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">DESCRIPTION / BLURB</label>
             <textarea placeholder="What is your work about?" className="w-full h-64 bg-[#121214] border border-white/5 rounded-[44px] p-8 text-sm font-medium text-gray-400 outline-none focus:border-blue-600 resize-none leading-relaxed" />
          </section>
          <div className="bg-blue-600/5 border border-blue-600/10 p-8 rounded-[44px] flex items-start space-x-5">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1"><i className="fa-solid fa-info text-[10px]"></i></div>
             <p className="text-[12px] text-gray-500 font-medium leading-relaxed">Your work will be delivered as a professional publication package. All content remains under your full ownership through the responsibility transfer protocol.</p>
          </div>
        </main>
        <footer className="p-8 pb-12 shrink-0">
           <button onClick={() => setStep(PubStep.DELIVERY_SEQUENCE)} className="w-full h-24 bg-blue-600 text-white rounded-[44px] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
              <i className="fa-solid fa-paper-plane text-xs"></i>
              <span className="text-[12px] font-black uppercase tracking-[0.4em]">DELIVER TO {targetPlatform.toUpperCase()}</span>
           </button>
        </footer>
      </div>
    );
  }

  if (step === PubStep.DELIVERY_SEQUENCE) {
    const currentStep = deliverySteps[deliveryPhase];
    const circumference = 741.42; 
    const progressPercent = ((deliveryPhase + 1) / deliverySteps.length) * 100;
    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-700 text-center px-8">
        <div className="relative w-80 h-80 flex items-center justify-center mb-16 border border-blue-600/20 rounded-[48px] bg-black/40 shadow-[inset_0_0_40px_rgba(37,99,235,0.05)]">
           <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="118" className="stroke-white/5 fill-none" strokeWidth="8" />
                <circle cx="128" cy="128" r="118" className="stroke-blue-600 fill-none transition-all duration-[2000ms] ease-in-out" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progressPercent / 100)} strokeLinecap="round" />
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
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-1000 ${i < deliveryPhase ? 'bg-blue-600 border-blue-600' : i === deliveryPhase ? 'bg-blue-500 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse' : 'bg-transparent border-white/20'}`} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${i === deliveryPhase ? 'text-white' : 'text-gray-600'}`}>{s.title}</span>
             </div>
           ))}
        </div>
        <footer className="absolute bottom-12 w-full text-center"><p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">SAFEWRITE PUBLISHING AGENT ACTIVE</p></footer>
      </div>
    );
  }

  if (step === PubStep.SUCCESS) {
    return (
      <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-12 animate-in fade-in duration-700 text-center font-sans">
         <div className="w-44 h-44 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_100px_rgba(37,99,235,0.25)] mb-16 animate-in zoom-in duration-1000"><i className="fa-solid fa-check text-6xl"></i></div>
         <div className="space-y-6 max-md"><h1 className="text-5xl font-black tracking-tighter leading-tight text-white">Published successfully.</h1><p className="text-lg text-gray-500 font-medium leading-relaxed">Your work has been delivered to <span className="text-white font-black">{targetPlatform}</span> official distribution channel.</p></div>
         <div className="mt-16 w-full max-w-md bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-widest"><span className="text-gray-600">CURRENT STATUS</span><span className="text-blue-500 flex items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 animate-pulse"></div>UNDER REVIEW</span></div>
            <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-widest"><span className="text-gray-600">EST. PROCESSING TIME</span><span className="text-white">24–72 HOURS</span></div>
         </div>
         <div className="mt-20 w-full max-w-md"><button onClick={onClose} className="w-full h-24 bg-white text-black rounded-[48px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">VIEW PUBLISHING STATUS</button></div>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
