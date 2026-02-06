import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { geminiService } from '../services/geminiService';
// Fix: Import TEMPLATES from constants
import { TEMPLATES } from '../constants';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string) => void;
}

type CaptureMode = 'IDLE' | 'SCAN' | 'VOICE' | 'NOTE';

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject }) => {
  const [mode, setMode] = useState<CaptureMode>('IDLE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState<string | null>(null);
  const [quickNoteContent, setQuickNoteContent] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMode('SCAN');
      }
    } catch (err) {
      alert('無法啟動相機：' + err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setMode('IDLE');
  };

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
      
      try {
        const results = await geminiService.extractTextFromImage(base64Data);
        const fullText = results.map((r: any) => r.text).join('\n\n');
        setShowSaveOptions(fullText);
        stopCamera();
      } catch (e) {
        alert('文字提取失敗。');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleVoiceDone = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSaveOptions("這是模擬語音轉文字後的靈感內容：我們必須在宇宙的盡頭找到那一抹消失的晨曦...");
      setMode('IDLE');
    }, 1500);
  };

  const handleQuickNoteDone = () => {
    if (!quickNoteContent.trim()) return;
    setShowSaveOptions(quickNoteContent);
    setQuickNoteContent('');
    setMode('IDLE');
  };

  return (
    <div className="px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-40">
      
      {mode === 'IDLE' && (
        <>
          <section className="grid grid-cols-2 gap-5 pt-4">
            {/* Scan Card */}
            <button 
              onClick={startCamera} 
              className="col-span-2 capture-btn bg-[#D4FF5F] text-black shadow-[0_30px_60px_rgba(212,255,95,0.2)] border-none"
            >
              <div className="flex justify-between w-full items-start">
                <i className="fa-solid fa-expand text-6xl opacity-20"></i>
                <div className="bg-black/10 px-4 py-2 rounded-full">
                   <span className="text-[10px] font-black uppercase tracking-widest">PRO OCR</span>
                </div>
              </div>
              <div className="text-left mt-8">
                <h3 className="text-5xl font-black leading-none tracking-tighter">Scan<br/>Document</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mt-6">視覺文字提取引擎</p>
              </div>
            </button>

            {/* Voice Card */}
            <button 
              onClick={() => setMode('VOICE')}
              className="capture-btn bg-[#B2A4FF] text-white shadow-[0_30px_60px_rgba(178,164,255,0.2)] border-none"
            >
              <div className="flex justify-between items-start w-full">
                <i className="fa-solid fa-microphone-lines text-3xl"></i>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              </div>
              <div className="text-left mt-4">
                <h3 className="text-2xl font-black leading-tight tracking-tight">Voice<br/>Note</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">TRANSCRIBE</p>
              </div>
            </button>

            {/* Note Card */}
            <button 
              onClick={() => setMode('NOTE')}
              className="capture-btn bg-[#FF6B2C] text-white shadow-[0_30px_60px_rgba(255,107,44,0.2)] border-none"
            >
              <div className="flex justify-between items-start w-full">
                <i className="fa-solid fa-feather text-3xl"></i>
              </div>
              <div className="text-left mt-4">
                <h3 className="text-2xl font-black leading-tight tracking-tight">Quick<br/>Note</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">DRAFT NOW</p>
              </div>
            </button>
          </section>

          {/* Start Capture CTA */}
          <div className="pt-6 pb-20">
            <button 
              onClick={startCamera} 
              className="w-full h-32 bg-white/5 border border-white/10 rounded-[48px] text-[13px] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-between px-10 active:scale-95 transition-all group"
            >
              <span className="group-hover:text-[#D4FF5F] transition-colors">Start New Capture</span>
              <div className="w-16 h-16 rounded-full bg-[#7b61ff] flex items-center justify-center shadow-[0_0_20px_#7b61ff]">
                <i className="fa-solid fa-plus text-xl text-white"></i>
              </div>
            </button>
          </div>
        </>
      )}

      {/* Mode: SCAN (Camera) */}
      {mode === 'SCAN' && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in fade-in duration-500">
          <div className="flex-1 relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none flex items-center justify-center">
               <div className="w-full h-2/3 border-2 border-[#D4FF5F] rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#D4FF5F] -translate-x-1 -translate-y-1"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#D4FF5F] translate-x-1 -translate-y-1"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#D4FF5F] -translate-x-1 translate-y-1"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D4FF5F] translate-x-1 translate-y-1"></div>
               </div>
            </div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">對準文件以進行掃描</span>
            </div>
          </div>
          <footer className="h-44 bg-black flex items-center justify-around px-10 pb-10 shrink-0">
            <button onClick={stopCamera} className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <button 
              onClick={captureAndProcess}
              className="w-24 h-24 rounded-full bg-white border-[8px] border-[#D4FF5F] flex items-center justify-center active:scale-90 transition-transform shadow-[0_0_30px_#D4FF5F]"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4FF5F]" />
            </button>
            <div className="w-14" />
          </footer>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Mode: VOICE */}
      {mode === 'VOICE' && (
        <div className="fixed inset-0 z-[1000] bg-[#0A0A0C] flex flex-col items-center justify-center animate-in zoom-in duration-500">
           <div className="relative w-64 h-64 mb-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#B2A4FF]/10 animate-ping"></div>
              <div className="absolute inset-4 rounded-full bg-[#B2A4FF]/20 animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-[#B2A4FF] flex items-center justify-center shadow-[0_0_50px_#B2A4FF]">
                 <i className="fa-solid fa-microphone text-white text-5xl"></i>
              </div>
           </div>
           <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-white tracking-tighter">聆聽靈感中...</h2>
              <p className="text-[11px] text-[#B2A4FF] font-black uppercase tracking-[0.4em]">Listening and Transcribing</p>
           </div>
           <button 
            onClick={handleVoiceDone}
            className="mt-24 px-12 py-6 bg-white rounded-full text-black font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
           >
              停止並提取文字
           </button>
           <button onClick={() => setMode('IDLE')} className="mt-8 text-gray-600 font-black text-[10px] uppercase tracking-widest">取消</button>
        </div>
      )}

      {/* Mode: NOTE */}
      {mode === 'NOTE' && (
        <div className="fixed inset-0 z-[1000] bg-[#0A0A0C] p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
           <header className="flex justify-between items-center mb-10 shrink-0">
              <h2 className="text-2xl font-black text-white tracking-tighter">快速筆記</h2>
              <button onClick={() => setMode('IDLE')} className="w-12 h-12 rounded-full bg-white/5 text-gray-500"><i className="fa-solid fa-xmark"></i></button>
           </header>
           <textarea 
            autoFocus
            value={quickNoteContent}
            onChange={e => setQuickNoteContent(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-white/5 outline-none resize-none font-serif-editor leading-relaxed"
            placeholder="在此輸入此刻的靈感閃現..."
           />
           <footer className="pt-8 shrink-0">
              <button 
                onClick={handleQuickNoteDone}
                className="w-full py-6 bg-[#FF6B2C] rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,107,44,0.3)]"
              >
                 進入保存流程
              </button>
           </footer>
        </div>
      )}

      {/* Distribution Funnel Modal */}
      {showSaveOptions && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowSaveOptions(null)} />
          <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-[56px] p-10 flex flex-col space-y-8 animate-in slide-in-from-bottom duration-500 shadow-3xl border border-white/10 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4FF5F] rounded-3xl mx-auto flex items-center justify-center text-black mb-6 shadow-[0_10px_30px_#D4FF5F]">
                 <i className="fa-solid fa-check text-3xl"></i>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-2">擷取成功</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em]">請選擇儲存目的地</p>
            </div>

            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 space-y-3">
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-60">靈感預覽 Preview</p>
               <p className="text-base text-white line-clamp-4 font-serif-editor leading-relaxed">
                  {showSaveOptions}
               </p>
            </div>
            
            <div className="space-y-4">
              <button className="w-full p-6 bg-blue-600/10 hover:bg-blue-600/20 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] text-blue-400 border border-blue-500/20 transition-all flex items-center space-x-5">
                <i className="fa-solid fa-box-archive text-xl"></i>
                <span>存入靈感筆記本</span>
              </button>
              
              <div className="py-2 flex items-center justify-center">
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">OR INSERT TO PROJECT</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {projects.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => {
                      onSaveToProject(p.id, showSaveOptions);
                      setShowSaveOptions(null);
                    }}
                    className="w-full p-5 rounded-[28px] bg-black/40 border border-white/5 flex items-center justify-between hover:border-[#D4FF5F]/50 transition-all group text-left"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: p.color }}>
                        <i className={`fa-solid ${p.icon} text-black text-base`}></i>
                      </div>
                      <div>
                        <span className="text-sm font-black text-white block">{p.name}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">{TEMPLATES[p.writingType]?.label}</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-circle-plus text-gray-800 group-hover:text-[#D4FF5F] text-xl transition-colors"></i>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowSaveOptions(null)} className="w-full py-4 text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] hover:text-white transition-colors">捨棄此靈感</button>
          </div>
        </div>
      )}

      {/* Global Processing Loader */}
      {isProcessing && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-32 h-32 mb-12">
            <div className="absolute inset-0 border-[6px] border-[#7b61ff]/10 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-[#7b61ff] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-8 bg-[#7b61ff]/20 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter animate-pulse text-center px-12 leading-tight">正在救贖創作思緒...</h2>
          <p className="text-[10px] text-[#7b61ff] font-black uppercase tracking-[0.5em] mt-6">AI ENGINE PROCESSING</p>
        </div>
      )}
    </div>
  );
};

export default CaptureCenter;