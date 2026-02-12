
import React, { useRef, useEffect } from 'react';
import { geminiService } from '../../services/geminiService';
import { OCRBlock, CaptureMode } from '../../types';

interface ScanModuleProps {
  mode: CaptureMode;
  setMode: (mode: CaptureMode) => void;
  setIsProcessing: (loading: boolean) => void;
  setOcrBlocks: (blocks: OCRBlock[]) => void;
  setDetectedLanguage: (lang: string | null) => void;
  setLangConfidence: (conf: number | null) => void;
  setShowDistribution: (show: boolean) => void;
}

const ScanModule: React.FC<ScanModuleProps> = ({ 
  mode, 
  setMode, 
  setIsProcessing, 
  setOcrBlocks, 
  setDetectedLanguage, 
  setLangConfidence, 
  setShowDistribution 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMode('CAMERA_ACTIVE');
      }
    } catch (err) {
      alert('無法存取相機：' + err);
      setMode('IDLE');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setMode('IDLE');
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      try {
        const result = await geminiService.extractTextFromImage(base64Data);
        setDetectedLanguage(result.detectedLanguage);
        setLangConfidence(result.languageConfidence);
        const blocks: OCRBlock[] = result.segments.map((r: any, i: number) => ({
          id: `ocr-${Date.now()}-${i}`,
          text: r.text,
          type: r.type || 'body',
          confidence: r.confidence,
          isSelected: true
        }));
        setOcrBlocks(blocks);
        setShowDistribution(true);
        stopCamera();
      } catch (e) {
        alert('OCR 提取失敗，請確認網路連線');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (mode === 'SCAN_SELECT') {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
         <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setMode('IDLE')} />
         <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-[44px] border border-white/5 overflow-hidden shadow-3xl animate-in zoom-in duration-300">
            <header className="p-10 border-b border-white/5">
               <h2 className="text-2xl font-black text-white">文件掃描</h2>
               <p className="text-[10px] font-black text-gray-500 uppercase mt-1">ADVANCED LOGICAL CAPTURE</p>
            </header>
            <main className="p-10 space-y-6">
               <button onClick={startCamera} className="w-full py-8 bg-blue-600 rounded-3xl flex items-center justify-center space-x-4 active:scale-95 transition-all shadow-xl">
                  <i className="fa-solid fa-camera text-white text-xl"></i>
                  <span className="text-lg font-black text-white">啟動高清掃描</span>
               </button>
               <div className="text-center">
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">or upload from gallery</span>
               </div>
               <button className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center space-x-4 active:scale-95 transition-all">
                  <i className="fa-solid fa-image text-gray-400"></i>
                  <span className="text-sm font-black text-gray-400">選擇圖片檔案</span>
               </button>
            </main>
         </div>
      </div>
    );
  }

  if (mode === 'CAMERA_ACTIVE') {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in fade-in duration-500">
         <div className="flex-1 relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-[85%] h-[70%] border-2 border-[#D4FF5F] rounded-[44px] relative shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-[#D4FF5F] -translate-x-2 -translate-y-2 rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-[#D4FF5F] translate-x-2 translate-y-2 rounded-br-3xl"></div>
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4FF5F] to-transparent shadow-[0_0_30px_#D4FF5F] animate-[scan_2.5s_infinite] pointer-events-none"></div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#D4FF5F] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">SEMANTIC SCAN ACTIVE</div>
               </div>
            </div>
         </div>
         <footer className="h-48 bg-black flex items-center justify-around px-12 pb-10">
            <button onClick={stopCamera} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-transform">
               <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <button onClick={handleCapture} className="w-28 h-28 rounded-full bg-white border-[10px] border-[#D4FF5F] shadow-[0_0_40px_rgba(212,255,95,0.4)] flex items-center justify-center active:scale-90 transition-transform">
               <div className="w-20 h-20 rounded-full bg-[#D4FF5F]" />
            </button>
            <div className="w-16" />
         </footer>
         <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return null;
};

export default ScanModule;
