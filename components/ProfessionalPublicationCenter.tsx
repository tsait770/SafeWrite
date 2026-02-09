
import React, { useState } from 'react';
import { Project } from '../types';

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
    setSubmissionStatus(`Uploading manuscript components to ${platform} official submission portal...`);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setSubmissionStatus(`Finalizing professional submission package...`);
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
              className="w-full h-[60px] bg-[#1C1C1E] rounded-2xl pl-14 pr-6 text-sm font-medium text-white outline-none border border-white/5 focus:border-blue-500 transition-all placeholder-gray-500"
            />
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PDF', 'DOCX', 'EPUB'].map(f => (
              <button 
                key={f} 
                onClick={() => setSelectedFormat(f)}
                className={`px-8 py-3 rounded-full text-[13px] font-black tracking-widest transition-all shrink-0 ${f === selectedFormat ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-[#2C2C2E] text-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-10 pb-32">
            {templates.map((t) => (
              <div 
                key={t.id} 
                className="flex flex-col space-y-4 cursor-pointer group"
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  setStep(PubStep.CONFIG);
                }}
              >
                <div className={`aspect-[3/4] rounded-[32px] relative overflow-hidden bg-gray-900 border-2 transition-all ${selectedTemplateId === t.id ? 'border-blue-500 shadow-2xl' : 'border-transparent group-hover:border-white/20'}`}>
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.type === 'FREE' ? 'bg-[#3A3A3C]' : 'bg-blue-600 shadow-xl'}`}>
                    {t.type}
                  </div>
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
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] flex-1 text-center">Export Configuration</h2>
          <button className="w-10 h-10 flex items-center justify-end text-blue-500 text-[10px] font-black uppercase tracking-widest">
            Help
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-12">
          <div className="bg-[#121214] rounded-[48px] p-12 border border-white/5 relative shadow-3xl">
            <h4 className="text-[34px] font-black text-white tracking-tighter leading-none mb-1">{project?.name || 'Untitled Work'}</h4>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-10">PAGE 1 OF 243 • PROFESSIONAL SKELETON</p>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Document Preview</p>
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">Layout generated based on manuscript metadata.</p>
              </div>
              <button className="px-10 py-4 border-2 border-blue-600/20 text-blue-500 text-[11px] font-black rounded-3xl uppercase tracking-widest active:scale-95 transition-all">Preview PDF</button>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-widest px-4">Output Options</h3>
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setExportRange('all')} className={`py-8 rounded-[32px] text-[11px] font-black uppercase tracking-widest border transition-all ${exportRange === 'all' ? 'bg-blue-600 border-blue-600 text-white shadow-2xl' : 'bg-[#121214] border-white/5 text-gray-600'}`}>All Chapters</button>
               <button onClick={() => setExportRange('custom')} className={`py-8 rounded-[32px] text-[11px] font-black uppercase tracking-widest border transition-all ${exportRange === 'custom' ? 'bg-blue-600 border-blue-600 text-white shadow-2xl' : 'bg-[#121214] border-white/5 text-gray-600'}`}>Custom Selection</button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setSelectedFont('serif')} className={`h-[260px] rounded-[48px] flex flex-col items-center justify-center space-y-3 border-2 transition-all ${selectedFont === 'serif' ? 'bg-[#121214] border-blue-600 shadow-2xl scale-[1.02]' : 'bg-[#121214] border-transparent opacity-40 hover:opacity-100'}`}>
              <span className="text-[54px] font-serif">Aa</span>
              <span className="text-[16px] font-black">Serif</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Standard Publishing</span>
            </button>
            <button onClick={() => setSelectedFont('sans')} className={`h-[260px] rounded-[48px] flex flex-col items-center justify-center space-y-3 border-2 transition-all ${selectedFont === 'sans' ? 'bg-[#121214] border-blue-600 shadow-2xl scale-[1.02]' : 'bg-[#121214] border-transparent opacity-40 hover:opacity-100'}`}>
              <span className="text-[54px] font-sans">Aa</span>
              <span className="text-[16px] font-black">Sans-serif</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Modern Digital</span>
            </button>
          </div>

          <div className="space-y-4 pb-32">
            <div className="bg-[#121214] h-[100px] rounded-[50px] px-10 flex items-center justify-between shadow-2xl border border-white/5">
                <span className="text-[15px] font-black uppercase tracking-[0.2em]">Page Numbering</span>
                <button onClick={() => setIsPageNumbering(!isPageNumbering)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${isPageNumbering ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${isPageNumbering ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
             <div className="bg-[#121214] h-[100px] rounded-[50px] px-10 flex items-center justify-between shadow-2xl border border-white/5">
                <span className="text-[15px] font-black uppercase tracking-[0.2em]">Headers & Footers</span>
                <button onClick={() => setIsHeadersFooters(!isHeadersFooters)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${isHeadersFooters ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${isHeadersFooters ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>
        </main>

        <footer className="p-10 pb-12 shrink-0 bg-gradient-to-t from-black via-black/90 to-transparent">
           <button onClick={() => setStep(PubStep.DELIVERY)} className="w-full h-[96px] bg-blue-600 rounded-[48px] flex items-center justify-center space-x-5 shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center"><i className="fa-solid fa-arrow-right text-xs"></i></div>
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
      { id: 'Substack', name: 'Substack', sub: '建立您的訂閱電子報與寫作社群。', meta: 'Serial / Newsletter publication hub', color: '#FF6719', icon: 'fa-envelope-open-text' },
      { id: 'Draft2Digital', name: 'Draft2Digital', sub: 'MULTI-PLATFORM AGGREGATOR', meta: 'Global distribution to Apple, Kobo, and libraries', color: '#10B981', icon: 'fa-share-nodes' }
    ];

    const cloudPlatforms = [
      { id: 'Google Drive', name: 'Google Drive', sub: 'DRIVE.GOOGLE.COM', meta: 'Cloud storage and synchronization hub', color: '#2563eb', icon: 'fa-google-drive' },
      { id: 'Apple iCloud', name: 'Apple iCloud', sub: 'ICLOUD.COM', meta: 'Native Apple ecosystem synchronization', color: '#1E293B', icon: 'fa-cloud' }
    ];

    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-center shrink-0 relative border-b border-white/5">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full absolute left-8 active:bg-white/10 transition-colors">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">DELIVERY & SUBMISSION</h2>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-12 no-scrollbar space-y-20">
          <div className="space-y-8">
             <div className="px-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">投 遞 與 出 版 S U B M I S S I O N</h3>
                <p className="text-[13px] text-gray-400 font-bold mt-2 uppercase tracking-widest leading-relaxed">專業準備文稿，直接投遞至出版平台或指定編輯。</p>
             </div>
             
             <div className="bg-[#121214] rounded-[64px] p-12 space-y-12 border border-white/5 shadow-3xl relative overflow-hidden group">
                <div className="flex items-center space-x-6">
                   <div className="w-20 h-20 rounded-[32px] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-900/40"><i className="fa-solid fa-file-pdf text-3xl"></i></div>
                   <div>
                      <h4 className="text-2xl font-black tracking-tight leading-none">傳統出版社投遞包</h4>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-2">PROFESSIONAL SUBMISSION PACKAGE</p>
                   </div>
                </div>
                <div className="bg-black/50 h-20 rounded-[32px] px-8 flex items-center justify-between border border-white/5 shadow-inner">
                   <div className="flex items-center space-x-5 text-gray-500">
                      <i className="fa-solid fa-building-columns text-xl"></i>
                      <span className="text-[15px] font-bold">選擇目標出版社或經紀人...</span>
                   </div>
                   <i className="fa-solid fa-chevron-down text-gray-800 text-[10px]"></i>
                </div>
                <button 
                  onClick={() => handleFinalDelivery('Traditional Submission Package')} 
                  className="w-full h-24 bg-white text-black rounded-[48px] text-[13px] font-black uppercase tracking-[0.5em] shadow-2xl active:scale-[0.98] transition-all hover:shadow-white/10"
                >
                  啟 動 專 業 投 遞 程 序
                </button>
             </div>
          </div>

          <div className="space-y-10">
             <div className="px-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">一 鍵 全 球 發 佈 D I R E C T P U B L I S H I N G</h3>
                <p className="text-[14px] text-[#D4FF5F] font-black tracking-tight mt-2 italic">「創作完成即出版」：直接對接全球主流發行商官方 API。</p>
             </div>

             <div className="space-y-8">
                {platforms.map(p => (
                  <div key={p.id} className="bg-[#121214] rounded-[64px] p-12 space-y-12 border border-white/5 shadow-3xl transition-transform hover:scale-[1.01]">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-[32px] bg-[#1A1A1C] border border-white/5 flex items-center justify-center text-4xl shadow-inner" style={{ color: p.color }}>
                              <i className={`fa-brands ${p.icon} ${p.icon.includes('fa-') ? '' : 'fa-brands'}`}></i>
                            </div>
                            <div>
                              <h4 className="text-2xl font-black tracking-tight">{p.name}</h4>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">{p.sub}</p>
                            </div>
                         </div>
                         <div className="px-6 py-3 border border-white/10 text-white text-[10px] font-black rounded-full uppercase tracking-widest bg-white/5">數位出版</div>
                      </div>
                      <div className="px-2">
                        <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{p.meta}</p>
                      </div>
                      <button 
                        onClick={() => handleFinalDelivery(p.id)} 
                        className="w-full h-24 rounded-[48px] text-[13px] font-black uppercase tracking-[0.5em] shadow-2xl active:scale-[0.98] transition-all"
                        style={{ backgroundColor: p.color === '#FFFFFF' ? '#F2F2F2' : p.color, color: '#000000' }}
                      >
                        發 佈 至 {p.name.toUpperCase()}
                      </button>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-10">
             <div className="px-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">雲 端 同 步 存 儲 C L O U D S T O R A G E</h3>
                <p className="text-[14px] text-blue-400 font-black tracking-tight mt-2">將作品備份至主流雲端硬碟。</p>
             </div>

             <div className="space-y-8">
                {cloudPlatforms.map(p => (
                  <div key={p.id} className="bg-[#121214] rounded-[64px] p-12 space-y-10 border border-white/5 shadow-3xl">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-[32px] bg-[#1A1A1C] border border-white/5 flex items-center justify-center text-4xl shadow-inner" style={{ color: p.color }}>
                              <i className={`fa-brands ${p.icon}`}></i>
                            </div>
                            <div>
                              <h4 className="text-2xl font-black tracking-tight">{p.name}</h4>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">{p.sub}</p>
                            </div>
                         </div>
                         <div className="px-6 py-3 border border-blue-500/20 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest bg-blue-500/5">官方認證</div>
                      </div>
                      <button 
                        onClick={() => handleFinalDelivery(p.id)} 
                        className={`w-full h-24 rounded-[48px] text-[13px] font-black uppercase tracking-[0.5em] shadow-2xl active:scale-[0.98] transition-all ${p.id === 'Google Drive' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white border border-white/10'}`}
                      >
                        傳 送 至 {p.name.toUpperCase()}
                      </button>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-10">
             <div className="px-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">儲 存 至 本 地 設 備 L O C A L S T O R A G E</h3>
                <p className="text-[10px] text-gray-800 font-bold mt-1.5 uppercase tracking-widest">直接儲存至您的手機或電腦硬碟中</p>
             </div>

             <div className="bg-[#121214] rounded-[64px] p-12 space-y-10 border border-white/5 shadow-3xl">
                <div className="flex items-center space-x-6">
                   <div className="w-20 h-20 rounded-[32px] bg-[#D4FF5F]/10 flex items-center justify-center text-[#D4FF5F] text-4xl shadow-inner border border-[#D4FF5F]/20">
                     <i className="fa-solid fa-download"></i>
                   </div>
                   <div>
                     <h4 className="text-2xl font-black tracking-tight">下載至本地</h4>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">OFFLINE PERSISTENCE</p>
                   </div>
                </div>
                <button 
                  onClick={() => handleFinalDelivery('Local Download')} 
                  className="w-full h-24 bg-[#D4FF5F] text-black rounded-[48px] text-[13px] font-black uppercase tracking-[0.5em] shadow-2xl active:scale-[0.98] transition-all"
                >
                  儲 存 檔 案 至 此 裝 置
                </button>
             </div>
          </div>

          <div className="space-y-8 pb-32">
             <div className="px-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">P R O F E S S I O N A L Q & A</h3>
                <p className="text-[9px] text-gray-800 font-bold mt-1 uppercase tracking-widest">PUBLISHING GUIDANCE PROTOCOL</p>
             </div>
             <div className="bg-[#121214] rounded-[48px] px-10 py-6 border border-white/5 shadow-3xl">
                <FAQItem question="是否需要自己聯絡出版社？" answer="不需要。SafeWrite 透過加密管道直接對接目標平台的官方受理入口，省去繁瑣的手動聯絡流程。" />
                <FAQItem question="是否透過官方管道？" answer="是的。所有投遞動作均符合目標平台的官方 API 協定或合作夥伴投遞標準，確保過程合法且受保護。" />
                <FAQItem question="我是否需要 ISBN 才能出版？" answer="不一定。許多數位發行管道會為您提供專屬識別碼。如果您選擇傳統出版或特定通路，系統會提醒您是否需要額外申請 ISBN。" />
                <FAQItem question="是否會自動產生出版所需檔案？" answer="是的。系統會根據您在配置階段的設定，自動打包包含文稿、Metadata 以及必要排版規格的 Submission Package。" />
                <FAQItem question="是否可用於正式出版？" answer="是的。SafeWrite 投遞的檔案完全符合主流出版社與自出版平台（如 KDP）的商用排版與技術標準。" />
                <FAQItem question="這與檔案匯出有何不同？" answer="匯出是產生文件，出版是產生可用性。本系統確保您的作品經過專業排版、Metadata 校驗，並傳輸至正式的出版發行系統。" />
                <FAQItem question="是否仍保留作者完整權利？" answer="是的。SafeWrite 僅作為傳輸與格式化工具，作者保留作品的 100% 知識產權與控制權。" />
                <FAQItem question="發佈後多久會上架？" answer="取決於平台。自出版平台通常在 24-72 小時內完成審核，傳統出版社則需視其內部流程而定。" />
             </div>
          </div>
        </main>

        {isSubmitting && (
          <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
             <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-12 shadow-[0_0_60px_rgba(37,99,235,0.3)]"></div>
             <h2 className="text-2xl font-black text-white text-center px-12 leading-tight tracking-tighter max-w-sm">{submissionStatus}</h2>
             <p className="text-[11px] text-blue-500 font-black uppercase tracking-[0.6em] mt-12 animate-pulse">Publication Protocol In Progress</p>
          </div>
        )}
      </div>
    );
  }

  if (step === PubStep.SUCCESS) {
    const isTrad = targetPlatform === 'Traditional Submission Package';
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 relative">
          <button onClick={() => setStep(PubStep.DELIVERY)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full active:scale-90 transition-all">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em]">{isTrad ? 'PACKAGE GENERATED' : 'DELIVERY SUCCESSFUL'}</h2>
          <div className="w-12" />
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-12 no-scrollbar space-y-16 flex flex-col items-center">
           <div className="w-32 h-32 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-3xl shadow-blue-900/40 animate-in zoom-in duration-700">
              <i className="fa-solid fa-check text-4xl"></i>
           </div>

           <div className="text-center space-y-4">
              <h1 className="text-4xl font-black tracking-tighter leading-tight max-w-xs mx-auto">
                {isTrad ? 'Submission package is ready' : `Published to ${targetPlatform}`}
              </h1>
              <p className="text-[15px] text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                {isTrad ? 'Your work has been professionally formatted and packaged for industry submission.' : 'Your manuscript has been delivered to the official distribution portal.'}
              </p>
           </div>

           <div className="w-full bg-[#121214] rounded-[64px] p-12 space-y-10 border border-white/5 shadow-3xl relative overflow-hidden">
              <div className="flex items-center space-x-6">
                 <div className="w-20 h-20 rounded-[32px] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-900/40"><i className={`fa-solid ${isTrad ? 'fa-box-archive' : 'fa-paper-plane'} text-3xl`}></i></div>
                 <div>
                    <h4 className="text-2xl font-black tracking-tight">{targetPlatform}</h4>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-2">
                      {isTrad ? 'READY FOR DISTRIBUTION' : 'PENDING OFFICIAL REVIEW'}
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 pt-10 border-t border-white/5">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">AVAILABILITY</p>
                    <p className="text-[15px] font-black uppercase tracking-tight">GLOBAL REGIONS</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">ETA</p>
                    <p className="text-[15px] font-black uppercase tracking-tight">24–72 HOURS</p>
                 </div>
              </div>

              <div className="flex items-center justify-between px-4 pt-6">
                   <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[11px] shadow-lg shadow-blue-900/40"><i className="fa-solid fa-check"></i></div>
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">SENT</span>
                   </div>
                   <div className="h-px flex-1 bg-blue-600/30 mx-4" />
                   <div className="flex flex-col items-center space-y-3 opacity-40">
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-[11px]"><i className="fa-solid fa-magnifying-glass"></i></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">REVIEW</span>
                   </div>
                   <div className="h-px flex-1 bg-white/10 mx-4" />
                   <div className="flex flex-col items-center space-y-3 opacity-40">
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-[11px]"><i className="fa-solid fa-earth-americas"></i></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">LIVE</span>
                   </div>
              </div>
           </div>

           <div className="bg-[#1C1C1E]/60 p-10 rounded-[48px] border border-white/5 text-center space-y-4 w-full">
              <p className="text-[14px] text-gray-400 leading-relaxed italic font-medium">
                {isTrad ? '"This manuscript has been prepared using industry-standard protocols, ready for literary agent evaluation."' : '"Your voice has moved beyond the editor. It is now entering the global narrative stream."'}
              </p>
              <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] mt-4">OFFICIAL SUBMISSION CHANNEL VERIFIED</p>
           </div>
        </main>

        <footer className="p-10 pb-16 space-y-6 shrink-0 bg-black">
           <button onClick={onClose} className="w-full h-24 bg-blue-600 text-white rounded-[48px] text-[14px] font-black uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all">
              VIEW PUBLISHING STATUS
           </button>
           <div className="flex justify-center space-x-12">
              <button className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] hover:text-white transition-colors">Download Record</button>
              <button className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] hover:text-white transition-colors">Share Report</button>
           </div>
        </footer>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
