
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../../services/geminiService';
import { OCRBlock, CaptureMode } from '../../types';

interface VoiceModuleProps {
  mode: CaptureMode;
  setMode: (mode: CaptureMode) => void;
  setIsProcessing: (loading: boolean) => void;
  setOcrBlocks: (blocks: OCRBlock[]) => void;
  setDetectedLanguage: (lang: string | null) => void;
  setLangConfidence: (conf: number | null) => void;
  setShowDistribution: (show: boolean) => void;
}

const VoiceModule: React.FC<VoiceModuleProps> = ({ 
  mode, 
  setMode, 
  setIsProcessing, 
  setOcrBlocks, 
  setDetectedLanguage, 
  setLangConfidence, 
  setShowDistribution 
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode === 'VOICE_RECORDING') {
      startVoiceRecording();
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [mode]);

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

  if (mode !== 'VOICE_RECORDING') return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-[#0A0A0B] flex flex-col items-center justify-center p-12 animate-in zoom-in duration-500">
       <div className="relative w-72 h-72 mb-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#B2A4FF]/10 animate-ping"></div>
          <div className="absolute inset-4 rounded-full bg-[#B2A4FF]/20 animate-pulse"></div>
          <div className="relative w-40 h-40 bg-[#B2A4FF] rounded-full flex items-center justify-center shadow-[0_0_60px_#B2A4FF] shadow-purple-500/20">
             <i className="fa-solid fa-microphone text-white text-6xl"></i>
          </div>
       </div>
       <h2 className="text-3xl font-black text-white tracking-tighter text-center">正在聆聽靈感...</h2>
       <p className="text-5xl font-black text-white/20 mt-4 tabular-nums">{formatTime(recordingTime)}</p>
       <p className="text-[12px] text-[#B2A4FF] font-black uppercase tracking-[0.4em] mt-6 animate-pulse">TRANSCRIBING WITH GEMINI AI</p>
       <button onClick={stopVoiceRecording} className="mt-28 w-full py-7 bg-white rounded-[44px] text-black font-black text-sm uppercase tracking-[0.4em] active:scale-95 transition-all shadow-2xl">停止並完成擷取</button>
    </div>
  );
};

export default VoiceModule;
