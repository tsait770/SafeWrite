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

  // Start camera when entering scan mode
  useEffect(() => {
    if (mode === 'SCAN_SELECT') {
      startCamera();
    }
  }, [mode]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

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
      console.error("Camera access error:", err);
      alert('無法存取相機。');
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
        alert("AI 文字偵測失敗。");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleSegment = (id: string) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

  const handleProcessWithAI = () => {
    const selected = segments.filter(s => s.isSelected);
    if (selected.length === 0) {
      alert("請至少選擇一個文字片段");
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
        
        {/* 精確匹配參考圖：左上角 X 按鈕 */}
        <header className="absolute top-0 inset-x-0 h-24 px-8 flex items-center justify-start z-50 pt-[env(safe-area-inset-top,20px)]">
          <button onClick={closeModule} className="w-12 h-12 flex items-center justify-center text-white active:scale-90 transition-all opacity-80">
            <i className="fa-solid fa-xmark text-3xl"></i>
          </button>
        </header>

        {/* 取景器區域 */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover brightness-[0.85]" />
          )}

          {/* 精確匹配參考圖：掃描區域疊加層 */}
          {!showResults && (
            <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-14 pointer-events-none">
              <div className="w-full aspect-[3/4] border-[1.5px] border-blue-400/40 rounded-[44px] relative">
                
                {/* 參考圖特色：白色粗體 L 角 */}
                <div className="absolute -top-1 -left-1 w-20 h-20 border-t-[10px] border-l-[10px] border-white rounded-tl-[44px]" />
                <div className="absolute -top-1 -right-1 w-20 h-20 border-t-[10px] border-r-[10px] border-white rounded-tr-[44px]" />
                <div className="absolute -bottom-1 -left-1 w-20 h-20 border-b-[10px] border-l-[10px] border-white rounded-bl-[44px]" />
                <div className="absolute -bottom-1 -right-1 w-20 h-20 border-b-[10px] border-r-[10px] border-white rounded-br-[44px]" />
                
                {/* 根據要求已移除 AI SCAN ACTIVE 標籤 */}
              </div>
            </div>
          )}

          {/* 精確匹配參考圖：大型白色快門按鈕 */}
          {!showResults && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
              <button 
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-32 h-32 rounded-full border-[10px] border-white/20 p-2 active:scale-95 transition-all shadow-3xl"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                   {isCapturing && <div className="w-14 h-14 border-[6px] border-black/10 border-t-black rounded-full animate-spin"></div>}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 擷取結果面板 */}
        {showResults && (
          <div className="bg-[#0F1420] rounded-t-[48px] p-10 animate-in slide-in-from-bottom duration-700 z-[100] border-t border-white/5 shadow-[0_-40px_100px_rgba(0,0,0,0.9)] flex flex-col">
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
            <div className="flex justify-between items-start mb-10 shrink-0">
               <div className="space-y-1.5">
                  <h3 className="text-3xl font-black text-white tracking-tighter">AI Extraction</h3>
                  <p className="text-[14px] text-[#8E8E93] font-semibold tracking-tight">
                    {segments.length} text segments identified
                  </p>
               </div>
               <button className="w-14 h-14 rounded-full bg-[#1A1F2B] flex items-center justify-center text-blue-500 border border-white/5">
                  <i className="fa-solid fa-clock-rotate-left text-lg"></i>
               </button>
            </div>

            <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-12 shrink-0 px-1">
              {segments.map((seg, idx) => (
                <button 
                  key={seg.id} 
                  onClick={() => toggleSegment(seg.id)}
                  className={`shrink-0 w-[300px] h-[180px] p-8 rounded-[36px] border transition-all text-left flex flex-col justify-between active:scale-[0.98] ${
                    seg.isSelected 
                    ? 'bg-[#121926] border-blue-500/60 shadow-[0_20px_50px_rgba(59,130,246,0.15)]' 
                    : 'bg-[#1C2533] border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[12px] font-black uppercase tracking-[0.25em] ${seg.isSelected ? 'text-[#D4FF5F]' : 'text-gray-500'}`}>
                      SEGMENT {String(idx + 1).padStart(2, '0')}
                    </span>
                    {seg.isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#D4FF5F] flex items-center justify-center shadow-[0_0_15px_#D4FF5F66]">
                        <i className="fa-solid fa-check text-black text-[12px]"></i>
                      </div>
                    )}
                  </div>
                  <p className="text-[15px] text-gray-300 leading-relaxed font-medium line-clamp-3">
                    {seg.text}
                  </p>
                </button>
              ))}
            </div>

            <footer className="shrink-0 mt-auto pb-6">
              <button 
                onClick={handleProcessWithAI}
                className="w-full h-[92px] bg-[#FF6B2C] rounded-[36px] text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-[0_25px_60px_rgba(255,107,44,0.4)] active:scale-[0.97] transition-all"
              >
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <i className="fa-solid fa-microchip text-xl"></i>
                 </div>
                 <span>PROCESS WITH AI</span>
              </button>
            </footer>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
      </div>
    );
  }

  return null;
};

export default ScanModule;