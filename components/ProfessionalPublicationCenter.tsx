
import React, { useState, useEffect, useMemo } from 'react';
import { Project, ISBNState, ChannelRule, SpineNodeId, PublishingSpineState, SpineNodeStatus } from '../types';
import { SPINE_NODES_CONFIG } from '../constants';
import ExportConfig from './ExportConfig';

enum PubStep { 
  SPINE_OVERVIEW, 
  TEMPLATE_GALLERY, 
  CONFIG, 
  DISTRIBUTION_GALLERY, 
  FINALIZATION, 
  DELIVERY_SEQUENCE, 
  SUCCESS 
}

interface ProfessionalPublicationCenterProps {
  project: Project | null;
  onClose: () => void;
  onUpdateProject?: (p: Project) => void;
}

const CHANNEL_RULES: Record<string, ChannelRule> = {
  'Amazon KDP (Kindle)': { requiresISBN: false, allowsPlatformISBN: false },
  'Amazon KDP (Paperback)': { requiresISBN: true, allowsPlatformISBN: true },
  'Google Books': { requiresISBN: false, allowsPlatformISBN: false },
  'Draft2Digital': { requiresISBN: false, allowsPlatformISBN: false },
  'IngramSpark': { requiresISBN: true, allowsPlatformISBN: false },
  'Apple Books': { requiresISBN: false, allowsPlatformISBN: false },
  'Medium': { requiresISBN: false, allowsPlatformISBN: false, isNonPublishing: true },
  'Substack': { requiresISBN: false, allowsPlatformISBN: false, isNonPublishing: true },
  'Traditional submission': { requiresISBN: false, allowsPlatformISBN: false, isNonPublishing: true },
  'Google Drive': { requiresISBN: false, allowsPlatformISBN: false, isNonPublishing: true },
  'Apple iCloud': { requiresISBN: false, allowsPlatformISBN: false, isNonPublishing: true },
  'Local Device': { requiresISBN: false, allowsPlatformISBN: false, isNonPublishing: true }
};

const ProfessionalPublicationCenter: React.FC<ProfessionalPublicationCenterProps> = ({ project, onClose, onUpdateProject }) => {
  const [step, setStep] = useState<PubStep>(PubStep.SPINE_OVERVIEW);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('t2');
  const [targetPlatform, setTargetPlatform] = useState('');
  const [deliveryPhase, setDeliveryPhase] = useState(0);
  const [showISBNPrompt, setShowISBNPrompt] = useState(false);

  const [config, setConfig] = useState({
    author: project?.publishingPayload?.author || 'Author Identity',
    isbn: project?.publishingPayload?.isbn13 || '',
    pubYear: '2026',
    languageCode: project?.publishingPayload?.languageCode || 'zh-TW',
    selectedFont: (project?.settings?.typography as 'serif' | 'sans') || 'serif',
    exportRange: 'all' as 'all' | 'custom',
    isPageNumbering: true,
    isHeadersFooters: false,
    shortDescription: project?.publishingPayload?.shortDescription || '',
    longDescription: project?.publishingPayload?.longDescription || ''
  });

  const handleUpdateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key === 'isbn') setShowISBNPrompt(false);
  };

  const channelRule = useMemo(() => CHANNEL_RULES[targetPlatform] || { requiresISBN: false, allowsPlatformISBN: false }, [targetPlatform]);
  
  const isbnState = useMemo(() => {
    if (!channelRule.requiresISBN) return ISBNState.NOT_REQUIRED;
    return config.isbn.trim().length >= 10 ? ISBNState.PROVIDED : ISBNState.REQUIRED_UNSET;
  }, [channelRule, config.isbn]);

  const handleInitiateDelivery = () => {
    if (channelRule.requiresISBN && isbnState === ISBNState.REQUIRED_UNSET) {
      setShowISBNPrompt(true);
      alert(`【出版驗證失敗】\n\n您選擇的通路「${targetPlatform}」要求提供 ISBN 識別碼。請在文稿細節區塊中填寫 13 位數 ISBN 後再執行投遞。`);
      return;
    }
    setStep(PubStep.DELIVERY_SEQUENCE);
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
  }, [step, deliverySteps.length]);

  if (step === PubStep.SPINE_OVERVIEW) {
    const nodes = project?.publishingSpine?.nodes || {};
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5 bg-black/80 backdrop-blur-3xl">
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 transition-all">
             <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <div className="text-center">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">PUBLISHING SPINE</h2>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-1">STATUS: {project?.name}</p>
          </div>
          <div className="w-12" />
        </header>
        
        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12 pb-64">
          <div className="text-center space-y-4 max-w-lg mx-auto">
             <h3 className="text-3xl font-black tracking-tighter">出版成熟度檢查</h3>
             <p className="text-sm text-gray-500 leading-relaxed font-medium">SafeWrite 協助您追蹤從草稿到全球發行的每一個關鍵節點。完成以下清單以解鎖分發功能。</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
             {Object.keys(SPINE_NODES_CONFIG).map((nodeId, idx) => {
                const configNode = SPINE_NODES_CONFIG[nodeId as SpineNodeId];
                const nodeStatus = nodes[nodeId as SpineNodeId];
                const isCompleted = nodeStatus?.isCompleted;
                const isCurrent = nodeId === (project?.publishingSpine?.currentNode || SpineNodeId.WRITING);

                return (
                  <div 
                    key={nodeId} 
                    className={`p-6 rounded-[32px] border transition-all flex items-center justify-between ${isCompleted ? 'bg-blue-600/10 border-blue-500/30' : isCurrent ? 'bg-[#1C1C1E] border-white/20 shadow-xl scale-[1.02]' : 'bg-[#121214] border-white/5 opacity-50'}`}
                  >
                     <div className="flex items-center space-x-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${isCompleted ? 'bg-blue-600 text-white' : isCurrent ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-gray-700'}`}>
                           <i className={`fa-solid ${configNode.icon}`}></i>
                        </div>
                        <div>
                           <h4 className="text-[15px] font-bold text-white tracking-tight">{configNode.label}</h4>
                           <p className="text-[10px] text-gray-500 font-medium mt-0.5">{configNode.description}</p>
                        </div>
                     </div>
                     <div className="flex items-center">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                             <i className="fa-solid fa-check"></i>
                          </div>
                        ) : isCurrent ? (
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">進行中</span>
                        ) : (
                          <i className="fa-solid fa-lock text-gray-800"></i>
                        )}
                     </div>
                  </div>
                );
             })}
          </div>

          {/* New Section: AI Pre-Publish Compliance Intelligence */}
          <div className="max-w-2xl mx-auto">
             <button className="w-full p-8 bg-[#1A2538] border border-blue-500/20 rounded-[44px] flex items-center justify-between group hover:border-blue-500/50 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                <div className="flex items-center space-x-5 relative z-10">
                   <div className="w-14 h-14 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-400 shadow-inner border border-blue-600/20">
                      <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
                   </div>
                   <div className="text-left">
                      <h4 className="text-[15px] font-black text-white uppercase tracking-[0.1em]">AI Pre-Publish Compliance Intelligence</h4>
                      <p className="text-[11px] text-gray-400 font-medium mt-1">執行全書稿件合規性深度掃描與 AI 預審報告</p>
                   </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all relative z-10"></i>
             </button>
          </div>
        </main>

        <footer className="absolute bottom-0 inset-x-0 p-8 pb-12 bg-gradient-to-t from-black via-black to-transparent shrink-0">
           <button 
             onClick={() => setStep(PubStep.TEMPLATE_GALLERY)} 
             className="w-full h-24 bg-white text-black rounded-[44px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
           >
              進入出版配置程序
           </button>
        </footer>
      </div>
    );
  }

  if (step === PubStep.TEMPLATE_GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#121417] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-6 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0">
          <button onClick={() => setStep(PubStep.SPINE_OVERVIEW)} className="w-10 h-10 flex items-center justify-start text-white"><i className="fa-solid fa-chevron-left text-xl"></i></button>
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
        config={{
          author: config.author,
          isbn: config.isbn,
          pubYear: config.pubYear,
          language: config.languageCode,
          selectedFont: config.selectedFont,
          exportRange: config.exportRange,
          isPageNumbering: config.isPageNumbering,
          isHeadersFooters: config.isHeadersFooters
        }}
        onUpdate={(key, val) => {
          if (key === 'author') handleUpdateConfig('author', val);
          else if (key === 'language') handleUpdateConfig('languageCode', val);
          else handleUpdateConfig(key, val);
        }}
      />
    );
  }

  if (step === PubStep.DISTRIBUTION_GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-center shrink-0 relative border-b border-white/5 bg-black">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full absolute left-8">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">DELIVERY & SUBMISSION</h2>
        </header>

        <main className="flex-1 px-8 py-12 space-y-16">
          <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-12 rounded-[56px] border border-blue-600/20 text-center">
             <h3 className="text-3xl font-black tracking-tight mb-3 text-white">From Draft to the World</h3>
             <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-lg mx-auto">Deliver your work through official global publishing channels.</p>
          </div>

          <div className="space-y-6">
             <div className="px-2 pt-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">一 鍵 自 動 投 遞 D I R E C T P U B L I S H I N G</h3>
             </div>

             <div className="space-y-8">
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-[#FADE4B] text-3xl">
                            <i className="fa-brands fa-amazon"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Amazon KDP (Kindle)</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">E-BOOK DISTRIBUTION</p>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Amazon KDP (Kindle)'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-20 bg-white text-black rounded-full text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      投 遞 至 K I N D L E
                    </button>
                </div>

                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-[#D4FF5F] text-3xl">
                            <i className="fa-solid fa-download"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">下載至本地</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">OFFLINE PERSISTENCE</p>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Local Device'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-24 bg-[#D4FF5F] text-black rounded-full text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      儲 存 檔 案 至 此 裝 置
                    </button>
                </div>
             </div>
          </div>
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
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">TARGET: {targetPlatform.toUpperCase()}</p>
          </div>
          <div className="w-10" />
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-12">
          <section className="space-y-6">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">AUTHOR INFORMATION</label>
            <div className="space-y-4">
                <input value={config.author} onChange={e => handleUpdateConfig('author', e.target.value)} placeholder="Author Identity" className="w-full h-20 bg-[#121214] border border-white/5 rounded-3xl px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
                <input value={config.isbn} onChange={e => handleUpdateConfig('isbn', e.target.value)} placeholder="ISBN-13 (Optional)" className="w-full h-20 bg-[#121214] border border-white/5 rounded-3xl px-8 text-sm font-bold text-gray-300 outline-none focus:border-blue-600" />
            </div>
          </section>

          <section className="space-y-6">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">SHORT DESCRIPTION (STORE LISTING)</label>
             <textarea value={config.shortDescription} onChange={e => handleUpdateConfig('shortDescription', e.target.value)} maxLength={200} placeholder="Quick blurb (max 200 chars)..." className="w-full h-32 bg-[#121214] border border-white/5 rounded-3xl p-8 text-sm font-medium text-gray-400 outline-none focus:border-blue-600 resize-none leading-relaxed" />
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">LONG DESCRIPTION (SYNOPSIS)</label>
             <textarea value={config.longDescription} onChange={e => handleUpdateConfig('longDescription', e.target.value)} placeholder="Full back cover copy and synopsis..." className="w-full h-64 bg-[#121214] border border-white/5 rounded-[44px] p-8 text-sm font-medium text-gray-400 outline-none focus:border-blue-600 resize-none leading-relaxed" />
          </section>
        </main>
        <footer className="p-8 pb-12 shrink-0">
           <button 
             onClick={handleInitiateDelivery} 
             className="w-full h-24 bg-blue-600 text-white rounded-[44px] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all"
           >
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
      </div>
    );
  }

  if (step === PubStep.SUCCESS) {
    return (
      <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-12 animate-in fade-in duration-700 text-center font-sans">
         <div className="w-44 h-44 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_100px_rgba(37,99,235,0.25)] mb-16 animate-in zoom-in duration-1000"><i className="fa-solid fa-check text-6xl"></i></div>
         <div className="space-y-6 max-md">
           <h1 className="text-5xl font-black tracking-tighter leading-tight text-white">Published Successfully.</h1>
           <p className="text-lg text-gray-500 font-medium leading-relaxed">
             Your work has been delivered to {targetPlatform} official distribution channel.
           </p>
         </div>
         <div className="mt-20 w-full max-w-md">
            <button onClick={onClose} className="w-full h-24 bg-white text-black rounded-[48px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-[0.95] transition-all">
              VIEW PUBLISHING STATUS
            </button>
         </div>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
