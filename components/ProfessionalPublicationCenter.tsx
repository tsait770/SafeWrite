
import React, { useState } from 'react';
import { Project } from '../types';

enum PubStep { GALLERY, CONFIG, DELIVERY }

interface ProfessionalPublicationCenterProps {
  project: Project | null;
  onClose: () => void;
}

const ProfessionalPublicationCenter: React.FC<ProfessionalPublicationCenterProps> = ({ project, onClose }) => {
  const [step, setStep] = useState<PubStep>(PubStep.CONFIG); // 預設進入配置頁以供預覽
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [isPageNumbering, setIsPageNumbering] = useState(true);
  const [isHeadersFooters, setIsHeadersFooters] = useState(false);
  const [selectedFont, setSelectedFont] = useState<'serif' | 'sans'>('serif');
  const [exportRange, setExportRange] = useState<'all' | 'custom'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');

  // Metadata states
  const [author, setAuthor] = useState('Elena Fisher');
  const [pubYear, setPubYear] = useState('2026');

  const templates = [
    { id: 't1', name: 'Modern Novel', subtitle: 'Professional serif layout', type: 'FREE', formats: ['PDF', 'DOCX'], image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop' },
    { id: 't2', name: 'Academic Paper', subtitle: 'Standard APA format', type: 'PREMIUM', formats: ['PDF'], image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop', isSelected: true },
    { id: 't3', name: 'Screenplay', subtitle: 'Industry standard layout', type: 'PREMIUM', formats: ['PDF', 'DOCX'], image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop' },
    { id: 't4', name: 'Technical Manual', subtitle: 'Structured technical guide', type: 'FREE', formats: ['PDF'], image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
  ];

  const handleExport = () => {
    if (!project) return;
    setStep(PubStep.DELIVERY);
  };

  const handleFinalDelivery = (platform: string) => {
    setIsSubmitting(true);
    setSubmissionStatus(`正在建立與 ${platform} 的加密通道...`);
    setTimeout(() => {
      setSubmissionStatus(`正在上傳稿件至 ${platform}...`);
      setTimeout(() => {
        setSubmissionStatus(`投遞完成！${platform} 已確認接收。`);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 1500);
      }, 2000);
    }, 1500);
  };

  const handleSaveLocal = () => {
    setIsSubmitting(true);
    setSubmissionStatus('正在整合並優化本地存儲格式...');
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      alert('已成功儲存至此裝置');
    }, 2000);
  };

  if (step === PubStep.GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#000000] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        <header className="h-20 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between border-b border-white/5 shrink-0">
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[13px] font-black text-white uppercase tracking-[0.3em] text-center flex-1">Export Gallery</h2>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar space-y-10">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-700"></i>
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="w-full h-16 bg-[#111112] border border-white/5 rounded-[28px] pl-16 pr-6 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all placeholder-gray-800"
            />
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PDF', 'DOCX', 'EPUB'].map(f => (
              <button 
                key={f} 
                onClick={() => setSelectedFormat(f)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all shrink-0 ${f === selectedFormat ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-gray-600 hover:bg-white/10'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 pb-32">
            {templates.map((t) => (
              <div key={t.id} className="space-y-4 group cursor-pointer" onClick={() => setStep(PubStep.CONFIG)}>
                <div className="aspect-[3/4] rounded-[44px] relative shadow-2xl overflow-hidden border border-white/5 bg-gray-900">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  <span className="absolute top-6 right-6 text-[8px] font-black px-3 py-1.5 rounded-full border bg-black/40 border-white/10 text-white uppercase tracking-widest">
                    {t.type}
                  </span>
                </div>
                <div className="px-2">
                  <h4 className="text-base font-black text-white leading-tight">{t.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 leading-relaxed">{t.subtitle}</p>
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
      <div className="fixed inset-0 z-[2000] bg-[#000000] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        <header className="h-16 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <button onClick={() => setStep(PubStep.GALLERY)} className="w-8 h-8 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex-1 text-center pl-4">Export Configuration</h2>
          <button className="text-[#2563EB] text-[9px] font-black uppercase tracking-widest">HELP</button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-10 pb-48">
          {/* Document Preview Card - Match The Solar Paradox style */}
          <div className="bg-[#121214] rounded-[44px] p-8 sm:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-[34px] font-black text-white tracking-tighter leading-none">{project?.name || 'The Solar Paradox'}</h4>
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">CHAPTERS: 1 • PROGRESS: 82 %</p>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document Preview</p>
                  <p className="text-[9px] text-gray-600 leading-relaxed max-w-[200px] font-black uppercase tracking-[0.2em]">Visual representation based on current settings.</p>
                </div>
                <button className="px-6 py-3 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-[11px] font-black rounded-xl uppercase tracking-[0.2em] shadow-inner">READY</button>
              </div>
            </div>
          </div>

          {/* Output Options */}
          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-[0.3em] px-2">Output Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setExportRange('all')} className={`py-6 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${exportRange === 'all' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-[#121214] border border-white/5 text-gray-600'}`}>All Chapters</button>
              <button onClick={() => setExportRange('custom')} className={`py-6 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${exportRange === 'custom' ? 'bg-[#2563EB] text-white shadow-lg' : 'bg-[#121214] border border-white/5 text-gray-600'}`}>Custom Range</button>
            </div>
          </section>

          {/* Font Selection */}
          <section className="grid grid-cols-2 gap-4">
            <button onClick={() => setSelectedFont('serif')} className={`h-[200px] rounded-[44px] text-center transition-all border-2 flex flex-col items-center justify-center ${selectedFont === 'serif' ? 'bg-[#121214] border-[#2563EB]' : 'bg-[#121214] border-transparent opacity-30'}`}>
               <span className="text-[48px] font-serif block mb-2 text-white">Aa</span>
               <p className="text-[15px] font-black text-white">Serif</p>
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Classic</p>
            </button>
            <button onClick={() => setSelectedFont('sans')} className={`h-[200px] rounded-[44px] text-center transition-all border-2 flex flex-col items-center justify-center ${selectedFont === 'sans' ? 'bg-[#121214] border-[#2563EB]' : 'bg-[#121214] border-transparent opacity-30'}`}>
               <span className="text-[48px] font-sans block mb-2 text-white">Aa</span>
               <p className="text-[15px] font-black text-white">Sans-serif</p>
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Modern</p>
            </button>
          </section>

          {/* Toggles */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-10 h-[96px] bg-[#121214] rounded-[48px] border border-white/5">
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">Page Numbering</span>
                <button onClick={() => setIsPageNumbering(!isPageNumbering)} className={`w-[56px] h-[34px] rounded-full flex items-center px-1 transition-all ${isPageNumbering ? 'bg-[#2563EB]' : 'bg-[#2C2C2E]'}`}>
                  <div className={`w-[26px] h-[26px] bg-white rounded-full shadow-md transition-transform ${isPageNumbering ? 'translate-x-[24px]' : 'translate-x-0'}`} />
                </button>
             </div>
             <div className="flex items-center justify-between px-10 h-[96px] bg-[#121214] rounded-[48px] border border-white/5">
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">Headers & Footers</span>
                <button onClick={() => setIsHeadersFooters(!isHeadersFooters)} className={`w-[56px] h-[34px] rounded-full flex items-center px-1 transition-all ${isHeadersFooters ? 'bg-[#2563EB]' : 'bg-[#2C2C2E]'}`}>
                  <div className={`w-[26px] h-[26px] bg-white rounded-full shadow-md transition-transform ${isHeadersFooters ? 'translate-x-[24px]' : 'translate-x-0'}`} />
                </button>
             </div>
          </section>

          {/* Metadata Inputs */}
          <section className="space-y-4">
             <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Elena Fisher" className="w-full h-[88px] bg-[#121214] rounded-[44px] px-12 text-white font-black text-base outline-none placeholder-gray-800" />
             <input value={pubYear} onChange={e => setPubYear(e.target.value)} placeholder="2026" className="w-full h-[88px] bg-[#121214] rounded-[44px] px-12 text-white font-black text-base outline-none placeholder-gray-800" />
          </section>
        </main>

        <footer className="p-8 shrink-0 flex flex-col items-center bg-black">
          <button 
            onClick={handleExport} 
            className="w-full h-[100px] bg-[#2563EB] rounded-[50px] text-white font-black text-[14px] uppercase tracking-[0.3em] flex items-center justify-center gap-6 shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all"
          >
             <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
               <i className="fa-solid fa-arrow-right text-[12px]"></i>
             </div>
             <span className="font-black">Proceed to Distribution</span>
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-[#000000] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0 border-b border-white/5 bg-[#000000]/60 backdrop-blur-3xl">
        <button onClick={() => setStep(PubStep.CONFIG)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 transition-all">
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <h2 className="text-[12px] font-black text-white uppercase tracking-[0.3em] flex-1 text-center">Delivery & Submission</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar space-y-12 pb-48">
        
        {/* SUBMISSION - Top per Image 7 */}
        <section className="space-y-6">
           <div className="flex flex-col">
              <h3 className="text-[12px] font-black text-gray-600 uppercase tracking-[0.3em] px-2">投遞與出版 SUBMISSION</h3>
              <p className="text-[10px] text-gray-800 font-bold px-2 mt-1">直接投遞至出版平台或指定編輯</p>
           </div>

           <div className="bg-[#121214] p-10 rounded-[44px] border border-blue-600/10 space-y-8 shadow-2xl">
              <div className="flex items-center space-x-5">
                 <div className="w-18 h-18 rounded-3xl bg-[#2563EB] flex items-center justify-center text-white shadow-xl shadow-blue-900/30">
                    <i className="fa-solid fa-paper-plane text-2xl"></i>
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-white tracking-tight">一鍵自動投遞</h4>
                    <p className="text-[10px] text-[#2563EB] font-black uppercase tracking-[0.2em] mt-1">DIRECT PUBLISHING</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center space-x-4 p-6 bg-black/40 rounded-[28px] border border-white/5">
                    <i className="fa-solid fa-building-columns text-gray-600"></i>
                    <select className="flex-1 bg-transparent text-sm font-black text-gray-400 outline-none appearance-none">
                       <option>選擇目標出版社...</option>
                       <option>SafeWrite Creative Network</option>
                       <option>Global Literary Agency</option>
                       <option>Amazon KDP Direct</option>
                    </select>
                    <i className="fa-solid fa-chevron-down text-gray-700 text-xs"></i>
                 </div>
                 <button 
                  onClick={() => handleFinalDelivery('出版社網路')}
                  className="w-full py-7 bg-white text-black rounded-[32px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
                 >
                   啟 動 全 球 投 遞 程 序
                 </button>
              </div>
           </div>
        </section>

        {/* CLOUD TRANSFER */}
        <section className="space-y-6">
           <div className="flex flex-col">
              <h3 className="text-[12px] font-black text-gray-600 uppercase tracking-[0.3em] px-2">雲端傳送與備份 CLOUD TRANSFER</h3>
              <p className="text-[10px] text-gray-800 font-bold px-2 mt-1">傳送至第三方雲端空間進行二次校驗</p>
           </div>
           
           <div className="grid grid-cols-1 gap-6">
              <div className="bg-[#121214] p-8 rounded-[44px] border border-white/5 flex flex-col space-y-8 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                          <i className="fa-brands fa-google-drive text-3xl"></i>
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-white tracking-tight">Google Drive</h4>
                          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">DRIVE.GOOGLE.COM</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black text-[#2563EB] border border-[#2563EB]/30 px-5 py-2.5 rounded-full uppercase tracking-widest bg-[#2563EB]/5">官方認證</button>
                 </div>
                 <button 
                  onClick={() => handleFinalDelivery('Google Drive')}
                  className="w-full py-6 bg-[#2563EB] text-white rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all"
                 >
                   傳 送 至 G O O G L E 雲 端
                 </button>
              </div>

              <div className="bg-[#121214] p-8 rounded-[44px] border border-white/5 flex flex-col space-y-8 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                          <i className="fa-brands fa-apple text-3xl"></i>
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-white tracking-tight">Apple iCloud</h4>
                          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">ICLOUD.COM</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black text-[#2563EB] border border-[#2563EB]/30 px-5 py-2.5 rounded-full uppercase tracking-widest bg-[#2563EB]/5">官方認證</button>
                 </div>
                 <button 
                  onClick={() => handleFinalDelivery('Apple iCloud')}
                  className="w-full py-6 bg-[#1C1C1E] border border-white/10 text-white rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all"
                 >
                   傳 送 至 I C L O U D
                 </button>
              </div>
           </div>
        </section>

        {/* LOCAL STORAGE per Image 8 */}
        <section className="space-y-6">
           <div className="flex flex-col">
              <h3 className="text-[12px] font-black text-gray-600 uppercase tracking-[0.3em] px-2">儲存至本地設備 LOCAL STORAGE</h3>
              <p className="text-[10px] text-gray-800 font-bold px-2 mt-1">直接儲存至您的手機或電腦硬碟中</p>
           </div>
           
           <div className="bg-[#121214] p-10 rounded-[44px] border border-white/5 flex flex-col space-y-8 shadow-2xl">
              <div className="flex items-center space-x-5">
                 <div className="w-18 h-18 rounded-3xl bg-[#D4FF5F]/10 flex items-center justify-center text-[#D4FF5F] border border-[#D4FF5F]/20">
                    <i className="fa-solid fa-download text-2xl"></i>
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-white tracking-tight">下載至本地</h4>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1">OFFLINE PERSISTENCE</p>
                 </div>
              </div>
              <button 
                onClick={handleSaveLocal}
                className="w-full py-7 bg-[#D4FF5F] text-black rounded-[32px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-[#D4FF5F]/10 active:scale-95 transition-all"
              >
                儲 存 檔 案 至 此 裝 置
              </button>
           </div>
        </section>
      </main>

      {isSubmitting && (
        <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-[6px] border-blue-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-8 bg-blue-500/10 rounded-full animate-pulse"></div>
           </div>
           <h2 className="text-2xl font-black text-white tracking-tighter text-center px-12 leading-tight">{submissionStatus}</h2>
           <p className="text-[12px] text-blue-500 font-black uppercase tracking-[0.5em] mt-8 animate-pulse">ENCRYPTING & TRANSMITTING</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalPublicationCenter;
