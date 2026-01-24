import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

const CaptureCenter: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[800] bg-black flex flex-col animate-in fade-in duration-500">
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
           <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
           <canvas ref={canvasRef} className="hidden" />
           
           <div className="absolute top-8 left-8 p-3 hover:bg-white/10 rounded-full z-10" onClick={() => setIsScanning(false)}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
           </div>
           
           <div className="w-[85%] h-[65%] border-2 border-blue-500/40 rounded-3xl relative z-10">
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
             {isAnalyzing && <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />}
           </button>
        </div>

        {extractedSegments.length > 0 && (
          <div className="bg-[#1C1C1E] p-10 rounded-t-[3.5rem] animate-in slide-in-from-bottom duration-700 max-h-[50vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-xl font-bold text-white tracking-tight">AI Extraction</h3>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{extractedSegments.length} segments identified</p>
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-[10px] font-black">98% CONFIDENCE</div>
             </div>

             <div className="space-y-4 mb-8">
                {extractedSegments.map((seg, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3">SEGMENT {String(i+1).padStart(2, '0')}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{seg.text}</p>
                  </div>
                ))}
             </div>

             <button className="w-full py-6 bg-[#FF6B2C] rounded-[2.5rem] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-[#FF7D45] transition-all active:scale-95">
                PROCESS WITH AI
             </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-8 space-y-12">
      <section className="grid grid-cols-2 gap-5">
        <button onClick={startCamera} className="col-span-2 capture-btn bg-[#D4FF5F] text-black shadow-[0_25px_50px_rgba(212,255,95,0.2)]">
          <div className="flex justify-between w-full">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" strokeWidth={2.5}/></svg>
            <span className="text-5xl font-black">SCAN</span>
          </div>
          <div className="text-left mt-6">
            <h3 className="text-4xl font-black leading-none tracking-tighter">Scan<br/>Document</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mt-4">PRO OCR ENGINE</p>
          </div>
        </button>

        <button className="capture-btn bg-[#B2A4FF] text-white shadow-[0_25px_50px_rgba(178,164,255,0.2)]">
          <div className="flex justify-end w-full">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <div className="text-left mt-4">
            <h3 className="text-2xl font-black leading-tight">Voice<br/>Note</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">TRANSCRIBE</p>
          </div>
        </button>

        <button className="capture-btn bg-[#FF6B2C] text-white shadow-[0_25px_50px_rgba(255,107,44,0.2)]">
          <div className="flex justify-end w-full">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <div className="text-left mt-4">
            <h3 className="text-2xl font-black leading-tight">Quick<br/>Note</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-3">DRAFT NOW</p>
          </div>
        </button>
      </section>

      <div className="pt-4 pb-20">
        <button onClick={startCamera} className="w-full h-28 bg-[#5d5dff] rounded-[48px] text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center space-x-5 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4"/></svg>
          </div>
          <span>START CAPTURE</span>
        </button>
      </div>
    </div>
  );
};

export default CaptureCenter;