
import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { geminiService } from '../services/geminiService';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string) => void;
}

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [extractedSegments, setExtractedSegments] = useState<{text: string, confidence: number}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
      setIsScanning(false);
    }
  };

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    try {
      const results = await geminiService.extractTextFromImage(base64);
      setExtractedSegments(results);
    } catch (e) {
      setExtractedSegments([{ text: "無法辨識內容，請重新嘗試。", confidence: 0 }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProcessToProject = (projectId: string) => {
    const fullText = extractedSegments.map(s => s.text).join('\n\n');
    onSaveToProject(projectId, fullText);
    setShowProjectPicker(false);
    setIsScanning(false);
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[800] bg-black flex flex-col animate-in fade-in duration-500">
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
           <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
           <canvas ref={canvasRef} className="hidden" />
           
           <div className="absolute top-8 left-8 p-3 hover:bg-white/10 rounded-full z-10 cursor-pointer" onClick={() => setIsScanning(false)}>
              <i className="fa-solid fa-xmark text-3xl text-white"></i>
           </div>
           
           <div className="w-[85%] h-[65%] border-2 border-[#D4FF5F]/40 rounded-3xl relative z-10">
              <div className="absolute -top-1 -left-1 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-2xl" />
              <div className="absolute -top-1 -right-1 w-16 h-16 border-t-4 border-r-4 border-white rounded-tr-2xl" />
              <div className="absolute -bottom-1 -left-1 w-16 h-16 border-b-4 border-l-4 border-white rounded-bl-2xl" />
              <div className="absolute -bottom-1 -right-1 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-2xl" />
              
              <div className="absolute top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#D4FF5F] rounded-full flex items-center space-x-3 shadow-2xl">
                 <div className="w-2 h-2 bg-black rounded-full animate-ping" />
                 <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">AI SCAN ACTIVE</span>
              </div>
           </div>

           <button 
             onClick={captureAndProcess}
             disabled={isAnalyzing}
             className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full border-[8px] border-white/20 active:scale-90 transition-all shadow-2xl flex items-center justify-center ${isAnalyzing ? 'animate-pulse' : ''}`}
           >
             {isAnalyzing ? (
               <div className="w-10 h-10 border-4 border-[#7b61ff] border-t-transparent rounded-full animate-spin" />
             ) : (
               <i className="fa-solid fa-camera text-3xl text-black/20"></i>
             )}
           </button>
        </div>

        {extractedSegments.length > 0 && (
          <div className="bg-[#1C1C1E] p-10 rounded-t-[3.5rem] animate-in slide-in-from-bottom duration-700 max-h-[60vh] overflow-y-auto border-t border-white/5 relative z-20">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-xl font-black text-white tracking-tight">AI Extraction</h3>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{extractedSegments.length} segments identified</p>
                </div>
                <div className="bg-[#D4FF5F]/10 text-[#D4FF5F] px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border border-[#D4FF5F]/20">98% CONFIDENCE</div>
             </div>

             <div className="space-y-4 mb-8">
                {extractedSegments.map((seg, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-[#7b61ff]/30 transition-all">
                    <p className="text-[9px] font-black text-[#7b61ff] uppercase tracking-widest mb-3">SEGMENT {String(i+1).padStart(2, '0')}</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-serif-editor">{seg.text}</p>
                  </div>
                ))}
             </div>

             <button 
               onClick={() => setShowProjectPicker(true)}
               className="w-full py-6 bg-[#FF6B2C] rounded-[2.5rem] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-[#FF7D45] transition-all active:scale-95 flex items-center justify-center space-x-3"
             >
                <i className="fa-solid fa-bolt-lightning text-xs"></i>
                <span>PROCESS WITH AI</span>
             </button>
          </div>
        )}

        {/* 專案選擇彈窗 */}
        {showProjectPicker && (
          <div className="fixed inset-0 z-[900] flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowProjectPicker(false)} />
             <div className="relative w-full max-w-md bg-[#111] rounded-[44px] p-8 border border-white/10 shadow-2xl flex flex-col space-y-6">
                <div className="flex flex-col">
                   <h2 className="text-2xl font-black tracking-tight text-white">選擇目標專案</h2>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">TARGET REPOSITORY</p>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[40vh] no-scrollbar">
                   {projects.map(p => (
                     <button 
                       key={p.id}
                       onClick={() => handleProcessToProject(p.id)}
                       className="w-full p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center space-x-4 hover:bg-white/10 transition-all text-left group"
                     >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black" style={{backgroundColor: p.color}}>
                           <i className={`fa-solid ${p.icon}`}></i>
                        </div>
                        <div>
                           <p className="font-bold text-white group-hover:text-[#7b61ff] transition-colors">{p.name}</p>
                           <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{p.chapters.length} CHAPTERS</p>
                        </div>
                     </button>
                   ))}
                </div>
                <button 
                  onClick={() => setShowProjectPicker(false)}
                  className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]"
                >
                   CANCEL
                </button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="grid grid-cols-2 gap-5">
        <button onClick={startCamera} className="col-span-2 capture-btn bg-[#D4FF5F] text-black shadow-[0_25px_50px_rgba(212,255,95,0.2)]">
          <div className="flex justify-between w-full">
            <i className="fa-solid fa-expand text-5xl opacity-80"></i>
            <span className="text-5xl font-black">SCAN</span>
          </div>
          <div className="text-left mt-6">
            <h3 className="text-4xl font-black leading-none tracking-tighter">Scan<br/>Document</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mt-4">PRO OCR ENGINE</p>
          </div>
        </button>

        <button className="capture-btn bg-[#B2A4FF] text-white shadow-[0_25px_50px_rgba(178,164,255,0.2)]">
          <div className="flex justify-end w-full">
            <i className="fa-solid fa-microphone-lines text-3xl"></i>
          </div>
          <div className="text-left mt-4">
            <h3 className="text-2xl font-black leading-tight">Voice<br/>Note</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">TRANSCRIBE</p>
          </div>
        </button>

        <button className="capture-btn bg-[#FF6B2C] text-white shadow-[0_25px_50px_rgba(255,107,44,0.2)]">
          <div className="flex justify-end w-full">
             <i className="fa-solid fa-feather text-3xl"></i>
          </div>
          <div className="text-left mt-4">
            <h3 className="text-2xl font-black leading-tight">Quick<br/>Note</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">DRAFT NOW</p>
          </div>
        </button>
      </section>

      <div className="pt-4 pb-20">
        <button onClick={startCamera} className="w-full h-28 bg-[#7b61ff] rounded-[48px] text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center space-x-5 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fa-solid fa-plus text-xl text-white"></i>
          </div>
          <span>START CAPTURE</span>
        </button>
      </div>
    </div>
  );
};

export default CaptureCenter;
