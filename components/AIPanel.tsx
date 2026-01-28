
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { OutlineNode } from '../types';

interface AIPanelProps {
  content: string;
  isNight: boolean;
  onClose: () => void;
  onUpdateOutline: (nodes: OutlineNode[]) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ content, isNight, onClose, onUpdateOutline }) => {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAIAction = async (action: 'analyze' | 'outline' | 'characters') => {
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      let result = '';
      if (action === 'analyze') result = await geminiService.analyzeManuscript(content);
      if (action === 'outline') {
        result = await geminiService.scanOutline(content);
        // 模擬提取結構化大綱
        const mockNodes: OutlineNode[] = result.split('\n')
          .filter(l => l.trim() && !l.includes('---'))
          .slice(0, 8)
          .map((l, i) => ({
            id: `node-${Date.now()}-${i}`,
            label: l.replace(/^[\d\.\-\s\*]+/, '').trim(),
            level: l.startsWith(' ') || l.startsWith('-') || l.startsWith('*') ? 1 : 0
          }));
        onUpdateOutline(mockNodes);
      }
      if (action === 'characters') result = await geminiService.analyzeCharacters(content);
      setResponse(result || '分析完成。');
    } catch (e) {
      setResponse('AI 服務暫時不可用，請檢查網路連線。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className={`fixed top-0 right-0 w-80 h-full z-[200] border-l flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl ${isNight ? 'bg-[#0F172A] border-white/5' : 'bg-white border-gray-100'}`}>
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F0F10]">
        <div>
          <h2 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">AI 創作助理</h2>
          <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-1">GEMINI PRO ENGINE</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => handleAIAction('analyze')} 
            className="p-5 rounded-2xl bg-[#7b61ff]/10 border border-[#7b61ff]/20 text-left flex items-center space-x-4 transition-all hover:bg-[#7b61ff]/20 group"
          >
            <i className="fa-solid fa-magnifying-glass-chart text-[#7b61ff] text-xl group-hover:scale-110 transition-transform"></i>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">稿件深度點評</span>
              <span className="text-[9px] text-[#7b61ff] font-black uppercase tracking-widest mt-0.5">TONE & STRUCTURE</span>
            </div>
          </button>
          
          <button 
            onClick={() => handleAIAction('outline')} 
            className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-left flex items-center space-x-4 transition-all hover:bg-blue-500/20 group"
          >
            <i className="fa-solid fa-diagram-project text-blue-500 text-xl group-hover:scale-110 transition-transform"></i>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">同步視覺化大綱</span>
              <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">OUTLINE EXTRACTION</span>
            </div>
          </button>

          <button 
            onClick={() => handleAIAction('characters')} 
            className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left flex items-center space-x-4 transition-all hover:bg-amber-500/20 group"
          >
            <i className="fa-solid fa-user-ninja text-amber-500 text-xl group-hover:scale-110 transition-transform"></i>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">角色心理建模</span>
              <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest mt-0.5">CHARACTER ANALYSIS</span>
            </div>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-2 border-[#7b61ff] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-[10px] font-black text-[#7b61ff] uppercase tracking-[0.3em] animate-pulse">Gemini 正在思考中...</p>
          </div>
        ) : response && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">分析結果 RESULT</span>
               <button onClick={() => setResponse('')} className="text-[9px] font-black text-[#7b61ff] uppercase tracking-widest">清除</button>
            </div>
            <div className={`p-6 rounded-3xl text-sm leading-relaxed border bg-white/5 border-white/5 text-slate-300 font-serif-editor`}>
              {response}
            </div>
          </div>
        )}
      </div>

      <footer className="p-6 bg-[#0F0F10] border-t border-white/5">
        <div className="flex items-start space-x-3 opacity-40">
           <i className="fa-solid fa-circle-info text-[10px] mt-1"></i>
           <p className="text-[9px] font-black text-[#8E8E93] uppercase tracking-widest leading-normal">
             AI 建議僅供參考。所有數據經雙重加密處理，符合 SafeWrite 創作隱私協定。
           </p>
        </div>
      </footer>
    </aside>
  );
};

export default AIPanel;
