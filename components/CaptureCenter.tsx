
import React, { useState } from 'react';
import { Project, OCRBlock, CaptureMode } from '../types';
import ScanModule from './capture/ScanModule';
import VoiceModule from './capture/VoiceModule';
import QuickNoteModule from './capture/QuickNoteModule';
import DistributionHub from './capture/DistributionHub';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string, chapterId?: string) => void;
  onSaveToNotebook: (content: string) => void;
}

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject, onSaveToNotebook }) => {
  const [mode, setMode] = useState<CaptureMode>('IDLE');
  const [ocrBlocks, setOcrBlocks] = useState<OCRBlock[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [langConfidence, setLangConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);

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
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mt-4">GEMINI PRO V3 OCR ENGINE</p>
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
              onClick={() => setMode('QUICK_NOTE_INPUT')}
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

      {/* 2. Modular Sub-Components */}
      <ScanModule 
        mode={mode} 
        setMode={setMode} 
        setIsProcessing={setIsProcessing}
        setOcrBlocks={setOcrBlocks}
        setDetectedLanguage={setDetectedLanguage}
        setLangConfidence={setLangConfidence}
        setShowDistribution={setShowDistribution}
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

      {/* 3. Global Processing State */}
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
