
import React, { useState } from 'react';
import { Project } from '../types';
import JSZip from 'jszip';

enum PubStep { GALLERY, CONFIG, DELIVERY, SUCCESS }

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
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-[13px] font-medium text-gray-400 group-hover:text-white transition-colors">{question}</span>
        <i className={`fa-solid fa-chevron-down text-[10px] text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="pb-5 text-[12px] text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

const ProfessionalPublicationCenter: React.FC<ProfessionalPublicationCenterProps> = ({ project, onClose }) => {
  const [step, setStep] = useState<PubStep>(PubStep.GALLERY);
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedTemplateId, setSelectedTemplateId] = useState('t2'); 
  const [isPageNumbering, setIsPageNumbering] = useState(true);
  const [isHeadersFooters, setIsHeadersFooters] = useState(false);
  const [selectedFont, setSelectedFont] = useState<'serif' | 'sans'>('serif');
  const [exportRange, setExportRange] = useState<'all' | 'custom'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('');

  const [author, setAuthor] = useState('Author Name');
  const [isbn, setIsbn] = useState('ISBN-13 (Optional)');
  const [pubYear, setPubYear] = useState('2026');
  const [language, setLanguage] = useState('English');

  const languages = [
    "English", "繁體中文", "简体中文", "Español", "Português (Brasil)", "Português",
    "Deutsch", "Français", "Italiano", "Nederlands", "Svenska", "Türkçe", "Русский",
    "日本語", "韓國語", "ไทย", "Tiếng Việt", "Bahasa Indonesia", "Bahasa Melayu", "العربية", "हिन्दी"
  ];

  const templates = [
    { id: 't1', name: 'Modern Novel', subtitle: 'Professional serif layout', type: 'FREE', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop' },
    { id: 't2', name: 'Academic Paper', subtitle: 'Standard APA format', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop' },
    { id: 't3', name: 'Screenplay', subtitle: 'Industry standard layout', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop' },
    { id: 't4', name: 'Technical Manual', subtitle: 'Structured technical guide', type: 'FREE', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
  ];

  const handleFinalDelivery = async (platform: string) => {
    setTargetPlatform(platform);
    
    if (platform === 'Google Drive') {
      window.open('https://share.google/MAGEy5AkuKG8A2waS', '_blank');
      onClose();
      return;
    }
    if (platform === 'Apple iCloud') {
      window.open('https://www.icloud.com/', '_blank');
      onClose();
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(`Securing encrypted channel with ${platform}...`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmissionStatus(`Uploading manuscript components...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmissionStatus(`Finalizing submission package...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setStep(PubStep.SUCCESS);
  };

  if (step === PubStep.GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#121417] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-6 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-start text-white">
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <h2 className="text-[17px] font-black tracking-tight uppercase">Export Gallery</h2>
          <button className="w-10 h-10 flex items-center justify-end text-white">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"></i>
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="w-full h-[60px] bg-[#1C1C1E] rounded-2xl pl-14 pr-6 text-sm font-medium text-white outline-none placeholder-gray-500"
            />
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PDF', 'DOCX', 'EPUB'].map(f => (
              <button 
                key={f} 
                onClick={() => setSelectedFormat(f)}
                className={`px-8 py-3 rounded-full text-[13px] font-black tracking-widest transition-all shrink-0 ${f === selectedFormat ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#2C2C2E] text-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-10 pb-32">
            {templates.map((t) => (
              <div 
                key={t.id} 
                className="flex flex-col space-y-4 cursor-pointer"
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  setStep(PubStep.CONFIG);
                }}
              >
                <div className={`aspect-[3/4] rounded-[24px] relative overflow-hidden bg-gray-900 border-2 ${selectedTemplateId === t.id ? 'border-blue-500' : 'border-transparent'}`}>
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.type === 'FREE' ? 'bg-[#3A3A3C]' : 'bg-blue-600 shadow-xl'}`}>
                    {t.type}
                  </div>
                  {selectedTemplateId === t.id && (
                    <div className="absolute bottom-4 right-4 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-2xl">
                       <i className="fa-solid fa-check"></i>
                    </div>
                  )}
                </div>
                <div>
                   <h4 className="text-[17px] font-black tracking-tight">{t.name}</h4>
                   <p className="text-[12px] text-gray-500 font-medium tracking-tight mt-1">{t.subtitle}</p>
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
      <div className="fixed inset-0 z-[2000] bg-[#000000] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-6 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0">
          <button onClick={() => setStep(PubStep.GALLERY)} className="w-10 h-10 flex items-center justify-start text-gray-400">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] flex-1 text-center">Export Configuration</h2>
          <button className="w-10 h-10 flex items-center justify-end text-blue-500 text-[10px] font-black uppercase tracking-widest">
            Help
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-10">
          <div className="bg-[#121214] rounded-[44px] p-10 border border-white/5 relative">
            <h4 className="text-[34px] font-black text-white tracking-tighter leading-none mb-1">{project?.name || 'The Solar Paradox'}</h4>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-8">PAGE 1 OF 243 • CHAPTER 1</p>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Document Preview</p>
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">Visual representation based on current settings.</p>
              </div>
              <button className="px-8 py-3 border border-blue-600/30 text-blue-500 text-[11px] font-black rounded-2xl uppercase tracking-widest">Ready</button>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-widest px-2">Output Options</h3>
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setExportRange('all')} className={`py-7 rounded-[28px] text-[11px] font-black uppercase tracking-widest ${exportRange === 'all' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'bg-[#121214] text-gray-600'}`}>All Chapters</button>
               <button onClick={() => setExportRange('custom')} className={`py-7 rounded-[28px] text-[11px] font-black uppercase tracking-widest ${exportRange === 'custom' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'bg-[#121214] text-gray-600'}`}>Custom Range</button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setSelectedFont('serif')} className={`h-[240px] rounded-[44px] flex flex-col items-center justify-center space-y-2 border-2 transition-all ${selectedFont === 'serif' ? 'bg-[#121214] border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.5)]' : 'bg-[#121214] border-transparent opacity-30'}`}>
              <span className="text-[48px] font-serif">Aa</span>
              <span className="text-[16px] font-black">Serif</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Classic</span>
            </button>
            <button onClick={() => setSelectedFont('sans')} className={`h-[240px] rounded-[44px] flex flex-col items-center justify-center space-y-2 border-2 transition-all ${selectedFont === 'sans' ? 'bg-[#121214] border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.5)]' : 'bg-[#121214] border-transparent opacity-30'}`}>
              <span className="text-[48px] font-sans">Aa</span>
              <span className="text-[16px] font-black">Sans-serif</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Modern</span>
            </button>
          </div>

          <div className="space-y-4">
             <div className="bg-[#121214] h-[92px] rounded-[46px] px-8 flex items-center justify-between shadow-xl">
                <span className="text-[15px] font-black uppercase tracking-[0.2em]">Page Numbering</span>
                <button onClick={() => setIsPageNumbering(!isPageNumbering)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${isPageNumbering ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${isPageNumbering ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
             <div className="bg-[#121214] h-[92px] rounded-[46px] px-8 flex items-center justify-between shadow-xl">
                <span className="text-[15px] font-black uppercase tracking-[0.2em]">Headers & Footers</span>
                <button onClick={() => setIsHeadersFooters(!isHeadersFooters)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${isHeadersFooters ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${isHeadersFooters ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>

          <div className="space-y-4 pb-20">
            <div className="bg-[#121214] h-[92px] rounded-[46px] px-8 flex items-center shadow-xl">
              <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author Name" className="w-full bg-transparent outline-none border-none text-[15px] font-black text-[#8E8E93] placeholder-[#8E8E93]" />
            </div>
            <div className="bg-[#121214] h-[92px] rounded-[46px] px-8 flex items-center shadow-xl">
              <input value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="ISBN-13 (Optional)" className="w-full bg-transparent outline-none border-none text-[15px] font-black text-[#8E8E93] placeholder-[#8E8E93]" />
            </div>
          </div>
        </main>

        <footer className="p-10 pb-12 shrink-0 bg-gradient-to-t from-black via-black/80 to-transparent">
           <button onClick={() => setStep(PubStep.DELIVERY)} className="w-full h-[96px] bg-blue-600 rounded-[48px] flex items-center justify-center space-x-5 shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 transition-all">
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center"><i className="fa-solid fa-arrow-right text-xs"></i></div>
              <span className="text-[14px] font-black uppercase tracking-[0.4em]">Proceed to Distribution</span>
           </button>
        </footer>
      </div>
    );
  }

  if (step === PubStep.DELIVERY) {
    const platforms = [
      { id: 'Amazon KDP', name: 'Amazon KDP', sub: 'KINDLE DIRECT PUBLISHING', meta: 'Official self-publishing platform · Global distribution', color: '#FADE4B', icon: 'fa-amazon' },
      { id: 'Apple Books', name: 'Apple Books', sub: 'APPLE PUBLISHING', meta: 'Official Apple publishing channel', color: '#1E90FF', icon: 'fa-apple' },
      { id: 'Google Books', name: 'Google Books', sub: 'PARTNER PROGRAM', meta: 'Global book discovery & distribution', color: '#EA4335', icon: 'fa-google' },
      { id: 'Medium', name: 'Medium 專欄', sub: 'DIGITAL STORYTELLING', meta: 'Content publishing & audience platform', color: '#FFFFFF', icon: 'fa-medium' },
      { id: 'Substack', name: 'Substack', sub: '建立您的訂閱電子報與寫作社群。', meta: 'Newsletter & subscription platform', color: '#FF6719', icon: 'fa-substack' },
      { id: 'Draft2Digital', name: 'Draft2Digital', sub: 'MULTI-PLATFORM', meta: 'Multi-platform distribution hub', color: '#10B981', icon: 'fa-share-nodes' }
    ];

    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-center shrink-0 relative border-b border-white/5">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full absolute left-8">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">DELIVERY & SUBMISSION</h2>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-12 no-scrollbar space-y-16">
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
                <div className="bg-black/50 h-18 rounded-[24px] px-8 flex items-center justify-between border border-white/5 shadow-inner">
                   <div className="flex items-center space-x-4 text-gray-500">
                      <i className="fa-solid fa-building-columns text-lg"></i>
                      <span className="text-[15px] font-bold">選擇目標出版社...</span>
                   </div>
                   <i className="fa-solid fa-chevron-down text-gray-800 text-[10px]"></i>
                </div>
                <button 
                  onClick={() => handleFinalDelivery('Traditional Publisher Package')} 
                  className="w-full h-20 bg-white text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                >
                  啟 動 全 球 投 遞 程 序
                </button>
             </div>
          </div>

          <div className="space-y-6">
             <div className="px-2 pt-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">一 鍵 自 動 投 遞 D I R E C T P U B L I S H I N G</h3>
                <p className="text-[13px] text-[#D4FF5F] font-black tracking-tight mt-1.5">直接對接全球主流發行商</p>
             </div>

             <div className="space-y-6">
                {platforms.map(p => (
                  <div key={p.id} className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-3xl" style={{ color: p.color }}>
                              <i className={`fa-brands ${p.icon}`}></i>
                            </div>
                            <div>
                              <h4 className="text-2xl font-black tracking-tight">{p.name}</h4>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">{p.sub}</p>
                            </div>
                         </div>
                         <div className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">數位出版</div>
                      </div>
                      <div className="px-2">
                        <p className="text-[12px] text-gray-500 font-medium">{p.meta}</p>
                      </div>
                      <button 
                        onClick={() => handleFinalDelivery(p.id)} 
                        className="w-full h-20 bg-white text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                        style={{ backgroundColor: p.color === '#FFFFFF' ? '#FFFFFF' : p.color, color: '#000000' }}
                      >
                        發 佈 至 {p.name.toUpperCase()}
                      </button>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <div className="px-2 pt-10">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">P R O F E S S I O N A L Q & A</h3>
             </div>
             <div className="bg-[#121214] rounded-[44px] px-10 py-4 border border-white/5 shadow-2xl">
                <FAQItem question="是否需要自己聯絡出版社？" answer="不需要。SafeWrite 透過加密管道直接對接目標平台的官方受理入口，省去繁瑣的手動聯絡流程。" />
                <FAQItem question="是否透過官方管道？" answer="是的。所有投遞動作均符合目標平台的官方 API 協定或合作夥伴投遞標準，確保過程合法且受保護。" />
                <FAQItem question="是否會自動產生出版所需檔案？" answer="是的。系統會根據您在配置階段的設定，自動打包包含文稿、Metadata 以及必要排版規格的 Submission Package。" />
                <FAQItem question="是否可用於正式出版？" answer="是的。SafeWrite 投遞的檔案完全符合主流出版社與自出版平台（如 KDP）的商用排版與技術標準。" />
                <FAQItem question="是否仍保留作者完整權利？" answer="是的。SafeWrite 僅作為傳輸與格式化工具，作者保留作品的 100% 知識產權與控制權。" />
             </div>
          </div>

          <div className="h-20" />
        </main>

        {isSubmitting && (
          <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-10"></div>
             <h2 className="text-xl font-black text-white text-center px-12 leading-tight tracking-tight">{submissionStatus}</h2>
             <p className="text-[11px] text-blue-500 font-black uppercase tracking-[0.6em] mt-10 animate-pulse">Publication Protocol Active</p>
          </div>
        )}
      </div>
    );
  }

  if (step === PubStep.SUCCESS) {
    const isTrad = targetPlatform === 'Traditional Publisher Package';
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 relative">
          <button onClick={() => setStep(PubStep.DELIVERY)} className="w-10 h-10 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">{isTrad ? 'PACKAGE READY' : 'SUBMISSION COMPLETE'}</h2>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-12 no-scrollbar space-y-16 flex flex-col items-center">
           <div className="w-24 h-24 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-900/40">
              <i className="fa-solid fa-check text-3xl"></i>
           </div>

           <div className="text-center space-y-3">
              <h1 className="text-4xl font-black tracking-tighter leading-none">
                {isTrad ? 'Submission package ready' : 'Published successfully'}
              </h1>
              <p className="text-[14px] text-gray-500 font-medium max-w-xs mx-auto">
                {isTrad ? 'Your submission materials have been prepared according to industry standards.' : 'Your work has been delivered to the selected publishing platform.'}
              </p>
           </div>

           <div className="w-full bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center space-x-6 mb-4">
                 <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white"><i className={`fa-solid ${isTrad ? 'fa-box-archive' : 'fa-paper-plane'} text-2xl`}></i></div>
                 <div>
                    <h4 className="text-2xl font-black tracking-tight">{targetPlatform}</h4>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">
                      {isTrad ? 'READY FOR EXPORT' : 'SUBMITTED FOR REVIEW'}
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6 pt-6 border-t border-white/5">
                 <div>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">DISTRIBUTION</p>
                    <p className="text-[14px] font-black uppercase mt-1">GLOBAL</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">PROCESSING TIME</p>
                    <p className="text-[14px] font-black uppercase mt-1">24–72 HOURS</p>
                 </div>
              </div>

              {!isTrad && (
                <div className="flex items-center justify-between px-2 pt-4">
                   <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px]"><i className="fa-solid fa-check"></i></div>
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">DELIVERED</span>
                   </div>
                   <div className="h-px flex-1 bg-white/5 mx-2" />
                   <div className="flex flex-col items-center space-y-2 opacity-30">
                      <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-[10px]"><i className="fa-solid fa-hourglass-start"></i></div>
                      <span className="text-[8px] font-black uppercase tracking-widest">REVIEWING</span>
                   </div>
                   <div className="h-px flex-1 bg-white/5 mx-2" />
                   <div className="flex flex-col items-center space-y-2 opacity-30">
                      <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-[10px]"><i className="fa-solid fa-circle"></i></div>
                      <span className="text-[8px] font-black uppercase tracking-widest">AVAILABLE</span>
                   </div>
                </div>
              )}

              {isTrad && (
                <div className="space-y-3">
                   {['Synopsis', 'Author Bio', 'Sample Chapters'].map(item => (
                     <div key={item} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-sm font-medium text-gray-300">{item}</span>
                        <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>
                     </div>
                   ))}
                </div>
              )}
           </div>

           <div className="bg-[#1C1C1E]/40 p-8 rounded-[40px] border border-white/5 text-center space-y-4 w-full">
              <p className="text-[13px] text-gray-500 leading-relaxed italic font-medium">
                {isTrad ? '"This work is professionally prepared for literary agents and editors."' : '"This work has moved beyond drafting. It is now part of a global publishing process."'}
              </p>
              <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">OFFICIAL PUBLISHER CHANNEL SECURED</p>
           </div>
        </main>

        <footer className="p-10 pb-16 space-y-6 shrink-0 bg-black">
           <button onClick={onClose} className="w-full h-20 bg-blue-600 text-white rounded-[40px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-[0.98] transition-all">
              VIEW PUBLISHING STATUS
           </button>
           <div className="flex justify-center space-x-10">
              <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Download Record (PDF)</button>
              <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Share Link</button>
           </div>
        </footer>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
