import React, { useState, useRef } from 'react';
import { Project, ImageSize, VideoAspectRatio } from '../types';
import { geminiService } from '../services/geminiService';

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string) => void;
}

type CaptureTab = 'SCAN' | 'IMAGE' | 'VIDEO';

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject }) => {
  const [activeTab, setActiveTab] = useState<CaptureTab>('SCAN');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  
  // Image Generation Settings
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  
  // Video Generation Settings
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [videoSourceImage, setVideoSourceImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkAndOpenKeySelector = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success as per instructions
    }
  };

  const handleImageGen = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setStatusMessage('正在描繪您的想像...');
    try {
      await checkAndOpenKeySelector();
      const url = await geminiService.generateImage(prompt, imageSize);
      setResultUrl(url);
      setStatusMessage('創作完成');
    } catch (e) {
      console.error(e);
      setStatusMessage('生成失敗，請檢查金鑰或嘗試更換提示詞');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoGen = async () => {
    if (!prompt.trim() && !videoSourceImage) return;
    setIsProcessing(true);
    setStatusMessage('正在演算時空...這可能需要幾分鐘');
    try {
      await checkAndOpenKeySelector();
      const base64Img = videoSourceImage ? videoSourceImage.split(',')[1] : undefined;
      const url = await geminiService.generateVideo(prompt, aspectRatio, base64Img);
      setResultUrl(url);
      setStatusMessage('影片演算完成');
    } catch (e) {
      console.error(e);
      setStatusMessage('演算失敗，請確保使用付費金鑰');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setVideoSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-8 space-y-10 animate-in fade-in duration-700">
      {/* Tab Switcher */}
      <div className="flex bg-white/5 p-1.5 rounded-[32px] border border-white/5">
        {[
          { id: 'SCAN', label: '文件掃描', icon: 'fa-expand' },
          { id: 'IMAGE', label: '影像創作', icon: 'fa-image' },
          { id: 'VIDEO', label: '影片演算', icon: 'fa-movie' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as CaptureTab); setResultUrl(null); }}
            className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-[26px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id ? 'bg-[#2563eb] text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {activeTab === 'SCAN' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-12 bg-gradient-to-br from-[#D4FF5F]/10 to-transparent border border-[#D4FF5F]/20 rounded-[44px] flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#D4FF5F] rounded-[32px] flex items-center justify-center text-black shadow-3xl mb-8">
                <i className="fa-solid fa-expand text-4xl"></i>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4">專業 OCR 掃描</h3>
              <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-xs">將手寫稿或書籍轉化為結構化文本</p>
            </div>
            <button className="w-full py-8 bg-[#D4FF5F] text-black font-black text-sm uppercase tracking-[0.5em] rounded-[36px] shadow-3xl active:scale-95 transition-all">
              開 始 掃 描
            </button>
          </div>
        )}

        {activeTab === 'IMAGE' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1C1C1E] p-10 rounded-[44px] border border-white/5 space-y-8 shadow-3xl">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">影像提示詞 PROMPT</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描繪您腦海中的畫面..."
                  className="w-full h-32 bg-black/40 rounded-[28px] p-6 text-white text-base font-medium border border-white/5 outline-none focus:border-blue-600 transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">輸出尺寸 SIZE</label>
                <div className="flex gap-3">
                  {(['1K', '2K', '4K'] as ImageSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`flex-1 py-4 rounded-2xl text-[11px] font-black tracking-widest border transition-all ${imageSize === size ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {resultUrl && (
                <div className="relative group rounded-[32px] overflow-hidden border border-white/10 shadow-3xl">
                  <img src={resultUrl} className="w-full h-auto" alt="Generated" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => window.open(resultUrl)} className="px-6 py-3 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest">
                      查看原始圖
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={handleImageGen}
                disabled={isProcessing || !prompt}
                className={`w-full py-7 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-4 ${isProcessing ? 'bg-gray-800' : 'bg-blue-600 shadow-[0_20px_50px_rgba(37,99,235,0.4)] active:scale-95'}`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                <span>{isProcessing ? statusMessage : '生 成 影 像'}</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              影像由 Nano Banana Pro 驅動，需提供付費金鑰
            </p>
          </div>
        )}

        {activeTab === 'VIDEO' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1C1C1E] p-10 rounded-[44px] border border-white/5 space-y-8 shadow-3xl">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">參考影像 (可選)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video bg-black/40 rounded-[28px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-orange-600/40 transition-all overflow-hidden relative"
                >
                  {videoSourceImage ? (
                    <img src={videoSourceImage} className="w-full h-full object-cover" alt="Source" />
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-700 mb-4"></i>
                      <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">點擊或拖放照片</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">動態提示詞 PROMPT</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述影像該如何律動..."
                  className="w-full h-32 bg-black/40 rounded-[28px] p-6 text-white text-base font-medium border border-white/5 outline-none focus:border-orange-600 transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">影片比例 RATIO</label>
                <div className="flex gap-3">
                  {(['16:9', '9:16'] as VideoAspectRatio[]).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-4 rounded-2xl text-[11px] font-black tracking-widest border transition-all ${aspectRatio === ratio ? 'bg-[#FF6B2C] border-[#FF6B2C] text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}
                    >
                      {ratio === '16:9' ? '橫向 16:9' : '縱向 9:16'}
                    </button>
                  ))}
                </div>
              </div>

              {resultUrl && (
                <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-3xl bg-black">
                  <video src={resultUrl} controls className="w-full aspect-video" />
                </div>
              )}

              <button 
                onClick={handleVideoGen}
                disabled={isProcessing || (!prompt && !videoSourceImage)}
                className={`w-full py-7 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-4 ${isProcessing ? 'bg-gray-800' : 'bg-[#FF6B2C] shadow-[0_20px_50px_rgba(255,107,44,0.4)] active:scale-95'}`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : <i className="fa-solid fa-clapperboard"></i>}
                <span>{isProcessing ? statusMessage : '演 算 影 片'}</span>
              </button>
            </div>
            <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-[36px] flex items-center space-x-6">
               <i className="fa-solid fa-circle-info text-blue-500 text-xl"></i>
               <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                 影像演算由 Veo 驅動。請務必選取已啟用計費功能的 Google API 金鑰，並預留約 2-5 分鐘處理時間。
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureCenter;