
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
      name: 'Safe Drafting',
      price: '$0',
      period: 'Forever',
      description: 'Your work is always safe. Start capturing your first ideas.',
      features: ['10 Local Projects', 'Basic AI Assistance', 'Offline Protection', 'Standard Export (TXT/MD)'],
      color: 'bg-white/5',
      accent: 'text-gray-400'
    },
    {
      id: MembershipLevel.PRO,
      name: 'Serious Writing',
      price: '$4.99',
      period: 'Monthly',
      popular: true,
      description: 'Your work is protected over time. Advanced tools for deep narrative.',
      features: ['Unlimited Cloud Projects', 'Gemini Pro Analysis', '1-Min Auto Snapshot', 'Version History Backups', 'Google Drive Sync'],
      color: 'bg-blue-600/10',
      accent: 'text-blue-500'
    },
    {
      id: MembershipLevel.PREMIUM,
      name: 'Professional Delivery',
      price: '$12.99',
      period: 'Monthly',
      description: 'Your work is delivered professionally to the world.',
      features: ['Global One-Click Publishing', 'Industry-Standard Submission', 'Multi-user Collaboration', 'Visual Outline Mapping', 'Priority Publisher Access'],
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
            <h2 className="text-xl font-black text-white tracking-tight">Complete Your Journey</h2>
            <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-[0.2em] mt-0.5">FROM MANUSCRIPT TO THE WORLD</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6">
             <h3 className="text-4xl font-black text-white tracking-tighter">We don’t just help you write. We deliver your work.</h3>
             <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xl mx-auto">
               Most writing apps stop at files. SafeWrite completes the journey — from drafting to official global publishing channels.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-8 rounded-[44px] border transition-all flex flex-col h-full ${plan.popular ? 'bg-gradient-to-br from-blue-900/20 to-black border-blue-500 shadow-[0_30px_60px_rgba(37,99,235,0.15)]' : 'bg-[#1C1C1E] border-white/5'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                    Best Value
                  </span>
                )}

                <div className="mb-8">
                   <h4 className={`text-sm font-black uppercase tracking-widest ${plan.accent}`}>{plan.name}</h4>
                   <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="ml-2 text-[10px] font-bold text-gray-600 uppercase">/ {plan.period}</span>
                   </div>
                   <p className="mt-4 text-xs text-gray-400 leading-relaxed min-h-[40px]">{plan.description}</p>
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
                  {currentMembership === plan.id ? 'Current Active' : plan.id === MembershipLevel.PREMIUM ? 'Unlock Publishing' : 'Upgrade Plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#1C1C1E] p-10 rounded-[44px] border border-white/5 flex flex-col items-center text-center space-y-6">
             <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#1C1C1E] overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="avatar" />
                  </div>
                ))}
             </div>
             <div>
                <p className="text-white font-bold text-sm">"SafeWrite is the bridge I needed to reach my audience professionally."</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-2">— Sarah J., Published Author</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlans;
