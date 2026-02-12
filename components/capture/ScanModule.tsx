import React, { useRef, useEffect, useState } from 'react';
import { geminiService } from '../../services/geminiService';
import { OCRBlock, CaptureMode, MembershipLevel } from '../../types';

interface ScanModuleProps {
  mode: CaptureMode;
  setMode: (mode: CaptureMode) => void;
  setIsProcessing: (loading: boolean) => void;
  setOcrBlocks: (blocks: OCRBlock[]) => void;
  setDetectedLanguage: (lang: string | null) => void;
  setLangConfidence: (conf: number | null) => void;
  setShowDistribution: (show: boolean) => void;
  membership: MembershipLevel;
  onUpgrade: () => void;
}

const ScanModule: React.FC<ScanModuleProps> = ({ 
  mode, 
  setMode, 
  setIsProcessing, 
  setOcrBlocks, 
  setDetectedLanguage, 
  setLangConfidence, 
  setShowDistribution,
  membership,
  onUpgrade
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [segments, setSegments] = useState<OCRBlock[]>([]);
  const [isTextDetected, setIsTextDetected] = useState(false);

  // Auto-start camera when mode is SCAN_SELECT
  useEffect(() => {
    if (mode === 'SCAN_SELECT') {
      startCamera();
    }
  }, [mode]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Simulate real-time text detection flicker
  useEffect(() => {
    if (mode === 'CAMERA_ACTIVE' && !showResults) {
      const interval = setInterval(() => {
        setIsTextDetected(Math.random() > 0.3);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [mode, showResults]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      }).catch(async () => {
        return await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      }).catch(async () => {
        return await navigator.mediaDevices.getUserMedia({ video: true });
      });

      streamRef.current = stream;
      setMode('CAMERA_ACTIVE');
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      alert('無法存取相機。請確保已授權權限。');
      setMode('IDLE');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    
    setIsCapturing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      
      // Perform OCR immediately
      const base64Data = dataUrl.split(',')[1];
      try {
        const result = await geminiService.extractTextFromImage(base64Data);
        setDetectedLanguage(result.detectedLanguage);
        setLangConfidence(result.languageConfidence);
        
        const blocks: OCRBlock[] = result.segments.map((s: any, idx: number) => ({
          id: `ocr-${Date.now()}-${idx}`,
          text: s.text,
          type: s.type || 'body',
          confidence: s.confidence || 1.0,
          isSelected: true
        }));

        setSegments(blocks);
        setShowResults(true);
      } catch (err) {
        console.error("AI OCR Error:", err);
        alert("AI 文本提取失敗。");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleSegmentSelection = (id: string) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

  const handleProcessWithAI = () => {
    const selected = segments.filter(s => s.isSelected);
    if (selected.length === 0) {
      alert("請選擇至少一個文本片段。");
      return;
    }
    setOcrBlocks(segments);
    setShowDistribution(true);
    closeModule();
  };

  const closeModule = () => {
    stopCamera();
    setMode('IDLE');
    setCapturedImage(null);
    setShowResults(false);
    setSegments([]);
  };

  if (mode === 'CAMERA_ACTIVE') {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden font-sans">
        
        {/* Top Controls Overlay */}
        <header className="absolute top-0 inset-x-0 h-24 px-8 flex items-center justify-between z-50 pt-[env(safe-area-inset-top,20px)]">
          <button onClick={closeModule} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all shadow-lg">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          <div className="w-12" />
        </header>

        {/* Viewport & Recognition Area */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover brightness-[0.8]" />
          )}

          {/* Dynamic Scanning Frame & L-Corners */}
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
            <div className="w-full aspect-[3/4] border-[1.5px] border-blue-500/50 rounded-[32px] relative shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              {/* L-Corners */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-[3px] border-l-[3px] border-white/80 rounded-tl-[4px]" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-[3px] border-r-[3px] border-white/80 rounded-tr-[4px]" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-[3px] border-l-[3px] border-white/80 rounded-bl-[4px]" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-[3px] border-r-[3px] border-white/80 rounded-br-[4px]" />
              
              {/* Text Highlight Overlays (Visual Simulation) */}
              {!showResults && isTextDetected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-12 pointer-events-none transition-all animate-in fade-in duration-700">
                  <div className="w-full h-5 bg-blue-400/20 rounded-full blur-[2px] animate-pulse"></div>
                  <div className="w-4/5 h-5 bg-blue-400/20 rounded-full blur-[2px] animate-pulse delay-100"></div>
                  <div className="w-11/12 h-5 bg-blue-400/20 rounded-full blur-[2px] animate-pulse delay-200"></div>
                  <div className="w-2/3 h-5 bg-blue-400/20 rounded-full blur-[2px] self-start animate-pulse delay-300"></div>
                </div>
              )}

              {/* AI Badge Overlay */}
              {!showResults && isTextDetected && (
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 animate-in zoom-in duration-500">
                  <div className="bg-[#D4FF5F] px-6 py-2.5 rounded-full flex items-center space-x-2 shadow-[0_0_25px_#D4FF5F55]">
                    <i className="fa-solid fa-wand-magic-sparkles text-black text-xs"></i>
                    <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">AI TEXT DETECTED</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shutter Button Layout */}
          {!showResults && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <button 
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-24 h-24 rounded-full border-[6px] border-white/30 p-1.5 active:scale-90 transition-all group"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                   {isCapturing && <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>}
                </div>
              </button>
            </div>
          )}

          {/* History Button Overlay */}
          {!showResults && (
            <button className="absolute bottom-16 right-10 w-14 h-14 rounded-full bg-[#1A1F2B]/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl active:scale-95 transition-all">
               <i className="fa-solid fa-clock-rotate-left text-lg"></i>
            </button>
          )}
        </div>

        {/* Bottom Sheet - AI Extraction View */}
        {showResults && (
          <div className="bg-[#121926] rounded-t-[48px] p-10 animate-in slide-in-from-bottom duration-700 z-[100] border-t border-white/5 shadow-[0_-30px_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[70vh]">
            {/* Grabber Handle */}
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
            
            <div className="flex justify-between items-start mb-10 shrink-0">
               <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white tracking-tighter">AI Extraction</h3>
                  <p className="text-[13px] text-[#8E8E93] font-medium tracking-tight">
                    {segments.length} text segments identified
                  </p>
               </div>
               <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-500 border border-white/5">
                  <i className="fa-solid fa-clock-rotate-left"></i>
               </button>
            </div>

            {/* Horizontal Scroll Area for Segments */}
            <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-12 shrink-0 px-1">
              {segments.map((seg, idx) => (
                <button 
                  key={seg.id} 
                  onClick={() => toggleSegmentSelection(seg.id)}
                  className={`shrink-0 w-[280px] h-[180px] p-8 rounded-[36px] border transition-all text-left flex flex-col justify-between group active:scale-[0.98] ${
                    seg.isSelected 
                    ? 'bg-[#121926] border-blue-500/50 shadow-[0_15px_40px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' 
                    : 'bg-[#1C2533] border-white/5 opacity-40 grayscale'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${seg.isSelected ? 'text-[#D4FF5F]' : 'text-gray-500'}`}>
                      SEGMENT {String(idx + 1).padStart(2, '0')}
                    </span>
                    {seg.isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#D4FF5F] flex items-center justify-center shadow-[0_0_10px_#D4FF5F55]">
                        <i className="fa-solid fa-check text-black text-[10px]"></i>
                      </div>
                    )}
                  </div>
                  <p className="text-[14px] text-gray-300 leading-relaxed font-medium line-clamp-3 mb-1">
                    {seg.text}
                  </p>
                </button>
              ))}
            </div>

            {/* Call to Action Button */}
            <footer className="shrink-0 mt-auto">
              <button 
                onClick={handleProcessWithAI}
                className="w-full h-[88px] bg-[#FF6B2C] rounded-[36px] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center space-x-4 shadow-[0_20px_50px_rgba(255,107,44,0.35)] active:scale-[0.97] transition-all group"
              >
                 <i className="fa-solid fa-microchip text-lg animate-pulse"></i>
                 <span>PROCESS WITH AI</span>
              </button>
            </footer>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </div>
    );
  }

  return null;
};

export default ScanModule;