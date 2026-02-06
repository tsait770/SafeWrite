
import React from 'react';
import { MembershipLevel } from '../types';

interface SubscriptionPlansProps {
  currentMembership: MembershipLevel;
  onSelectPlan: (plan: { id: MembershipLevel, name: string, price: string }) => void;
  onClose: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentMembership, onSelectPlan, onClose }) => {
  const plans = [
    {
      id: MembershipLevel.FREE,
      name: 'Free Basic',
      price: '$0',
      period: 'Forever',
      description: '適合個人靈感捕捉與基礎創作。',
      features: ['10 個本地專案', '基礎 AI 建議', '15 分鐘自動快照', '標準匯出 (TXT/MD)'],
      color: 'bg-white/5',
      accent: 'text-gray-400'
    },
    {
      id: MembershipLevel.PRO,
      name: 'SafeWrite Pro',
      price: '$4.99',
      period: 'Monthly',
      popular: true,
      description: '為專業作家打造的高級創作引擎。',
      features: ['無限雲端專案', 'Gemini Pro 深度分析', '1 分鐘級即時快照', '出版級匯出 (PDF/EPUB)', 'Google Drive 同步'],
      color: 'bg-blue-600/10',
      accent: 'text-blue-500'
    },
    {
      id: MembershipLevel.PREMIUM,
      name: 'Premium Team',
      price: '$12.99',
      period: 'Monthly',
      description: '適合團隊協作與商業出版規劃。',
      features: ['多人在線協作', '自定義 AI 模型接入', '視覺化大綱生成', '優先權限技術支援', '完整版本歷史追蹤'],
      color: 'bg-amber-500/10',
      accent: 'text-amber-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="h-24 px-8 pt-8 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">升級您的創作力</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-0.5">CHOOSE YOUR POWER PLAN</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <h3 className="text-4xl font-black text-white tracking-tighter">釋放思緒的極限</h3>
             <p className="text-gray-500 text-sm font-medium">加入 50,000+ 位作家，享受出版級的創作安全感。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-8 rounded-[44px] border transition-all flex flex-col h-full ${plan.popular ? 'bg-gradient-to-br from-blue-900/20 to-black border-blue-500 shadow-[0_30px_60px_rgba(37,99,235,0.15)]' : 'bg-[#1C1C1E] border-white/5'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                    Most Popular
                  </span>
                )}

                <div className="mb-8">
                   <h4 className={`text-sm font-black uppercase tracking-widest ${plan.accent}`}>{plan.name}</h4>
                   <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="ml-2 text-[10px] font-bold text-gray-600 uppercase">/ {plan.period}</span>
                   </div>
                   <p className="mt-4 text-xs text-gray-400 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                   {plan.features.map((f, i) => (
                     <div key={i} className="flex items-center space-x-3">
                        <i className={`fa-solid fa-circle-check text-xs ${plan.accent}`}></i>
                        <span className="text-[11px] font-medium text-gray-300">{f}</span>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => onSelectPlan({ id: plan.id, name: plan.name, price: plan.price })}
                  disabled={currentMembership === plan.id}
                  className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] transition-all active:scale-95 ${
                    currentMembership === plan.id 
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                    : plan.popular ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-black'
                  }`}
                >
                  {currentMembership === plan.id ? '當前方案' : '立即升級'}
                </button>
              </div>
            ))}
          </div>

          {/* Social Proof Section */}
          <div className="bg-[#1C1C1E] p-10 rounded-[44px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gray-800 border-2 border-[#1C1C1E] flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-[#1C1C1E] flex items-center justify-center text-[10px] font-black">+50k</div>
             </div>
             <div className="text-center md:text-left">
                <p className="text-white font-bold">"SafeWrite 完全改變了我的工作流。"</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">— Elena Fisher, 年度暢銷作家</p>
             </div>
             <div className="flex space-x-2 text-amber-500">
                {[1,2,3,4,5].map(i => <i key={i} className="fa-solid fa-star text-xs"></i>)}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlans;
