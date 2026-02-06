
import React, { useState, useRef, useEffect } from 'react';
import { Project, WritingType, StructureType, Chapter } from '../types';
import { geminiService } from '../services/geminiService';
import { TEMPLATES } from '../constants';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string, chapterId?: string) => void;
  onSaveToNotebook: (content: string) => void;
}

type Mode = 'IDLE' | 'SCAN_SELECT' | 'CAMERA_ACTIVE' | 'VOICE_RECORDING' | 'QUICK_NOTE_INPUT';

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject, onSaveToNotebook }) => {
  const [mode, setMode] = useState<Mode>('IDLE');
  const [capturedText, setCapturedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  
  // 分發面板內部狀態
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  
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
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
      try {
        const results = await geminiService.extractTextFromImage(base64Data);
        const fullText = results.map((r: any) => r.text).join('\n');
        setCapturedText(fullText);
        setShowDistribution(true);
        stopCamera();
      } catch (e) {
        alert('OCR 提取失敗');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleQuickNoteFinish = () => {
    if (capturedText.trim()) {
      setMode('IDLE');
      setShowDistribution(true);
    }
  };

  const handleVoiceFinish = () => {
    setIsProcessing(true);
    // 模擬 AI 轉錄過程
    setTimeout(() => {
      setCapturedText("這是語音轉化後的文本示例。文字的力量在於流動與碰撞，捕捉這些閃現的靈感至關重要。");
      setIsProcessing(false);
      setMode('IDLE');
      setShowDistribution(true);
    }, 2000);
  };

  const handleFinalSave = () => {
    if (selectedProjectId) {
      onSaveToProject(selectedProjectId, capturedText, selectedChapterId || undefined);
    } else {
      onSaveToNotebook(capturedText);
    }
    setShowDistribution(false);
    setCapturedText('');
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex flex-col h-full bg-black text-white px-8 pb-40 overflow-y-auto no-scrollbar">
      
      {/* 1. Main Dashboard */}
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
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mt-4">PRO OCR ENGINE</p>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => setMode('VOICE_RECORDING')}
              className="bg-[#B2A4FF] rounded-[44px] aspect-square p-8 flex flex-col justify-between items-start text-white shadow-[0_30px_60px_rgba(178,164,255,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-end w-full"><i className="fa-solid fa-microphone-lines text-3xl"></i></div>
              <div className="text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tight">Voice<br/>Note</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mt-2">TRANSCRIBE</p>
              </div>
            </button>
            <button 
              onClick={() => { setCapturedText(''); setMode('QUICK_NOTE_INPUT'); }}
              className="bg-[#FF6B2C] rounded-[44px] aspect-square p-8 flex flex-col justify-between items-start text-white shadow-[0_30px_60px_rgba(255,107,44,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-end w-full"><i className="fa-solid fa-pen-nib text-3xl"></i></div>
              <div className="text-left">
                <h4 className="text-2xl font-black leading-tight tracking-tight">Quick<br/>Note</h4>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mt-2">DRAFT NOW</p>
              </div>
            </button>
          </div>

          <section className="space-y-6 pt-4">
             <div className="flex justify-between items-center">
                <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">RECENT CAPTURES</h5>
                <button className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">VIEW ALL</button>
             </div>
             <div className="space-y-4">
                {[
                  { id: 'r1', title: 'Research Snippet', time: '2H AGO', icon: 'fa-file-lines', color: 'bg-green-500/20 text-green-500' },
                  { id: 'r2', title: 'Meeting Record', time: 'YESTERDAY', icon: 'fa-microphone', color: 'bg-purple-500/20 text-purple-500' }
                ].map(cap => (
                  <div key={cap.id} className="bg-[#1C1C1E] p-6 rounded-[32px] flex items-center justify-between border border-white/5 group">
                     <div className="flex items-center space-x-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cap.color}`}><i className={`fa-solid ${cap.icon} text-xl`}></i></div>
                        <div><h6 className="text-sm font-black text-white">{cap.title}</h6><p className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-widest">{cap.time}</p></div>
                     </div>
                     <i className="fa-solid fa-chevron-right text-gray-800 group-hover:text-white"></i>
                  </div>
                ))}
             </div>
          </section>
        </div>
      )}

      {/* 2. SCAN Select Modal */}
      {mode === 'SCAN_SELECT' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setMode('IDLE')} />
           <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-[44px] border border-white/5 overflow-hidden shadow-3xl animate-in zoom-in duration-300">
              <header className="p-10 border-b border-white/5 flex justify-between items-center">
                 <div><h2 className="text-2xl font-black text-white">文件掃描</h2><p className="text-[10px] font-black text-gray-500 uppercase mt-1">PRO OCR ENGINE</p></div>
                 <button onClick={() => setMode('IDLE')} className="w-12 h-12 rounded-full bg-white/5 text-gray-500"><i className="fa-solid fa-xmark"></i></button>
              </header>
              <main className="p-10 space-y-8">
                 <div className="w-full aspect-video border-2 border-dashed border-[#D4FF5F]/20 bg-[#D4FF5F]/5 rounded-[32px] flex flex-col items-center justify-center space-y-5 group cursor-pointer hover:border-[#D4FF5F]/50 transition-all">
                    <i className="fa-solid fa-arrow-up-from-bracket text-4xl text-[#D4FF5F]"></i>
                    <p className="text-lg font-black text-white">上傳圖片</p>
                 </div>
                 <button onClick={startCamera} className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center space-x-4">
                    <i className="fa-solid fa-camera text-[#D4FF5F]"></i><span className="text-sm font-black text-white">拍照掃描</span>
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
              <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none flex items-center justify-center">
                 <div className="w-full h-2/3 border-2 border-[#D4FF5F] rounded-[44px] relative">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-[#D4FF5F] -translate-x-2 -translate-y-2 rounded-tl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-[#D4FF5F] translate-x-2 translate-y-2 rounded-br-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4FF5F] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">AI SCAN ACTIVE</div>
                 </div>
              </div>
           </div>
           <footer className="h-48 bg-black flex items-center justify-around px-12 pb-10">
              <button onClick={stopCamera} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
              <button onClick={handleCapture} className="w-28 h-28 rounded-full bg-white border-[10px] border-[#D4FF5F] shadow-[0_0_40px_rgba(212,255,95,0.4)] flex items-center justify-center active:scale-90 transition-transform">
                 <div className="w-20 h-20 rounded-full bg-[#D4FF5F]" />
              </button>
              <div className="w-16" />
           </footer>
           <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* 4. VOICE Recording View */}
      {mode === 'VOICE_RECORDING' && (
        <div className="fixed inset-0 z-[2000] bg-[#0A0A0B] flex flex-col items-center justify-center p-12 animate-in zoom-in duration-500">
           <div className="relative w-72 h-72 mb-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#B2A4FF]/10 animate-ping"></div>
              <div className="absolute inset-4 rounded-full bg-[#B2A4FF]/20 animate-pulse"></div>
              <div className="relative w-40 h-40 bg-[#B2A4FF] rounded-full flex items-center justify-center shadow-[0_0_60px_#B2A4FF]"><i className="fa-solid fa-microphone text-white text-6xl"></i></div>
           </div>
           <h2 className="text-3xl font-black text-white tracking-tighter text-center">正在聆聽靈感...</h2>
           <p className="text-[12px] text-[#B2A4FF] font-black uppercase tracking-[0.4em] mt-6 animate-pulse">TRANSCRIBING IN REALTIME</p>
           <button onClick={handleVoiceFinish} className="mt-28 w-full py-7 bg-white rounded-[44px] text-black font-black text-sm uppercase tracking-[0.4em] active:scale-95 transition-all">停止並完成擷取</button>
        </div>
      )}

      {/* 5. QUICK NOTE Input View */}
      {mode === 'QUICK_NOTE_INPUT' && (
        <div className="fixed inset-0 z-[2000] bg-[#0A0A0B] p-10 flex flex-col animate-in slide-in-from-bottom duration-500">
           <header className="flex justify-between items-center mb-12">
              <div><h2 className="text-2xl font-black text-white">快速筆記</h2><p className="text-[10px] text-orange-500 font-black uppercase mt-1">DRAFT NOW</p></div>
              <button onClick={() => setMode('IDLE')} className="w-12 h-12 rounded-full bg-white/5 text-gray-400"><i className="fa-solid fa-xmark"></i></button>
           </header>
           <textarea autoFocus value={capturedText} onChange={(e) => setCapturedText(e.target.value)} className="flex-1 bg-transparent border-none outline-none resize-none text-3xl font-bold text-white placeholder-white/5 font-serif-editor leading-relaxed" placeholder="在此輸入您閃現的靈感..." />
           <footer className="pt-10"><button onClick={handleQuickNoteFinish} className="w-full py-7 bg-[#FF6B2C] rounded-[44px] text-white font-black text-sm uppercase tracking-[0.4em] active:scale-95 transition-all">進入分發中心</button></footer>
        </div>
      )}

      {/* 6. DISTRIBUTION HUB Modal (核心分發邏輯) */}
      {showDistribution && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-8">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowDistribution(false)} />
           <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-[56px] border border-white/5 overflow-hidden shadow-3xl flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[90vh]">
              <header className="p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                 <div><h2 className="text-2xl font-black text-white">分發中心</h2><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">DISTRIBUTION HUB</p></div>
                 <button onClick={() => setShowDistribution(false)} className="w-12 h-12 rounded-full bg-white/5 text-gray-400"><i className="fa-solid fa-xmark"></i></button>
              </header>
              <main className="p-10 overflow-y-auto no-scrollbar flex-1 space-y-10">
                 <div className="bg-black/40 rounded-[32px] p-8 border border-white/5 font-serif-editor text-xl leading-relaxed text-gray-300">
                    {capturedText || "尚未輸入內容..."}
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">存儲目標 DESTINATION</h5>
                    <button 
                      onClick={() => setSelectedProjectId(null)}
                      className={`w-full p-6 rounded-[32px] border flex items-center justify-between transition-all ${selectedProjectId === null ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-400'}`}
                    >
                       <div className="flex items-center space-x-4"><i className="fa-solid fa-box-archive text-xl"></i><span className="text-sm font-black uppercase tracking-widest">存入靈感筆記本</span></div>
                       {selectedProjectId === null && <i className="fa-solid fa-circle-check"></i>}
                    </button>
                    
                    {projects.map(p => (
                      <div key={p.id} className="space-y-3">
                        <button 
                          onClick={() => setSelectedProjectId(p.id)}
                          className={`w-full p-6 rounded-[32px] border flex items-center justify-between transition-all ${selectedProjectId === p.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}
                        >
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: p.color }}><i className={`fa-solid ${p.icon} text-black text-xs`}></i></div>
                              <span className="text-sm font-black">{p.name}</span>
                           </div>
                           {selectedProjectId === p.id && <i className="fa-solid fa-chevron-down text-xs opacity-40"></i>}
                        </button>
                        
                        {selectedProjectId === p.id && (
                          <div className="pl-6 pr-2 py-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
                             <h6 className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-2">選擇章節 CHAPTER</h6>
                             <div className="flex flex-wrap gap-2">
                               {p.chapters.map(c => (
                                 <button 
                                  key={c.id} 
                                  onClick={() => setSelectedChapterId(c.id === selectedChapterId ? null : c.id)}
                                  className={`px-5 py-3 rounded-2xl text-[10px] font-black transition-all border ${selectedChapterId === c.id ? 'bg-[#7b61ff] border-[#7b61ff] text-white shadow-md' : 'bg-white/5 border-white/5 text-gray-500'}`}
                                 >
                                   {c.title}
                                 </button>
                               ))}
                               <button 
                                 onClick={() => setSelectedChapterId(null)}
                                 className={`px-5 py-3 rounded-2xl text-[10px] font-black border transition-all ${selectedChapterId === null ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}
                               >
                                 + 新建章節
                               </button>
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
              </main>
              <footer className="p-10 shrink-0">
                 <button onClick={handleFinalSave} className="w-full py-7 bg-[#D4FF5F] text-black font-black text-sm uppercase tracking-[0.4em] rounded-[32px] shadow-2xl active:scale-[0.97] transition-all">
                    完 成 並 分 發 內 容
                 </button>
              </footer>
           </div>
        </div>
      )}

      {/* Global Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-[6px] border-blue-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-8 bg-blue-500/10 rounded-full animate-pulse"></div>
           </div>
           <h2 className="text-3xl font-black text-white tracking-tighter text-center px-12 leading-tight">正在救贖創作思緒...</h2>
           <p className="text-[12px] text-blue-500 font-black uppercase tracking-[0.5em] mt-8 animate-pulse">AI PROCESSING ACTIVE</p>
        </div>
      )}
    </div>
  );
};

export default CaptureCenter;
