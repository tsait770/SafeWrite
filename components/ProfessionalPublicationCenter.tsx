
import React, { useState, useEffect, useMemo } from 'react';
import { Project, ISBNState, ChannelRule, SpineNodeId, PublishingSpineState, SpineNodeStatus, CoverAssetType } from '../types';
import { SPINE_NODES_CONFIG, INITIAL_SPINE_NODES } from '../constants';
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
  'Draft2Digital': { requiresISBN: false, allowsPlatformISBN: false, exclusiveRisk: false },
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
  const [isISBNAssistantOpen, setIsISBNAssistantOpen] = useState(false);

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

  // ISBN-13 Validation Logic
  const isValidISBN13 = (isbn: string) => {
    const clean = isbn.replace(/[- ]/g, "");
    return /^\d{13}$/.test(clean);
  };

  const handleUpdateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    if (key === 'isbn') {
      setShowISBNPrompt(false);
      // Sync ISBN and Spine Status to Project immediately for persistence
      if (onUpdateProject && project) {
        const isNowValid = isValidISBN13(value);
        const currentSpine = project.publishingSpine || { currentNode: SpineNodeId.WRITING, nodes: INITIAL_SPINE_NODES() };
        
        const updatedSpine: PublishingSpineState = {
          ...currentSpine,
          nodes: {
            ...currentSpine.nodes,
            [SpineNodeId.ISBN_ASSIGNED]: {
              id: SpineNodeId.ISBN_ASSIGNED,
              isCompleted: isNowValid,
              timestamp: isNowValid ? Date.now() : currentSpine.nodes[SpineNodeId.ISBN_ASSIGNED]?.timestamp
            }
          }
        };

        onUpdateProject({
          ...project,
          publishingPayload: {
            ...(project.publishingPayload || {} as any),
            isbn13: value
          },
          publishingSpine: updatedSpine
        });
      }
    }
  };

  const channelRule = useMemo(() => CHANNEL_RULES[targetPlatform] || { requiresISBN: false, allowsPlatformISBN: false }, [targetPlatform]);
  
  const isbnState = useMemo(() => {
    if (!channelRule.requiresISBN) return ISBNState.NOT_REQUIRED;
    return isValidISBN13(config.isbn) ? ISBNState.PROVIDED : ISBNState.REQUIRED_UNSET;
  }, [channelRule, config.isbn]);

  const handleInitiateDelivery = () => {
    if (channelRule.requiresISBN && isbnState === ISBNState.REQUIRED_UNSET) {
      setShowISBNPrompt(true);
      alert(`【出版驗證失敗】\n\n您選擇的通路「${targetPlatform}」要求提供正確的 13 位數 ISBN 識別碼。請點擊「取得 ISBN 協助」或手動填寫。`);
      return;
    }
    setStep(PubStep.DELIVERY_SEQUENCE);
  };

  const generateMockISBN = () => {
    const randomSuffix = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const mock = `978${randomSuffix}0`; // Simplified mock
    handleUpdateConfig('isbn', mock);
    setIsISBNAssistantOpen(false);
  };

  const templates = [
    { id: 't1', name: 'Modern Novel', subtitle: 'Professional serif layout', type: 'FREE', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop' },
    { id: 't2', name: 'Academic Paper', subtitle: 'Standard APA format', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop' },
    { id: 't3', name: 'Screenplay', subtitle: 'Industry standard layout', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop' },
    { id: 't4', name: 'Technical Manual', subtitle: 'Structured technical guide', type: 'FREE', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
  ];

  const deliverySteps = [
    { title: '內容標準化與 AST 解析', en: 'CONTENT NORMALIZATION & AST PARSING', icon: 'fa-microchip' },
    { title: '選取最佳封面資產', en: 'SELECTING OPTIMAL COVER ASSET', icon: 'fa-image' },
    { title: '生成 DOCX 編輯母檔', en: 'GENERATING EDITORIAL DOCX ARTIFACT', icon: 'fa-file-lines' },
    { title: '封裝 PDF 印刷級手稿', en: 'PACKAGING HIGH-FIDELITY PDF', icon: 'fa-file-pdf' },
    { title: '構建 EPUB 3 出版規格電子書', en: 'BUILDING EPUB 3 STANDARDS E-BOOK', icon: 'fa-book' },
    { title: '加密傳輸至出版商通道', en: 'ENCRYPTED DELIVERY TO PLATFORM API', icon: 'fa-paper-plane' }
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
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const selectedCover = useMemo(() => {
    if (!project?.publishingPayload?.coverAssets) return null;
    const assets = project.publishingPayload.coverAssets;
    
    // Optimized selection logic based on target channel
    if (targetPlatform.includes('Paperback') || targetPlatform === 'IngramSpark') {
      return assets[CoverAssetType.PRINT_PAPERBACK] || assets[CoverAssetType.EBOOK_DIGITAL] || assets[CoverAssetType.DOC_PREVIEW];
    }
    if (targetPlatform.includes('Kindle') || targetPlatform === 'Apple Books' || targetPlatform === 'Google Books') {
      return assets[CoverAssetType.EBOOK_DIGITAL] || assets[CoverAssetType.DOC_PREVIEW];
    }
    return assets[CoverAssetType.DOC_PREVIEW] || assets[CoverAssetType.EBOOK_DIGITAL];
  }, [targetPlatform, project]);

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
             <p className="text-sm text-gray-500 leading-relaxed font-medium">InsPublish 協助您追蹤從草稿到全球發行的每一個關鍵節點。完成以下清單以解鎖分發功能。</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
             {Object.keys(SPINE_NODES_CONFIG).map((nodeId) => {
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
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar text-white font-sans pb-48">
        <header className="h-[86px] px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-center shrink-0 relative border-b border-white/5 bg-black z-[100]">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full absolute left-8 active:scale-90 transition-all">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">DELIVERY & SUBMISSION</h2>
        </header>

        <main className="flex-1 px-6 sm:px-12 py-10 space-y-12 max-w-4xl mx-auto w-full">
          <div className="bg-[#121214] p-10 sm:p-14 rounded-[56px] border border-white/5 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent" />
             <h3 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 text-white relative z-10">From Draft to the World</h3>
             <p className="text-[16px] text-gray-500 leading-relaxed font-medium max-w-xl mx-auto relative z-10">Deliver your work through official global publishing channels. This is where your journey from manuscript to published work completes.</p>
          </div>

          <div className="grid grid-cols-1 gap-10">
                <div className="bg-[#121214] rounded-[56px] p-10 sm:p-14 space-y-12 border border-white/5 shadow-2xl transition-all">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-8">
                          <div className="w-20 h-20 rounded-[28px] bg-black border border-white/5 flex items-center justify-center text-[#FADE4B] text-4xl shadow-inner">
                            <i className="fa-brands fa-amazon"></i>
                          </div>
                          <div>
                            <h4 className="text-3xl font-black tracking-tight text-white">Amazon KDP (Kindle)</h4>
                            <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">E-BOOK DISTRIBUTION</p>
                          </div>
                       </div>
                       <div className="px-6 py-3 bg-[#2563EB] text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg">電子書</div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Amazon KDP (Kindle)'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-[86px] bg-white text-black rounded-full text-[14px] font-black uppercase tracking-[0.6em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      投 遞 至 K I N D L E
                    </button>
                </div>

                <div className="bg-[#121214] rounded-[56px] p-10 sm:p-14 space-y-12 border border-white/5 shadow-2xl transition-all">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-8">
                          <div className="w-20 h-20 rounded-[28px] bg-black border border-white/5 flex items-center justify-center text-[#FADE4B] text-4xl shadow-inner">
                            <i className="fa-solid fa-book-bookmark"></i>
                          </div>
                          <div>
                            <h4 className="text-3xl font-black tracking-tight text-white">Amazon KDP (Paperback)</h4>
                            <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">PRINT ON DEMAND</p>
                          </div>
                       </div>
                       <div className="px-6 py-3 bg-[#FADE4B] text-black text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg">實體出版</div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('Amazon KDP (Paperback)'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-[86px] bg-[#FADE4B] text-black rounded-full text-[14px] font-black uppercase tracking-[0.6em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      投 遞 至 A M A Z O N 實 體 版
                    </button>
                </div>

                <div className="bg-[#121214] rounded-[56px] p-10 sm:p-14 space-y-12 border border-white/5 shadow-2xl transition-all">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-8">
                          <div className="w-20 h-20 rounded-full bg-white border border-white/5 flex items-center justify-center p-1 shadow-inner overflow-hidden">
                             <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="46" fill="white" stroke="#5DA2C1" strokeWidth="4" />
                                <g transform="translate(15, 30) scale(0.7)">
                                   <text x="0" y="25" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="900" fill="#5DA2C1">Ingram</text>
                                   <text x="0" y="50" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="900" fill="#FADE4B">Spark</text>
                                </g>
                             </svg>
                          </div>
                          <div>
                            <h4 className="text-3xl font-black tracking-tight text-white">IngramSpark</h4>
                            <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">GLOBAL RETAIL NETWORK</p>
                          </div>
                       </div>
                       <div className="px-6 py-4 bg-[#FF9F1C] text-black text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg flex flex-col items-center justify-center leading-none">
                          <span className="mb-1">ISBN</span>
                          <span>必備</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => { setTargetPlatform('IngramSpark'); setStep(PubStep.FINALIZATION); }} 
                      className="w-full h-[86px] bg-[#2563EB] text-white rounded-full text-[14px] font-black uppercase tracking-[0.6em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      投 遞 至 I N G R A M S P A R K
                    </button>
                </div>
          </div>
          <div className="h-40" />
        </main>
      </div>
    );
  }

  if (step === PubStep.FINALIZATION) {
    const isTraditional = targetPlatform === 'Traditional submission';
    
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-[86px] px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5 bg-black/80">
          <button onClick={() => setStep(PubStep.DISTRIBUTION_GALLERY)} className="w-12 h-12 flex items-center justify-start text-white opacity-60 active:scale-90 transition-all"><i className="fa-solid fa-chevron-left text-lg"></i></button>
          <div className="text-center">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">{isTraditional ? 'SUBMISSION PREPARATION' : 'PUBLISHING FINAL CHECK'}</h2>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-1">TARGET: {targetPlatform.toUpperCase()}</p>
          </div>
          <div className="w-12" />
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-9 no-scrollbar space-y-10 pb-40">
           
           <section className="space-y-5">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-2">PUBLICATION COVER ASSET</label>
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 flex items-center space-x-6">
                 <div className="w-24 h-32 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
                   {selectedCover ? <img src={selectedCover.url} className="w-full h-full object-cover" alt="Selected" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><i className="fa-solid fa-image"></i></div>}
                 </div>
                 <div>
                    <h4 className="text-[15px] font-black text-white">{selectedCover ? `已自動選取 ${selectedCover.type.replace('_', ' ')}` : '尚未選取封面資產'}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">{selectedCover?.isCompliant ? '✅ 規格檢測已通過' : '⚠️ 建議進入封面管理重新校準'}</p>
                 </div>
              </div>
           </section>

           <section className="space-y-5">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-2">MANUSCRIPT DETAILS</label>
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-9 shadow-inner group">
                 <h3 className="text-[28px] font-black text-white tracking-tighter leading-tight">{project?.name || "The Solar Paradox"}</h3>
              </div>
           </section>

           <section className="space-y-5">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">AUTHOR & ISBN</label>
                {channelRule.requiresISBN && (
                  <button 
                    onClick={() => setIsISBNAssistantOpen(true)}
                    className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
                  >
                    取得 ISBN 協助
                  </button>
                )}
              </div>
              <div className="space-y-5">
                  <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-inner">
                    <input 
                      value={config.author} 
                      onChange={e => handleUpdateConfig('author', e.target.value)} 
                      placeholder="Author Identity" 
                      className="w-full h-[86px] px-9 text-[18px] font-black text-white bg-transparent outline-none focus:border-blue-600 transition-all placeholder-white/10" 
                    />
                  </div>
                  {channelRule.requiresISBN && (
                    <div className="space-y-3">
                      <div className={`border rounded-[36px] overflow-hidden transition-all shadow-inner ${showISBNPrompt ? 'border-red-500 bg-red-500/5' : isbnState === ISBNState.REQUIRED_UNSET ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-white/5'}`}>
                        <input 
                          value={config.isbn} 
                          onChange={e => handleUpdateConfig('isbn', e.target.value)} 
                          placeholder="ISBN-13 (Required: 13 digits)" 
                          className={`w-full h-[86px] px-9 text-[18px] font-black bg-[#121214] outline-none transition-all ${showISBNPrompt ? 'text-red-500' : isbnState === ISBNState.REQUIRED_UNSET ? 'text-amber-500' : 'text-[#D4FF5F]'}`} 
                        />
                      </div>
                      <p className="text-[10px] text-gray-600 px-4">格式提示：需為 13 位數字。範例：9780123456789</p>
                    </div>
                  )}
              </div>
           </section>
        </main>
        
        <footer className="fixed bottom-0 inset-x-0 p-7 pb-10 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
           <div className="max-w-4xl mx-auto">
             <button 
               onClick={handleInitiateDelivery} 
               className={`w-full h-[86px] rounded-full flex items-center justify-center space-x-5 shadow-[0_25px_60px_rgba(37,99,235,0.4)] bg-[#2563EB] text-white active:scale-[0.98] transition-all hover:scale-101`}
             >
                <i className="fa-solid fa-paper-plane text-xs"></i>
                <span className="text-[14px] font-black uppercase tracking-[0.45em]">
                  DELIVER TO {targetPlatform.toUpperCase()}
                </span>
             </button>
           </div>
        </footer>

        {/* ISBN Assistant Modal */}
        {isISBNAssistantOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
             <div className="w-full max-w-xl bg-[#1C1C1E] rounded-[44px] border border-white/10 overflow-hidden shadow-3xl animate-in zoom-in duration-500">
                <header className="p-10 border-b border-white/5 flex justify-between items-center">
                   <div>
                     <h3 className="text-2xl font-black text-white tracking-tight">ISBN 取得助手</h3>
                     <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">ISBN REGISTRATION PROTOCOL</p>
                   </div>
                   <button onClick={() => setIsISBNAssistantOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                      <i className="fa-solid fa-xmark text-xl"></i>
                   </button>
                </header>
                <div className="p-10 space-y-8">
                   <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl space-y-4">
                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white"><i className="fa-solid fa-earth-americas"></i></div>
                         <h4 className="text-lg font-bold text-white">官方申請管道</h4>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">ISBN 是圖書的唯一識別碼。您可以透過國家圖書館或專業代理機構（如 Bowker）申請正式 ISBN。</p>
                      <div className="flex flex-wrap gap-3">
                         <a href="https://isbn.ncl.edu.tw/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">台灣國家圖書館 (NCL)</a>
                         <a href="https://www.myidentifiers.com/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">美國 Bowker</a>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-widest px-1">測試與草稿用途</h4>
                      <button 
                        onClick={generateMockISBN}
                        className="w-full p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-left flex items-center justify-between group hover:border-amber-500/50 transition-all"
                      >
                         <div className="flex items-center space-x-5">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black"><i className="fa-solid fa-flask"></i></div>
                            <div>
                               <p className="text-[15px] font-bold text-white">產生模擬驗證碼</p>
                               <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-0.5">FOR PREVIEW ONLY</p>
                            </div>
                         </div>
                         <i className="fa-solid fa-chevron-right text-gray-700 group-hover:text-amber-500 transition-colors"></i>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  if (step === PubStep.DELIVERY_SEQUENCE) {
    const currentStep = deliverySteps[deliveryPhase];
    const progressPercent = ((deliveryPhase + 1) / deliverySteps.length) * 100;
    const circumference = 753.98;

    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-700 text-center px-8 font-sans">
        <div className="relative w-80 h-80 flex items-center justify-center mb-20">
           <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="120" className="stroke-white/5 fill-none" strokeWidth="6" />
              <circle 
                cx="150" 
                cy="150" 
                r="120" 
                className="stroke-blue-600 fill-none transition-all duration-[2000ms] ease-in-out" 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={circumference * (1 - progressPercent / 100)} 
                strokeLinecap="round" 
              />
           </svg>
           <div className="w-24 h-24 bg-blue-600/10 rounded-[32px] flex items-center justify-center text-blue-500 text-5xl animate-pulse border border-blue-600/20 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              <i className={`fa-solid ${currentStep.icon}`}></i>
           </div>
        </div>

        <div className="space-y-6 max-w-xl mb-24">
           <h2 className="text-4xl font-black tracking-tighter text-white">{currentStep.title}</h2>
           <p className="text-[11px] text-blue-500 font-black uppercase tracking-[0.5em] opacity-80">{currentStep.en}</p>
        </div>
      </div>
    );
  }

  if (step === PubStep.SUCCESS) {
    return (
      <div className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-700 text-center font-sans overflow-hidden">
         <div className="relative w-52 h-52 flex items-center justify-center mb-20 animate-in zoom-in duration-1000">
            <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[80px]" />
            <div className="w-44 h-44 rounded-full border-2 border-blue-600/20 bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-[0_0_60px_rgba(37,99,235,0.2)]">
               <i className="fa-solid fa-check text-7xl"></i>
            </div>
         </div>
         <h1 className="text-5xl font-black tracking-tighter leading-tight text-white mb-6">Published successfully.</h1>
         <button onClick={onClose} className="mt-12 w-full max-w-md h-24 bg-white text-black rounded-[44px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-[0.95] transition-all">
           VIEW PUBLISHING STATUS
         </button>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
