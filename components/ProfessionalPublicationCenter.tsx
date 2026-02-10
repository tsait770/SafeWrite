
import React, { useState, useEffect } from 'react';
import { Project, SupportedLanguage, PublicationStatus, PublicationRecord } from '../types';
import LanguageSelector from './LanguageSelector';

enum PubStep { EXPORT_CONFIG, DELIVERY_HUB, PIPELINE, SUCCESS }

interface ProfessionalPublicationCenterProps {
  project: Project | null;
  onClose: () => void;
  onUpdateProject?: (project: Project) => void;
}

const ProfessionalPublicationCenter: React.FC<ProfessionalPublicationCenterProps> = ({ project, onClose, onUpdateProject }) => {
  const [step, setStep] = useState<PubStep>(PubStep.EXPORT_CONFIG);
  
  // Phase 1: Configuration
  const [outputOption, setOutputOption] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [typography, setTypography] = useState<'SERIF' | 'SANS'>('SERIF');
  const [pageNumbering, setPageNumbering] = useState(true);
  const [headersFooters, setHeadersFooters] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [isbn, setIsbn] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('zh-TW');
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  // Phase 3: Pipeline States
  const [pipelinePhase, setPipelinePhase] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const pipelinePhases = [
    { label: '內容標準化與 AST 解析', desc: 'Content Normalization & AI Pre-processing' },
    { label: '生成 DOCX 編輯母檔', desc: 'Generating Editorial DOCX Artifact' },
    { label: '封裝 PDF 印刷級手稿', desc: 'Packaging High-Fidelity PDF' },
    { label: '構建 EPUB 3 出版規格電子書', desc: 'Building EPUB 3 Standards E-book' },
    { label: '加密傳輸至出版商通道', desc: 'Encrypted Delivery to Platform API' }
  ];

  const languageNames: Record<string, string> = {
    'en': 'English', 'zh-TW': '繁體中文', 'zh-CN': '简体中文', 'es': 'Español',
    'pt-BR': 'Português (Brasil)', 'pt-PT': 'Português', 'de': 'Deutsch',
    'fr': 'Français', 'it': 'Italiano', 'nl': 'Nederlands', 'sv': 'Svenska',
    'tr': 'Türkçe', 'ru': 'Русский', 'ja': '日本語', 'ko': '韓國語',
    'th': 'ไทย', 'vi': 'Tiếng Việt', 'id': 'Bahasa Indonesia', 'ms': 'Bahasa Melayu',
    'ar': 'العربية', 'hi': 'हिन्दी'
  };

  const startPublishing = (platform: string) => {
    setSelectedPlatform(platform);
    setStep(PubStep.PIPELINE);
    setPipelinePhase(0);
  };

  useEffect(() => {
    if (step === PubStep.PIPELINE) {
      const interval = setInterval(() => {
        setPipelinePhase(prev => {
          if (prev >= pipelinePhases.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              completePublishing();
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const completePublishing = () => {
    if (project && onUpdateProject) {
      const newRecord: PublicationRecord = {
        id: `pub-${Date.now()}`,
        platform: selectedPlatform,
        status: PublicationStatus.SUBMITTED,
        timestamp: Date.now()
      };
      const updatedProject = {
        ...project,
        publicationHistory: [newRecord, ...(project.publicationHistory || [])]
      };
      onUpdateProject(updatedProject);
    }
    setStep(PubStep.SUCCESS);
  };

  // Phase 1 UI: Export Configuration
  if (step === PubStep.EXPORT_CONFIG) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden text-white font-sans">
        <header className="h-20 px-8 pt-6 flex items-center justify-between shrink-0 bg-black z-20">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-start text-white active:opacity-50">
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-white">Export Configuration</h2>
          <button className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">Manual</button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar space-y-12 pb-48">
          <div className="bg-[#1C1C1E] rounded-[48px] p-10 flex flex-col items-start relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h1 className="text-[44px] font-black tracking-tighter leading-none mb-2 z-10">{project?.name || 'Untitled Project'}</h1>
             <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-10 z-10">
               {project?.chapters.length || 0} UNITS • READY FOR DELIVERY
             </p>
             
             <div className="w-full flex justify-between items-end z-10">
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-white uppercase tracking-widest">Document Preview</p>
                   <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
                     Visual representation<br/>based on current settings.
                   </p>
                </div>
                <div className="px-10 py-3 rounded-full border border-gray-800 text-[#D4FF5F] text-[11px] font-black uppercase tracking-[0.2em]">Validated</div>
             </div>
          </div>

          <section className="space-y-4">
             <p className="text-[11px] font-black text-gray-700 uppercase tracking-widest px-2">Scope Options</p>
             <div className="grid grid-cols-2 gap-4">
                {['ALL', 'CUSTOM'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setOutputOption(opt as any)}
                    className={`py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${outputOption === opt ? 'bg-[#3b82f6] text-white shadow-xl shadow-blue-900/30' : 'bg-[#121214] text-gray-600 border border-white/5'}`}
                  >
                    {opt === 'ALL' ? '全體章節' : '自定範圍'}
                  </button>
                ))}
             </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
             {[
               { id: 'SERIF', label: 'Serif', desc: 'Classic', font: 'font-serif' },
               { id: 'SANS', label: 'Sans-serif', desc: 'Modern', font: 'font-sans' }
             ].map(style => (
               <button 
                  key={style.id}
                  onClick={() => setTypography(style.id as any)}
                  className={`flex flex-col items-center justify-center p-12 rounded-[3.5rem] border-2 transition-all ${typography === style.id ? 'border-[#3b82f6] bg-black ring-4 ring-[#3b82f6]/20' : 'border-white/5 bg-[#121214] opacity-40'}`}
               >
                  <span className={`text-[54px] ${style.font} mb-4 leading-none`}>Aa</span>
                  <p className="text-xl font-black tracking-tight">{style.label}</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{style.desc}</p>
               </button>
             ))}
          </section>

          <section className="space-y-4">
             <div className="h-24 px-10 rounded-[2.5rem] bg-[#121214] flex items-center justify-between border border-white/5">
                <span className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-200">Page Numbering</span>
                <button onClick={() => setPageNumbering(!pageNumbering)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${pageNumbering ? 'bg-blue-600' : 'bg-gray-800'}`}>
                   <div className={`w-6 h-6 bg-white rounded-full transition-transform ${pageNumbering ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
             <div className="h-24 px-10 rounded-[2.5rem] bg-[#121214] flex items-center justify-between border border-white/5">
                <span className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-200">Headers & Footers</span>
                <button onClick={() => setHeadersFooters(!headersFooters)} className={`w-14 h-8 rounded-full flex items-center px-1 transition-all ${headersFooters ? 'bg-blue-600' : 'bg-gray-800'}`}>
                   <div className={`w-6 h-6 bg-white rounded-full transition-transform ${headersFooters ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </section>

          <section className="space-y-4">
             <input type="text" placeholder="Author Name" value={authorName} onChange={e => setAuthorName(e.target.value)} className="w-full h-24 px-10 rounded-[2.5rem] bg-[#121214] border border-white/5 text-lg font-black text-white outline-none focus:border-[#3b82f6] placeholder-gray-700" />
             <input type="text" placeholder="ISBN-13 (Optional)" value={isbn} onChange={e => setIsbn(e.target.value)} className="w-full h-24 px-10 rounded-[2.5rem] bg-[#121214] border border-white/5 text-lg font-black text-white outline-none focus:border-[#3b82f6] placeholder-gray-700" />
             <div className="grid grid-cols-2 gap-4">
                <div className="h-24 px-10 rounded-[2.5rem] bg-[#121214] flex items-center text-lg font-black text-gray-500 border border-white/5">2026</div>
                <button onClick={() => setIsLanguageSelectorOpen(true)} className="h-24 px-10 rounded-[2.5rem] bg-[#121214] flex items-center justify-between text-lg font-black text-gray-500 border border-white/5">
                   <span>{languageNames[language]}</span>
                   <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
             </div>
          </section>
        </main>

        <footer className="absolute bottom-0 inset-x-0 p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent shrink-0">
           <button 
             onClick={() => setStep(PubStep.DELIVERY_HUB)}
             className="w-full h-24 bg-[#3b82f6] text-white rounded-[48px] flex items-center justify-center space-x-6 shadow-[0_20px_50px_rgba(59,130,246,0.4)] active:scale-95 transition-all"
           >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                 <i className="fa-solid fa-arrow-right text-[12px]"></i>
              </div>
              <span className="text-[14px] font-black uppercase tracking-[0.4em]">Proceed to Distribution</span>
           </button>
        </footer>

        {isLanguageSelectorOpen && <LanguageSelector currentLanguage={language} onSelect={setLanguage} onClose={() => setIsLanguageSelectorOpen(false)} />}
      </div>
    );
  }

  // Phase 2: Delivery Hub (Optimized Layout per Screenshot)
  if (step === PubStep.DELIVERY_HUB) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-right duration-500 text-white font-sans overflow-hidden">
         <header className="h-20 px-8 pt-6 flex items-center justify-between shrink-0 bg-black z-10 border-b border-white/5">
            <button onClick={() => setStep(PubStep.EXPORT_CONFIG)} className="w-10 h-10 flex items-center justify-start text-white">
               <i className="fa-solid fa-chevron-left text-lg"></i>
            </button>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-white">Delivery & Submission</h2>
            <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar px-8 py-10 space-y-16 pb-48">
           
           {/* Section 1: Submission */}
           <section className="space-y-8">
              <div className="px-2">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">投遞與出版 SUBMISSION</h3>
                 <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1">直接投遞至出版平台或指定編輯</p>
              </div>

              {/* One Click Direct Publishing Card */}
              <div className="bg-[#1C1C1E] rounded-[44px] p-10 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <div className="flex items-center space-x-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                       <i className="fa-solid fa-paper-plane text-2xl"></i>
                    </div>
                    <div>
                       <h4 className="text-2xl font-black tracking-tight">一鍵自動投遞</h4>
                       <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Direct Publishing</p>
                    </div>
                 </div>
                 
                 <div className="relative group/select z-10">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                       <i className="fa-solid fa-hotel text-sm"></i>
                    </div>
                    <select className="w-full h-16 bg-black rounded-2xl pl-14 pr-10 text-sm font-bold text-gray-400 border border-white/5 outline-none appearance-none focus:border-blue-600 transition-all">
                       <option>選擇目標出版社...</option>
                       <option>SafeWrite Global Network</option>
                       <option>Penguin Random House API</option>
                       <option>HarperCollins Editorial Hub</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                       <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                 </div>

                 <button 
                   onClick={() => startPublishing('SafeWrite Direct')}
                   className="w-full h-16 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl relative z-10"
                 >
                    啟動全球投遞程序
                 </button>
              </div>

              {/* Platform Specific Cards */}
              <div className="space-y-6 pt-4">
                 <div className="flex items-center space-x-4 px-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">一鍵自動投遞 DIRECT PUBLISHING</p>
                    <div className="h-px flex-1 bg-white/5" />
                 </div>
                 <p className="text-center text-[9px] font-black text-yellow-500 uppercase tracking-widest -mt-4">直接對接全球主流發行商</p>

                 {/* Amazon KDP */}
                 <div className="bg-[#1C1C1E] rounded-[44px] p-10 border border-white/5 space-y-8 shadow-xl">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center space-x-6">
                          <div className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-amber-500 text-xl shadow-inner">
                             <i className="fa-brands fa-amazon"></i>
                          </div>
                          <div>
                             <h4 className="text-2xl font-black">Amazon KDP</h4>
                             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">KINDLE DIRECT PUBLISHING</p>
                          </div>
                       </div>
                       <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[8px] font-black uppercase tracking-widest">
                          全球發行
                       </div>
                    </div>
                    <button 
                      onClick={() => startPublishing('Amazon KDP')}
                      className="w-full h-16 bg-[#FADE4B] text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(250,222,75,0.2)] active:scale-[0.98] transition-all"
                    >
                       投遞至 Amazon KDP
                    </button>
                 </div>

                 {/* Medium */}
                 <div className="bg-[#1C1C1E] rounded-[44px] p-10 border border-white/5 space-y-8 shadow-xl">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center space-x-6">
                          <div className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-white text-xl shadow-inner">
                             <i className="fa-brands fa-medium"></i>
                          </div>
                          <div>
                             <h4 className="text-2xl font-black">Medium 專欄</h4>
                             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">DIGITAL STORYTELLING</p>
                          </div>
                       </div>
                       <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[8px] font-black uppercase tracking-widest">
                          數位出版
                       </div>
                    </div>
                    <button 
                      onClick={() => startPublishing('Medium')}
                      className="w-full h-16 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] active:scale-[0.98] transition-all"
                    >
                       發佈至 Medium
                    </button>
                 </div>
              </div>
           </section>

           {/* Section 2: Cloud Transfer */}
           <section className="space-y-8">
              <div className="px-2">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">雲端傳送與備份 CLOUD TRANSFER</h3>
                 <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1">傳送至第三方雲端空間進行二次校驗</p>
              </div>

              <div className="bg-[#1C1C1E] rounded-[44px] p-10 border border-white/5 space-y-8 shadow-xl">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-6">
                       <div className="w-14 h-14 flex items-center justify-center text-4xl">
                          <i className="fa-brands fa-google-drive text-white"></i>
                       </div>
                       <div>
                          <h4 className="text-2xl font-black">Google Drive</h4>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">DRIVE.GOOGLE.COM</p>
                       </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[8px] font-black uppercase tracking-widest">
                       官方認證
                    </div>
                 </div>
                 <button className="w-full h-16 bg-[#3b82f6] text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(59,130,246,0.3)] active:scale-[0.98] transition-all">
                    傳送至 Google Drive
                 </button>
              </div>
           </section>

           {/* Section 3: Local Storage */}
           <section className="space-y-8">
              <div className="px-2">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">儲存至本地 LOCAL STORAGE</h3>
                 <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1">直接儲存至您的手機或電腦硬碟中</p>
              </div>

              <div className="bg-[#1C1C1E] rounded-[44px] p-10 border border-white/5 space-y-8 shadow-xl">
                 <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#D4FF5F] flex items-center justify-center text-black shadow-lg">
                       <i className="fa-solid fa-download text-xl"></i>
                    </div>
                    <div>
                       <h4 className="text-2xl font-black">下載至本地</h4>
                       <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">OFFLINE PERSISTENCE</p>
                    </div>
                 </div>
                 <button className="w-full h-16 bg-[#D4FF5F] text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(212,255,95,0.2)] active:scale-[0.98] transition-all">
                    儲存檔案至此裝置
                 </button>
              </div>
           </section>

           {/* Section 4: Professional Q&A */}
           <section className="space-y-8 pb-10">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2">PROFESSIONAL Q&A</h3>
              <div className="space-y-2">
                 {[
                   "Do I need an ISBN to publish?",
                   "I'm not familiar with publishing platforms. Is that a problem?",
                   "How long does the review process take?",
                   "Is my content exclusive to one platform?"
                 ].map((q, idx) => (
                    <div key={idx} className="border-b border-white/5 py-6 flex items-center justify-between group cursor-pointer active:opacity-50 transition-opacity">
                       <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{q}</span>
                       <i className="fa-solid fa-chevron-down text-[10px] text-gray-600 group-hover:text-white transition-colors"></i>
                    </div>
                 ))}
              </div>
           </section>
        </main>
      </div>
    );
  }

  // Phase 3: Pipeline (Loading)
  if (step === PubStep.PIPELINE) {
    const current = pipelinePhases[pipelinePhase];
    const progress = ((pipelinePhase + 1) / pipelinePhases.length) * 100;

    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
         <div className="relative w-48 h-48 mb-16">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle cx="96" cy="96" r="80" className="stroke-white/5 fill-none" strokeWidth="6" />
               <circle cx="96" cy="96" r="80" className="stroke-blue-600 fill-none transition-all duration-700" strokeWidth="6" strokeDasharray="502" strokeDashoffset={502 * (1 - progress / 100)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <i className={`fa-solid ${pipelinePhase % 2 === 0 ? 'fa-rocket' : 'fa-microchip'} text-4xl text-blue-500 animate-pulse`}></i>
            </div>
         </div>
         
         <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl font-black text-white tracking-tight">{current.label}</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">{current.desc}</p>
         </div>

         <div className="mt-16 w-full max-w-xs space-y-4 opacity-40">
            {pipelinePhases.map((p, idx) => (
               <div key={idx} className={`flex items-center space-x-4 transition-all duration-500 ${idx === pipelinePhase ? 'opacity-100 scale-105' : 'opacity-20 scale-95'}`}>
                  <div className={`w-2 h-2 rounded-full ${idx <= pipelinePhase ? 'bg-blue-500' : 'bg-white/20'}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{p.label}</span>
               </div>
            ))}
         </div>
         
         <div className="absolute bottom-16">
            <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em] animate-pulse">
               SAFEWRITE PUBLISHING AGENT ACTIVE
            </p>
         </div>
      </div>
    );
  }

  // Phase 4: Success Ritual
  if (step === PubStep.SUCCESS) {
    return (
      <div className="fixed inset-0 z-[4000] bg-black flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-700">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
         </div>
         
         <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl mb-12 shadow-[0_0_80px_rgba(37,99,235,0.6)] animate-bounce">
            <i className="fa-solid fa-check"></i>
         </div>

         <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Published Successfully.</h2>
         <p className="text-gray-400 text-lg font-medium max-w-md leading-relaxed">
            Your work has been delivered to <span className="text-blue-500 font-black">{selectedPlatform}</span> for final validation.
         </p>

         <div className="mt-16 p-10 bg-white/5 rounded-[44px] border border-white/10 w-full max-w-md space-y-6">
            <div className="flex justify-between items-center text-left">
               <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SUBMISSION STATUS</p>
                  <p className="text-sm font-black text-[#D4FF5F] uppercase tracking-widest mt-1">Pending Review</p>
               </div>
               <i className="fa-solid fa-circle-notch fa-spin text-gray-700"></i>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
               "This submission was sent through the official publisher channel. Estimated processing time: 24-48 hours."
            </p>
         </div>

         <button 
           onClick={onClose}
           className="mt-16 w-full max-w-md h-24 bg-white text-black rounded-[48px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
         >
            View publishing status
         </button>
      </div>
    );
  }

  return null;
};

export default ProfessionalPublicationCenter;
