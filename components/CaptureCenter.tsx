import React, { useState } from 'react';
import { Project, OCRBlock, CaptureMode, MembershipLevel } from '../types';
import VoiceModule from './capture/VoiceModule';
import QuickNoteModule from './capture/QuickNoteModule';
import ScanModule from './capture/ScanModule';
import DistributionHub from './capture/DistributionHub';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string, chapterId?: string) => void;
  onSaveToNotebook: (content: string) => void;
  membership: MembershipLevel;
  onUpgrade: () => void;
}

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject, onSaveToNotebook, membership, onUpgrade }) => {
  const [mode, setMode] = useState<CaptureMode>('IDLE');
  const [ocrBlocks, setOcrBlocks] = useState<OCRBlock[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [langConfidence, setLangConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);

  // 模擬最近捕捉數據（對齊 UI 圖）
  const recentCaptures = [
    { id: '1', title: 'Research Paper Snippet', subtitle: '"The methodology for the quantum entan...', time: '2H AGO', icon: 'fa-file-lines', color: 'bg-[#123E66]/20 text-blue-500' },
    { id: '2', title: 'Meeting Recording', subtitle: '02:44 Audio Log', time: 'YESTERDAY', icon: 'fa-microphone', color: 'bg-purple-900/20 text-purple-500' },
    { id: '3', title: 'Whiteboard Session', subtitle: '3 images attached • Project: Neon Shado...', time: '3 DAYS AGO', icon: 'fa-image', color: 'bg-orange-900/20 text-orange-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white px-8 pb-40 overflow-y-auto no-scrollbar">
      
      {/* 1. 主控制面板 (IDLE 狀態) */}
      {mode === 'IDLE' && (
        <div className="space-y-12 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* 大型 SCAN 卡片 */}
          <button 
            onClick={() => setMode('SCAN_SELECT')}
            className="w-full h-[280px] bg-[#D4FF5F] rounded-[44px] p-10 flex flex-col justify-between items-start text-black shadow-[0_30px_60px_rgba(212,255,95,0.15)] active:scale-[0.98] transition-all relative overflow-hidden"
          >
            <div className="flex justify-between w-full items-start">
               <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center">
                  <i className="fa-solid fa-camera text-3xl"></i>
               </div>
               <span className="text-5xl font-black tracking-tighter opacity-100">SCAN</span>
            </div>
            <div className="text-left z-10">
              <h4 className="text-4xl font-black leading-[1.1] tracking-tighter">Scan<br/>Document</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">PRO OCR ENGINE</p>
            </div>
            {/* 裝飾性大圖示 */}
            <i className="fa-solid fa-expand absolute -bottom-10 -right-10 text-[180px] opacity-5 pointer-events-none"></i>
          </button>

          {/* 雙欄功能區 (Voice & Note) */}
          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => setMode('VOICE_RECORDING')}
              className="bg-[#B2A4FF] rounded-[44px] aspect-square p-8 flex flex-col justify-between items-start text-[#121212] shadow-[0_30px_60px_rgba(178,164,255,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-end w-full">
                <i className="fa-solid fa-microphone-lines text-3xl opacity-30"></i>
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tight">Voice<br/>Note</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">TRANSCRIBE</p>
              </div>
            </button>
            <button 
              onClick={() => setMode('QUICK_NOTE_INPUT')}
              className="bg-[#FF6B2C] rounded-[44px] aspect-square p-8 flex flex-col justify-between items-start text-white shadow-[0_30px_60px_rgba(255,107,44,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-end w-full">
                <i className="fa-solid fa-pen-to-square text-3xl opacity-30"></i>
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tight">Quick<br/>Note</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">DRAFT NOW</p>
              </div>
            </button>
          </div>

          {/* 最近捕捉列表 */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.25em]">RECENT CAPTURES</h3>
                <button className="bg-white/5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-white/10 transition-colors">VIEW ALL</button>
             </div>
             
             <div className="space-y-4">
                {recentCaptures.map(item => (
                   <div key={item.id} className="bg-[#121214] p-6 rounded-[32px] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center space-x-5">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                         </div>
                         <div>
                            <h5 className="text-[15px] font-bold text-white tracking-tight">{item.title}</h5>
                            <p className="text-[11px] text-gray-500 font-medium truncate max-w-[180px] mt-0.5">{item.subtitle}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.time}</p>
                      </div>
                   </div>
                ))}
             </div>
          </section>

          {/* 底部功能切換按鈕 */}
          <div className="pt-8 flex justify-center pb-10">
             <button 
               onClick={() => setMode('SCAN_SELECT')}
               className="h-20 px-12 bg-[#7b61ff] rounded-[44px] flex items-center space-x-4 shadow-[0_20px_50px_rgba(123,97,255,0.3)] active:scale-95 transition-all group"
             >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <i className="fa-solid fa-plus text-white text-sm"></i>
                </div>
                <span className="text-[13px] font-black uppercase tracking-[0.4em]">START CAPTURE</span>
             </button>
          </div>
        </div>
      )}

      {/* 2. 模組化子組件 */}
      <ScanModule 
        mode={mode} 
        setMode={setMode} 
        setIsProcessing={setIsProcessing}
        setOcrBlocks={setOcrBlocks}
        setDetectedLanguage={setDetectedLanguage}
        setLangConfidence={setLangConfidence}
        setShowDistribution={setShowDistribution}
        membership={membership}
        onUpgrade={onUpgrade}
      />

      <VoiceModule 
        mode={mode} 
        setMode={setMode} 
        setIsProcessing={setIsProcessing}
        setOcrBlocks={setOcrBlocks}
        setDetectedLanguage={setDetectedLanguage}
        setLangConfidence={setLangConfidence}
        setShowDistribution={setShowDistribution}
      />

      <QuickNoteModule 
        mode={mode} 
        setMode={setMode} 
        setOcrBlocks={setOcrBlocks}
        setShowDistribution={setShowDistribution}
        setDetectedLanguage={setDetectedLanguage}
        setLangConfidence={setLangConfidence}
      />

      <DistributionHub 
        showDistribution={showDistribution}
        setShowDistribution={setShowDistribution}
        ocrBlocks={ocrBlocks}
        setOcrBlocks={setOcrBlocks}
        projects={projects}
        onSaveToProject={onSaveToProject}
        onSaveToNotebook={onSaveToNotebook}
        detectedLanguage={detectedLanguage}
        langConfidence={langConfidence}
      />

      {/* 3. 全域處理狀態 (AI 分析中) */}
      {isProcessing && (
        <div className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
           <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-[6px] border-[#D4FF5F]/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-[#D4FF5F] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-8 bg-[#D4FF5F]/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center"><i className="fa-solid fa-wand-magic-sparkles text-xl text-[#D4FF5F] animate-bounce"></i></div>
           </div>
           <h2 className="text-3xl font-black text-white tracking-tighter text-center px-12 leading-tight">正在執行深度語義佈局分析...</h2>
           <p className="text-[12px] text-[#D4FF5F] font-black uppercase tracking-[0.5em] mt-8 animate-pulse">GEMINI PRO V3 ENGINE ACTIVE</p>
        </div>
      )}
    </div>
  );
};

export default CaptureCenter;