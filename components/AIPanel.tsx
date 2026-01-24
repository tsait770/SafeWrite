
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
        const mockNodes: OutlineNode[] = result.split('\n').filter(l => l.trim()).slice(0, 8).map((l, i) => ({
          id: `node-${i}`,
          label: l.replace(/^[\d\.\-\s]+/, '').trim(),
          level: l.startsWith(' ') || l.startsWith('-') ? 1 : 0
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
    <aside className={`w-80 border-l flex flex-col animate-in slide-in-from-right duration-300 ${isNight ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-gray-100'}`}>
      <div className="p-6 border-b border-gray-100/10 flex justify-between items-center">
        <h2 className={`text-[10px] font-bold uppercase tracking-widest ${isNight ? 'text-slate-500' : 'text-gray-400'}`}>Gemini 創作助手</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4z"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => handleAIAction('analyze')} className={`p-4 rounded-xl border text-left flex items-center space-x-4 transition-all hover:scale-[1.02] ${isNight ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208z"/></svg>
            <div className="flex flex-col"><span className="text-xs font-bold">稿件深度點評</span></div>
          </button>
          <button onClick={() => handleAIAction('outline')} className={`p-4 rounded-xl border text-left flex items-center space-x-4 transition-all hover:scale-[1.02] ${isNight ? 'bg-slate-800 border-slate-700' : 'bg-purple-50 border-purple-100 text-purple-700'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64z"/></svg>
            <div className="flex flex-col"><span className="text-xs font-bold">同步視覺化大綱</span></div>
          </button>
        </div>
        {isLoading ? (
          <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>
        ) : response && <div className={`p-4 rounded-xl text-xs leading-relaxed border ${isNight ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>{response}</div>}
      </div>
    </aside>
  );
};

export default AIPanel;
