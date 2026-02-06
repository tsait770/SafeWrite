
import React, { useState } from 'react';
import { Project } from '../types';

interface CaptureItem {
  id: string;
  title: string;
  excerpt: string;
  time: string;
  type: 'SCAN' | 'VOICE' | 'NOTE';
  icon: string;
  color: string;
}

interface CaptureCenterProps {
  projects: Project[];
  onSaveToProject: (projectId: string, content: string) => void;
}

const CaptureCenter: React.FC<CaptureCenterProps> = ({ projects, onSaveToProject }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState<string | null>(null);

  const recentCaptures: CaptureItem[] = [
    { 
      id: '1', 
      title: 'Research Paper Snippet', 
      excerpt: '"The methodology for the quantum entan...', 
      time: '2H AGO', 
      type: 'SCAN', 
      icon: 'fa-file-lines', 
      color: 'bg-green-900/40 text-[#D4FF5F]' 
    },
    { 
      id: '2', 
      title: 'Meeting Recording', 
      excerpt: '02:44 Audio Log', 
      time: 'YESTERDAY', 
      type: 'VOICE', 
      icon: 'fa-microphone', 
      color: 'bg-purple-900/40 text-[#B2A4FF]' 
    },
    { 
      id: '3', 
      title: 'Whiteboard Session', 
      excerpt: '3 images attached • Project: Neon Shado...', 
      time: '3 DAYS AGO', 
      type: 'NOTE', 
      icon: 'fa-image', 
      color: 'bg-orange-900/40 text-[#FF6B2C]' 
    },
  ];

  const handleAction = (type: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSaveOptions(`來自 ${type} 的擷取內容片段...`);
    }, 1500);
  };

  return (
    <div className="px-8 flex flex-col space-y-10 animate-in fade-in duration-700 pb-32">
      {/* 頂部格柵佈局 */}
      <div className="grid grid-cols-2 gap-5 pt-4">
        {/* Scan Document - 螢光綠大卡片 */}
        <div 
          onClick={() => handleAction('SCAN')}
          className="col-span-2 h-[340px] bg-[#D4FF5F] rounded-[44px] p-10 flex flex-col justify-between shadow-[0_40px_80px_rgba(212,255,95,0.15)] active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center text-black border border-black/5">
              <i className="fa-solid fa-expand text-3xl"></i>
            </div>
            <span className="text-[44px] font-black text-black tracking-tighter opacity-80">SCAN</span>
          </div>
          <div>
            <h3 className="text-4xl font-black text-black tracking-tighter leading-none mb-3">Scan<br/>Document</h3>
            <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.3em]">PRO OCR ENGINE</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-black/5 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Voice Note - 夢幻紫 */}
        <div 
          onClick={() => handleAction('VOICE')}
          className="h-[220px] bg-[#B2A4FF] rounded-[44px] p-8 flex flex-col justify-between shadow-[0_30px_60px_rgba(178,164,255,0.15)] active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex justify-end">
            <i className="fa-solid fa-microphone text-white/50 text-3xl"></i>
          </div>
          <div>
            <h4 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">Voice<br/>Note</h4>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">TRANSCRIBE</p>
          </div>
        </div>

        {/* Quick Note - 活力橘 */}
        <div 
          onClick={() => handleAction('NOTE')}
          className="h-[220px] bg-[#FF6B2C] rounded-[44px] p-8 flex flex-col justify-between shadow-[0_30px_60px_rgba(255,107,44,0.15)] active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex justify-end">
            <i className="fa-solid fa-feather-pointed text-white/50 text-3xl"></i>
          </div>
          <div>
            <h4 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">Quick<br/>Note</h4>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">DRAFT NOW</p>
          </div>
        </div>
      </div>

      {/* 最近擷取列表 */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.3em]">RECENT CAPTURES</h2>
          <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-full hover:bg-blue-500/20 transition-all">VIEW ALL</button>
        </div>

        <div className="space-y-4">
          {recentCaptures.map(item => (
            <div 
              key={item.id} 
              className="bg-[#1C1C1E] p-6 rounded-[36px] border border-white/5 flex items-center justify-between group active:bg-white/5 transition-all"
            >
              <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-[15px] font-bold text-white tracking-tight">{item.title}</h4>
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-1 truncate max-w-[180px]">{item.excerpt}</p>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-xs text-gray-700 group-hover:text-white transition-colors"></i>
            </div>
          ))}
        </div>
      </section>

      {/* 底部功能按鈕 */}
      <div className="pt-6 pb-12">
        <button 
          onClick={() => handleAction('GENERAL')}
          className="w-full py-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[44px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_25px_50px_rgba(37,99,235,0.2)] flex items-center justify-center space-x-5 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fa-solid fa-plus text-sm"></i>
          </div>
          <span>START CAPTURE</span>
        </button>
      </div>

      {/* 擷取後分發選單 Modal */}
      {showSaveOptions && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowSaveOptions(null)} />
          <div className="relative w-full max-w-lg bg-[#1C1C1E] rounded-[44px] p-10 flex flex-col space-y-8 animate-in slide-in-from-bottom duration-500 shadow-3xl border border-white/10">
            <div className="text-center">
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">擷取成功</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">請選擇儲存目的地</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button className="w-full p-6 bg-white/5 hover:bg-white/10 rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] text-white border border-white/5 transition-all flex items-center space-x-4">
                <i className="fa-solid fa-box-archive text-blue-400 text-lg"></i>
                <span>存入靈感筆記本</span>
              </button>
              
              <div className="relative py-2 flex items-center">
                <div className="flex-grow h-px bg-white/5"></div>
                <span className="mx-4 text-[9px] font-black text-gray-700 uppercase tracking-widest">或 插入專案</span>
                <div className="flex-grow h-px bg-white/5"></div>
              </div>
              
              <div className="max-h-56 overflow-y-auto no-scrollbar space-y-3">
                {projects.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => {
                      onSaveToProject(p.id, showSaveOptions);
                      setShowSaveOptions(null);
                    }}
                    className="w-full p-5 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: p.color }}>
                        <i className={`fa-solid ${p.icon} text-black text-sm`}></i>
                      </div>
                      <span className="text-sm font-bold text-white">{p.name}</span>
                    </div>
                    <i className="fa-solid fa-plus-circle text-gray-700 group-hover:text-blue-500"></i>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowSaveOptions(null)} className="w-full py-4 text-[11px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">暫不儲存</button>
          </div>
        </div>
      )}

      {/* 處理中遮罩 */}
      {isProcessing && (
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-24 h-24 mb-10">
            <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter animate-pulse">精準救贖創作思緒...</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3">ALGORITHMIC REDEMPTION ACTIVE</p>
        </div>
      )}
    </div>
  );
};

export default CaptureCenter;
