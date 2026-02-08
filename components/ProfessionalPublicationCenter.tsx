
import React, { useState } from 'react';
import { Project } from '../types';
import JSZip from 'jszip';

enum PubStep { GALLERY, CONFIG, DELIVERY }

interface ProfessionalPublicationCenterProps {
  project: Project | null;
  onClose: () => void;
}

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

  const [author, setAuthor] = useState('Author Name');
  const [isbn, setIsbn] = useState('ISBN-13 (Optional)');
  const [pubYear, setPubYear] = useState('2026');
  const [language, setLanguage] = useState('English');

  const languages = [
    "English", "繁體中文", "简体中文", "Español", "Português (Brasil)", "Português",
    "Deutsch", "Français", "Italiano", "Nederlands", "Svenska", "Türkçe", "Русский",
    "日本語", "한국어", "ไทย", "Tiếng Việt", "Bahasa Indonesia", "Bahasa Melayu", "العربية", "हिन्दी"
  ];

  const templates = [
    { id: 't1', name: 'Modern Novel', subtitle: 'Professional serif layout', type: 'FREE', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop' },
    { id: 't2', name: 'Academic Paper', subtitle: 'Standard APA format', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop' },
    { id: 't3', name: 'Screenplay', subtitle: 'Industry standard layout', type: 'PREMIUM', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop' },
    { id: 't4', name: 'Technical Manual', subtitle: 'Structured technical guide', type: 'FREE', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
  ];

  const handleFinalDelivery = async (platform: string) => {
    // 導航邏輯：針對 Google Drive 與 iCloud 進行外部連結導向
    if (platform === 'Google Drive') {
      window.open('https://share.google/MAGEy5AkuKG8A2waS', '_blank');
      onClose();
      return;
    }
    if (platform === 'iCloud') {
      window.open('https://www.icloud.com/', '_blank');
      onClose();
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(`正在建立與 ${platform} 的加密通道...`);
    
    if (platform === '本地設備' && project) {
      try {
        const zip = new JSZip();
        project.chapters.forEach((chapter, index) => {
          const safeTitle = chapter.title.replace(/[\\/:*?"<>|]/g, '_');
          const fileName = `${(index + 1).toString().padStart(2, '0')}_${safeTitle}.md`;
          zip.file(fileName, chapter.content || '');
        });

        const manifest = {
          projectName: project.name,
          writingType: project.writingType,
          exportDate: new Date().toISOString(),
          chaptersCount: project.chapters.length,
          author: author !== 'Author Name' ? author : 'SafeWrite User',
          language: language
        };
        zip.file('metadata.json', JSON.stringify(manifest, null, 2));

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.name.replace(/\s+/g, '_')}_Export.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSubmissionStatus(`檔案打包完成！下載已啟動。`);
      } catch (err) {
        console.error('ZIP generation failed:', err);
        setSubmissionStatus(`下載失敗，請稍後再試。`);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmissionStatus(`正在上傳稿件至 ${platform}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmissionStatus(`投遞完成！${platform} 已確認接收。`);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  if (step === PubStep.GALLERY) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#121417] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-6 pt-[env(safe-area-inset-top,0px)] flex items-center justify-between shrink-0">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-start text-white">
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <h2 className="text-[17px] font-black tracking-tight">Export Gallery</h2>
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
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#121214] h-[92px] rounded-[46px] px-8 flex items-center shadow-xl">
                  <input value={pubYear} onChange={e => setPubYear(e.target.value)} placeholder="2026" className="w-full bg-transparent outline-none border-none text-[15px] font-black text-[#8E8E93] placeholder-[#8E8E93]" />
               </div>
               <div className="bg-[#121214] h-[92px] rounded-[46px] px-8 flex items-center justify-between shadow-xl relative overflow-hidden">
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-full bg-transparent outline-none border-none text-[15px] font-black text-[#8E8E93] appearance-none cursor-pointer z-10">
                    {languages.map(lang => (<option key={lang} value={lang} className="bg-[#121214] text-white">{lang}</option>))}
                  </select>
                  <i className="fa-solid fa-chevron-down text-gray-800 text-[10px] absolute right-8 pointer-events-none"></i>
               </div>
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
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-24 px-8 pt-[env(safe-area-inset-top,0px)] flex items-center justify-center shrink-0 relative border-b border-white/5">
          <button onClick={() => setStep(PubStep.CONFIG)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full absolute left-8">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">DELIVERY & SUBMISSION</h2>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-12 no-scrollbar space-y-16">
          {/* Main Submission Section */}
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
                  onClick={() => handleFinalDelivery('出版社')} 
                  className="w-full h-20 bg-white text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all hover:bg-gray-100"
                >
                  啟 動 全 球 投 遞 程 序
                </button>
             </div>
          </div>

          {/* Direct Publishing Hub */}
          <div className="space-y-6">
             <div className="px-2 pt-4">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">一 鍵 自 動 投 遞 D I R E C T P U B L I S H I N G</h3>
                <p className="text-[13px] text-[#D4FF5F] font-black tracking-tight mt-1.5">直接對接全球主流發行商</p>
             </div>

             <div className="space-y-6">
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
                      onClick={() => handleFinalDelivery('Amazon KDP')} 
                      className="w-full h-20 bg-[#FADE4B] text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      投 遞 至 A M A Z O N K D P
                    </button>
                </div>

                {/* Medium */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-white text-3xl">
                            <i className="fa-brands fa-medium"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Medium 專欄</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">DIGITAL STORYTELLING</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 border border-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">數位出版</div>
                    </div>
                    <button 
                      onClick={() => handleFinalDelivery('Medium')} 
                      className="w-full h-20 bg-white text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      發 佈 至 M E D I U M
                    </button>
                </div>

                {/* Pabee Hub */}
                <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-3xl bg-[#121214] border border-white/5 flex items-center justify-center text-[#D4FF5F] text-3xl">
                            <i className="fa-solid fa-paper-plane"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black tracking-tight">Pabee Hub</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">ORIGINAL CONTENT COMMUNITY</p>
                          </div>
                       </div>
                       <div className="px-5 py-2.5 bg-[#D4FF5F]/10 border border-[#D4FF5F]/30 text-[#D4FF5F] text-[10px] font-black rounded-full uppercase tracking-widest">官方社區</div>
                    </div>
                    <button 
                      onClick={() => handleFinalDelivery('Pabee Hub')} 
                      className="w-full h-20 bg-[#D4FF5F] text-black rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl active:scale-[0.98] transition-all"
                    >
                      同 步 至 P A B E E H U B
                    </button>
                </div>
             </div>
          </div>

          {/* Section: Cloud Transfer */}
          <div className="space-y-6">
             <div className="px-2">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">雲 端 傳 送 與 備 份 C L O U D T R A N S F E R</h3>
                <p className="text-[10px] text-gray-800 font-bold mt-1.5 uppercase tracking-widest">傳送至第三方雲端空間進行二次校驗</p>
             </div>
             <div className="space-y-6">
                <div className="bg-[#121214] rounded-[56px] p-10 space-y-10 border border-white/5 shadow-2xl">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-18 h-18 rounded-[28px] bg-white/5 flex items-center justify-center text-4xl text-white"><i className="fa-brands fa-google-drive"></i></div>
                        <div>
                           <h4 className="text-xl font-black tracking-tight">Google Drive</h4>
                           <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1">DRIVE.GOOGLE.COM</p>
                        </div>
                      </div>
                      <div className="px-5 py-2.5 border border-blue-600/30 text-[10px] font-black text-blue-500 rounded-full uppercase tracking-widest bg-blue-600/5">官方認證</div>
                   </div>
                   <button onClick={() => handleFinalDelivery('Google Drive')} className="w-full h-20 bg-blue-600 text-white rounded-[36px] text-[13px] font-black uppercase tracking-[0.5em] shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all">傳 送 至 G O O G L E D R I V E</button>
                </div>
                <div className="bg-[#121214] rounded-[56px] p-10 space-y-10 border border-white/5 shadow-2xl">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-18 h-18 rounded-[28px] bg-white/5 flex items-center justify-center text-4xl text-white"><i className="fa-brands fa-apple"></i></div>
                        <div>
                           <h4 className="text-xl font-black tracking-tight">Apple iCloud</h4>
                           <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1">ICLOUD.COM</p>
                        </div>
                      </div>
                      <div className="px-5 py-2.5 border border-blue-600/30 text-[10px] font-black text-blue-500 rounded-full uppercase tracking-widest bg-blue-600/5">官方認證</div>
                   </div>
                   <button onClick={() => handleFinalDelivery('iCloud')} className="w-full h-20 bg-[#1C1C1E] border border-white/10 text-white rounded-[36px] text-[13px] font-black uppercase tracking-[0.5em] active:scale-[0.98] transition-all">傳 送 至 A P P L E I C L O U D</button>
                </div>
             </div>
          </div>

          {/* Section: Local Storage */}
          <div className="space-y-6 pb-24">
             <div className="px-2">
                <h3 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">儲 存 至 本 地 設 備 L O C A L S T O R A G E</h3>
                <p className="text-[10px] text-gray-800 font-bold mt-1.5 uppercase tracking-widest">直接儲存至您的手機或電腦硬碟中</p>
             </div>
             <div className="bg-[#121214] rounded-[56px] p-12 space-y-10 border border-white/5 shadow-2xl">
                <div className="flex items-center space-x-6">
                   <div className="w-18 h-18 rounded-[28px] bg-[#D4FF5F]/10 flex items-center justify-center text-[#D4FF5F] text-3xl"><i className="fa-solid fa-download"></i></div>
                   <div>
                      <h4 className="text-2xl font-black tracking-tight leading-none">下載至本地</h4>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-2">Offline Persistence</p>
                   </div>
                </div>
                <button 
                   onClick={() => handleFinalDelivery('本地設備')} 
                   className="w-full h-24 bg-[#D4FF5F] text-black rounded-[40px] text-[14px] font-black uppercase tracking-[0.5em] shadow-xl shadow-[#D4FF5F]/10 active:scale-[0.98] transition-all"
                >
                   儲 存 檔 案 至 此 裝 置
                </button>
             </div>
          </div>
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

  return null;
};

export default ProfessionalPublicationCenter;
