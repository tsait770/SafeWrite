
import React, { useState, useRef, useEffect } from 'react';
import { Project, WritingType, StructureType, Chapter } from '../types';
import { geminiService } from '../services/geminiService';
import { TEMPLATES } from '../constants';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string, chapterId?: string) => void;
  onSaveToNotebook: (content: string) => void;
}

interface OCRBlock {
  id: string;
  text: string;
  type: string;
  confidence: number;
  isSelected: boolean;
  isProcessing?: boolean;
}

type Mode = 'IDLE' | 'SCAN_SELECT' | 'CAMERA_ACTIVE' | 'VOICE_RECORDING' | 'QUICK_NOTE_INPUT';

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject, onSaveToNotebook }) => {
  const [mode, setMode] = useState<Mode>('IDLE');
  const [ocrBlocks, setOcrBlocks] = useState<OCRBlock[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [langConfidence, setLangConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
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

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          setIsProcessing(true);
          try {
            const text = await geminiService.transcribeAudio(base64Data, 'audio/webm');
            if (text && text.trim()) {
              setOcrBlocks([{
                id: `voice-${Date.now()}`,
                text: text,
                type: 'body',
                confidence: 0.98,
                isSelected: true
              }]);
              setDetectedLanguage("音訊偵測");
              setLangConfidence(1);
              setShowDistribution(true);
            } else {
              alert('未偵測到有效的語音內容');
            }
          } catch (e) {
            alert('語音轉錄失敗');
          } finally {
            setIsProcessing(false);
          }
        };
        stream.getTracks().forEach(t => t.stop());
      };

      setRecordingTime(0);
      setMode('VOICE_RECORDING');
      mediaRecorder.start();
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      alert('無法存取麥克風：' + err);
      setMode('IDLE');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setMode('IDLE');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuickNoteFinish = (text: string) => {
    if (text.trim()) {
      setOcrBlocks([{
        id: `note-${Date.now()}`,
        text: text,
        type: 'body',
        confidence: 1,
        isSelected: true
      }]);
      setDetectedLanguage("手動輸入");
      setLangConfidence(1);
      setMode('IDLE');
      setShowDistribution(true);
    }
  };

  const handleFinalSave = () => {
    const selectedContent = ocrBlocks
      .filter(b => b.isSelected)
      .map(b => b.text)
      .join('\n\n');

    if (!selectedContent.trim()) {
      alert('請至少選擇一個區塊進行分發');
      return;
    }

    if (selectedProjectId) {
      onSaveToProject(selectedProjectId, selectedContent, selectedChapterId || undefined);
    } else {
      onSaveToNotebook(selectedContent);
    }
    setShowDistribution(false);
    setOcrBlocks([]);
    setDetectedLanguage(null);
  };

  const toggleBlockSelection = (id: string) => {
    setOcrBlocks(prev => prev.map(b => b.id === id ? { ...b, isSelected: !b.isSelected } : b));
  };

  const handleBlockAction = async (id: string, action: 'copy' | 'summarize' | 'rewrite') => {
    const block = ocrBlocks.find(b => b.id === id);
    if (!block) return;

    if (action === 'copy') {
      await navigator.clipboard.writeText(block.text);
      return;
    }

    setOcrBlocks(prev => prev.map(b => b.id === id ? { ...b, isProcessing: true } : b));
    try {
      let resultText = '';
      if (action === 'summarize') {
        resultText = await geminiService.summarizeText(block.text);
      } else if (action === 'rewrite') {
        resultText = await geminiService.rewriteText(block.text);
      }
      setOcrBlocks(prev => prev.map(b => b.id === id ? { ...b, text: resultText, isProcessing: false } : b));
    } catch (e) {
      alert('AI 處理失敗');
      setOcrBlocks(prev => prev.map(b => b.id === id ? { ...b, isProcessing: false } : b));
    }
  };

  const getSegmentStyle = (type: string) => {
    switch (type) {
      case 'title': return 'text-2xl sm:text-3xl font-black text-white tracking-tighter mb-4';
      case 'heading': return 'text-xl font-bold text-blue-400 tracking-tight mb-2';
      case 'quote': return 'italic border-l-4 border-purple-500/50 pl-6 text-purple-200/80 leading-relaxed';
      case 'metadata': return 'text-xs font-mono text-gray-500 uppercase tracking-widest';
      default: return 'text-lg font-serif-editor leading-relaxed text-gray-300';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'title': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'heading': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'quote': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'metadata': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      default: return 'bg-white/5 text-gray-400 border-white/5';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white px-8 pb-40 overflow-y-auto no-scrollbar">
      
      {/* 1. Dashboard */}
      {mode === 'IDLE' && (
        <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setMode('SCAN_SELECT')}
            className="w-full bg-[#D4FF5F] rounded-[44px] p-10 flex flex-col justify-between items-start text-black h-[320px] shadow-[0_30px_60px_rgba(212,255,95,0.15)] active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between w-full items-start">
              <i className="fa-solid fa-camera text-4xl opacity-80"></i>
              <span className="text-5xl font-black tracking-tighter opacity-80">SCAN</span>
            </div>
            <div className="text-left">
              <h3 className="text-4xl font-black leading-tight tracking-tighter">Scan<br/>Document</h3>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mt-4">GEMINI PRO V3 OCR ENGINE</p>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={startVoiceRecording}
              className="bg-[#B2A4FF] rounded-[44px] aspect-square p-8 flex flex-col justify-between items-start text-white shadow-[0_30px_60px_rgba(178,164,255,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-end w-full"><i className="fa-solid fa-microphone-lines text-3xl"></i></div>
              <div className="text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tight">Voice<br/>Note</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mt-2">TRANSCRIBE</p>
              </div>
            </button>
            <button 
              onClick={() => { setOcrBlocks([]); setMode('QUICK_NOTE_INPUT'); }}
              className="bg-[#FF6B2C] rounded-[44px] aspect-square p-8 flex flex-col justify-between items-start text-white shadow-[0_30px_60px_rgba(255,107,44,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-end w-full"><i className="fa-solid fa-pen-nib text-3xl"></i></div>
              <div className="text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tight">Quick<br/>Note</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mt-2">DRAFT NOW</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 2. SCAN Select */}
      {mode === 'SCAN_SELECT' && (
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
      )}

      {/* 3. CAMERA View */}
      {mode === 'CAMERA_ACTIVE' && (
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
      )}

      {/* 4. DISTRIBUTION HUB */}
      {showDistribution && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-8">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowDistribution(false)} />
           <div className="relative w-full max-w-4xl bg-[#1C1C1E] rounded-[56px] border border-white/5 overflow-hidden shadow-3xl flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[92vh]">
              <header className="p-8 sm:p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                 <div className="space-y-1">
                   <h2 className="text-2xl font-black text-white tracking-tight">靈感分發中心</h2>
                   <div className="flex items-center space-x-3">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">LOGICAL EXTRACTION HUB</p>
                      {detectedLanguage && (
                        <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 px-3 py-1 rounded-full">
                           <i className="fa-solid fa-language text-[10px] text-blue-400"></i>
                           <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{detectedLanguage}</span>
                           {langConfidence && <span className="text-[8px] text-blue-500/60 font-bold">{(langConfidence * 100).toFixed(0)}%</span>}
                        </div>
                      )}
                   </div>
                 </div>
                 <button onClick={() => setShowDistribution(false)} className="w-12 h-12 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark"></i>
                 </button>
              </header>
              
              <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-10 flex flex-col lg:flex-row gap-10">
                 {/* Left: OCR Segments */}
                 <div className="flex-1 space-y-8">
                    <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">識別到的結構區塊</h5>
                    <div className="space-y-4">
                       {ocrBlocks.map((block) => (
                         <div 
                           key={block.id} 
                           className={`relative group bg-black/30 rounded-[32px] border transition-all overflow-hidden ${block.isSelected ? 'border-blue-500/40 bg-blue-600/5' : 'border-white/5 opacity-60'}`}
                         >
                           <div className="p-6 sm:p-8 flex items-start space-x-5">
                              <button 
                                onClick={() => toggleBlockSelection(block.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all mt-1 shrink-0 ${block.isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10'}`}
                              >
                                 {block.isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getBadgeColor(block.type)}`}>
                                          {block.type}
                                       </span>
                                       <div className="flex items-center space-x-1.5">
                                          <div className={`w-8 h-1.5 rounded-full overflow-hidden ${block.confidence < 0.7 ? 'bg-red-500/20' : 'bg-white/5'}`}>
                                             <div className={`h-full transition-all ${block.confidence < 0.7 ? 'bg-red-500' : 'bg-green-500/60'}`} style={{ width: `${block.confidence * 100}%` }} />
                                          </div>
                                          <span className={`text-[9px] font-bold ${block.confidence < 0.7 ? 'text-red-500' : 'text-gray-600'}`}>{(block.confidence * 100).toFixed(0)}%</span>
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                       <button onClick={() => handleBlockAction(block.id, 'summarize')} className="p-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-compress text-xs"></i></button>
                                       <button onClick={() => handleBlockAction(block.id, 'rewrite')} className="p-2 bg-purple-600/10 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-all"><i className="fa-solid fa-wand-sparkles text-xs"></i></button>
                                    </div>
                                 </div>
                                 
                                 <div className="relative">
                                   {block.isProcessing && (
                                     <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                     </div>
                                   )}
                                   <div className={`${getSegmentStyle(block.type)} whitespace-pre-wrap transition-all ${block.isSelected ? 'opacity-100' : 'opacity-40'} ${block.isProcessing ? 'blur-[1px]' : ''}`}>
                                      {block.text}
                                   </div>
                                 </div>
                              </div>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Right: Distribution Destination */}
                 <div className="lg:w-80 space-y-10 shrink-0">
                    <div className="space-y-6">
                       <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">存儲目標庫</h5>
                       <div className="space-y-3">
                          <button 
                            onClick={() => setSelectedProjectId(null)}
                            className={`w-full p-6 rounded-[32px] border flex items-center justify-between transition-all ${selectedProjectId === null ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-400'}`}
                          >
                             <div className="flex items-center space-x-4">
                                <i className="fa-solid fa-box-archive text-xl"></i>
                                <span className="text-sm font-black uppercase tracking-widest">靈感筆記本</span>
                             </div>
                             {selectedProjectId === null && <i className="fa-solid fa-circle-check"></i>}
                          </button>
                          
                          {projects.map(p => (
                            <div key={p.id} className="space-y-3">
                              <button 
                                onClick={() => setSelectedProjectId(p.id)}
                                className={`w-full p-6 rounded-[32px] border flex items-center justify-between transition-all ${selectedProjectId === p.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}
                              >
                                 <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: p.color }}><i className={`fa-solid ${p.icon} text-black text-xs`}></i></div>
                                    <span className="text-sm font-black truncate max-w-[120px]">{p.name}</span>
                                 </div>
                                 {selectedProjectId === p.id && <i className="fa-solid fa-chevron-down text-xs opacity-40"></i>}
                              </button>
                              
                              {selectedProjectId === p.id && (
                                <div className="pl-6 py-2 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-300">
                                   {p.chapters.map(c => (
                                     <button key={c.id} onClick={() => setSelectedChapterId(c.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all border ${selectedChapterId === c.id ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>{c.title}</button>
                                   ))}
                                   <button onClick={() => setSelectedChapterId(null)} className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all ${selectedChapterId === null ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>+ 新章節</button>
                                </div>
                              )}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </main>

              <footer className="p-8 sm:p-10 bg-[#0F0F10] border-t border-white/5">
                 <button onClick={handleFinalSave} className="w-full py-7 bg-[#D4FF5F] text-black font-black text-sm uppercase tracking-[0.4em] rounded-[32px] shadow-2xl active:scale-[0.97] transition-all">完 成 並 分 發 內 容</button>
              </footer>
           </div>
        </div>
      )}

      {/* Global Processing */}
      {isProcessing && (
        <div className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-[6px] border-blue-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-8 bg-blue-500/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center"><i className="fa-solid fa-eye text-xl text-blue-500 animate-bounce"></i></div>
           </div>
           <h2 className="text-3xl font-black text-white tracking-tighter text-center px-12 leading-tight">正在執行深度語義佈局分析...</h2>
           <p className="text-[12px] text-blue-500 font-black uppercase tracking-[0.5em] mt-8 animate-pulse">GEMINI PRO V3 ENGINE ACTIVE</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CaptureCenter;
