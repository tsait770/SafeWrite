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
    <div className="fixed inset-0 z-[105] bg-black flex flex-col items-center justify-center px-12 animate-in fade-in duration-500">
       {/* 精確匹配參考圖 2：同心波紋與麥克風 */}
       <div className="relative w-[340px] h-[340px] mb-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#B2A4FF]/[0.03] animate-[pulse_3s_infinite]"></div>
          <div className="absolute inset-10 rounded-full bg-[#B2A4FF]/[0.08]"></div>
          <div className="absolute inset-20 rounded-full bg-[#B2A4FF]/[0.15] animate-[ping_4s_infinite]"></div>
          <div className="relative w-[120px] h-[120px] bg-[#B2A4FF] rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(178,164,255,0.4)]">
             <i className="fa-solid fa-microphone text-white text-5xl"></i>
          </div>
       </div>

       {/* 狀態文字與計時器 */}
       <div className="text-center space-y-6">
          <h2 className="text-[28px] font-black text-white tracking-tighter">正在聆聽靈感...</h2>
          <p className="text-[52px] font-black text-gray-700/80 tabular-nums leading-none">{formatTime(recordingTime)}</p>
          <p className="text-[11px] text-[#B2A4FF] font-black uppercase tracking-[0.4em] pt-6 opacity-80 animate-pulse">
            TRANSCRIBING WITH GEMINI AI
          </p>
       </div>

       {/* 底部按鈕：位置經過調整以避開底部導航列 */}
       <div className="absolute bottom-[calc(8rem+env(safe-area-inset-bottom,0px))] w-full px-12">
          <button 
            onClick={stopVoiceRecording} 
            className="w-full py-8 bg-white rounded-full text-black font-black text-[13px] uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all"
          >
            停止 並 完成 擷取
          </button>
       </div>
    </div>
  );
};

export default VoiceModule;