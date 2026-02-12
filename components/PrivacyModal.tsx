
import React, { useState } from 'react';

interface PrivacyModalProps {
  onClose: () => void;
}

interface LegalSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const LegalSection: React.FC<LegalSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-white/5 transition-all duration-500 ${isOpen ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-4 sm:px-6 flex items-center justify-between group transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-110' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'}`}>
            <i className={`fa-solid ${icon} text-sm`}></i>
          </div>
          <div className="text-left">
            <span className={`text-[13px] font-black uppercase tracking-[0.12em] block transition-colors ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
              {title}
            </span>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600/20 text-blue-500 rotate-180' : 'text-slate-700'}`}>
          <i className="fa-solid fa-chevron-down text-[10px]"></i>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-14 sm:px-20 pb-10 text-[13px] sm:text-[14px] text-slate-400 leading-relaxed font-medium space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'CENTER' | 'TERMS'>('CENTER');

  return (
    <div className="fixed inset-0 z-[5000] flex items-end sm:items-center justify-center animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-[680px] bg-[#0A0A0B] border-t sm:border border-white/10 rounded-t-[3.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[94vh] sm:h-[85vh] animate-in slide-in-from-bottom duration-700 cubic-bezier(0.16, 1, 0.3, 1)">
        
        <header className="px-8 sm:px-12 pt-10 pb-8 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl shrink-0 z-20">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1.5">
              <h2 className="text-3xl font-black text-white tracking-tighter">隱私與法律中心</h2>
              <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                 <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.35em]">ENCRYPTED PROTOCOL v1.1</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/5 relative">
            <button 
              onClick={() => setActiveTab('CENTER')}
              className={`flex-1 py-3.5 rounded-[1.6rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 z-10 ${activeTab === 'CENTER' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              隱私權管理
            </button>
            <button 
              onClick={() => setActiveTab('TERMS')}
              className={`flex-1 py-3.5 rounded-[1.6rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 z-10 ${activeTab === 'TERMS' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              服務條款
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-[1.6rem] shadow-lg shadow-blue-900/40 transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${activeTab === 'TERMS' ? 'translate-x-full' : 'translate-x-0'}`}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-12 py-8 bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0F] to-[#0A0A0B]">
          {activeTab === 'CENTER' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/5 rounded-[3rem] p-8 sm:p-10 border border-blue-600/20 mb-10 shadow-inner">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-[12px] font-black text-blue-400 uppercase tracking-[0.25em]">TRUST MANIFESTO</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  {[
                    { icon: 'fa-user-shield', title: '尊崇原創著作權', desc: '我們深知每段文字皆是靈魂的結晶，SafeWrite 僅提供工具支援，絕對尊重並保護作者對作品的 100% 完整權利。' },
                    { icon: 'fa-database', title: '本地守護優先', desc: '隱私是創作的基石。您的初稿預設存儲於本地加密空間，未經您的明確授權，數據絕不主動離網，守護每一絲創作火花。' },
                    { icon: 'fa-robot', title: '透明 AI 倫理', desc: 'AI 是您的協作夥伴，而非掠奪者。內容僅在您主動請求時進行瞬時分析，並嚴格遵循不進入公開訓練模型的承諾。' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <i className={`fa-solid ${item.icon} text-lg`}></i>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[15px] font-black text-white tracking-tight">{item.title}</h4>
                        <p className="text-[13px] text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[3rem] border border-white/5 overflow-hidden bg-white/[0.01]">
                <LegalSection title="資料收集與誠信用途" icon="fa-database" defaultOpen={true}>
                  <p>為提供更流暢的跨裝置體驗，我們僅以最嚴謹的態度收集極少數必要資料：</p>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                      <span className="text-slate-300 font-medium"><strong className="text-white block mb-0.5">身分驗證：</strong>電子郵件僅用於確保您的專案同步與訂閱狀態能跨端傳遞，我們視如己出，絕不外洩。</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                      <span className="text-slate-300 font-medium"><strong className="text-white block mb-0.5">內容同步：</strong>若您選擇開啟雲端同步，資料將透過 AES-256 軍事級加密進行傳輸，確保在雲端與本地間絕對安全。</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                      <span className="text-slate-300 font-medium"><strong className="text-white block mb-0.5">體驗優化：</strong>匿名化的互動數據能協助我們找出 UI 瓶頸，讓創作系統不斷演進以契合您的手感。</span>
                    </li>
                  </ul>
                </LegalSection>

                <LegalSection title="AI 協作與模型安全性" icon="fa-bolt-lightning">
                  <p className="text-slate-300 mb-4">當您與 Gemini AI 共同創作時，SafeWrite 嚴格執行以下保護協議，確保您的靈感不被稀釋：</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                       <p className="text-xs font-black text-blue-400 uppercase tracking-widest">TRANSIENT PROTECTION</p>
                       <p className="text-[13px] leading-relaxed">您的文字僅在處理當下暫時存在於運算節點，分析結束後立即銷毀，系統不保留任何對話歷史紀錄。</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                       <p className="text-xs font-black text-purple-400 uppercase tracking-widest">ENTERPRISE ISOLATION</p>
                       <p className="text-[13px] leading-relaxed">我們採用 Google API 企業級隔離架構，根據合規協議，您的創作內容絕不會被用於 Google 任何公開模型的訓練。您的文字，始終只為您服務。</p>
                    </div>
                  </div>
                </LegalSection>

                <LegalSection title="專業出版與權利保護" icon="fa-book-open">
                  <p>SafeWrite 的使命是協助您走向世界舞台，我們致力於建立透明、互信的出版環境：</p>
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-sm font-bold text-white">智慧財產權完全保留予作者</span>
                      <i className="fa-solid fa-circle-check text-green-500"></i>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-sm font-bold text-white">符合全球主流出版平台規格</span>
                      <i className="fa-solid fa-circle-check text-green-500"></i>
                    </div>
                    <p className="text-[12px] italic text-slate-500 px-2 leading-relaxed">
                      SafeWrite 僅作為技術傳輸與出版配置的媒介，我們不會對您的文稿進行任何商業抽成，更不會干涉您的創作自由。
                    </p>
                  </div>
                </LegalSection>

                <LegalSection title="第三方 UI 與技術授權" icon="fa-certificate">
                  <p className="mb-4">本應用程式之卓越體驗，部分歸功於以下高品質開源社群之貢獻，特此致謝：</p>
                  <div className="space-y-3">
                    {[
                      { author: 'zanina-yassine', component: 'Angry Shrimp 34 / Neat Starfish 50', type: 'Forms & Cards' },
                      { author: 'Praashoo7', component: 'Black Lizard 62', type: 'Payment UI' },
                      { author: 'G4BR13L-V', component: 'Cool Fox 12', type: 'Layout Components' }
                    ].map((lib, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-white uppercase tracking-widest">{lib.component}</p>
                          <p className="text-[10px] text-slate-500">Provided by {lib.author} (MIT License)</p>
                        </div>
                        <span className="text-[9px] font-black bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full uppercase tracking-widest">Library</span>
                      </div>
                    ))}
                  </div>
                </LegalSection>

                <LegalSection title="您的資料掌控權" icon="fa-user-gear">
                  <p className="mb-6">我們始終相信，工具不應束縛創作者。您隨時擁有對資料的最終處置權：</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all flex flex-col items-center space-y-3 group">
                      <i className="fa-solid fa-download text-lg group-hover:scale-110 transition-transform"></i>
                      <span>下載資料母檔</span>
                    </button>
                    <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex flex-col items-center space-y-3 group">
                      <i className="fa-solid fa-user-xmark text-lg group-hover:scale-110 transition-transform"></i>
                      <span>永久移除帳戶</span>
                    </button>
                  </div>
                </LegalSection>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-6 duration-700">
              <div className="space-y-12 pb-24">
                <section className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h3 className="text-white font-black text-xl tracking-tight">1. 接受條款</h3>
                  </div>
                  <p className="text-slate-400 text-[15px] leading-[1.8] font-medium pl-4">
                    歡迎您選擇 SafeWrite 作為創作夥伴。當您訪問或使用本應用程式，即表示您信任並同意受本服務條款之規範。我們深知文字的力量與創作者的艱辛，承諾將竭盡所能維護您的權利，並提供穩定、高品質的技術支援，助您的作品走向國際。
                  </p>
                </section>
                <section className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h3 className="text-white font-black text-xl tracking-tight">2. 服務承諾與說明</h3>
                  </div>
                  <p className="text-slate-400 text-[15px] leading-[1.8] font-medium pl-4">
                    SafeWrite 整合寫作管理、AI 深度協作與全球分發工具。我們致力於打造穩定且安全的寫作環境。儘管軟體開發充滿挑戰，我們無法保證絕對零故障，但我們承諾在任何系統變動或更新前，皆會以謙遜透明的態度向用戶公告，確保您的創作流程不被輕易中斷。
                  </p>
                </section>
                <section className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h3 className="text-white font-black text-xl tracking-tight">3. 訂閱方案與誠信退款</h3>
                  </div>
                  <p className="text-slate-400 text-[15px] leading-[1.8] font-medium pl-4">
                    Pro 與 Premium 訂閱為您提供更深度的寫作能量。您可以靈活選擇按月或按年扣費，並隨時取消續訂。考量數位產品之特性，除法律規定外，生效期內恕不退款；然而，若因系統重大故障導致您的核心數據受損，我們將秉持誠懇態度，主動提供按比例的補償或補貼措施。
                  </p>
                </section>
                <section className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <h3 className="text-white font-black text-xl tracking-tight">4. 創作準則與守護機制</h3>
                  </div>
                  <p className="text-slate-400 text-[15px] leading-[1.8] font-medium pl-4">
                    為維護純粹的寫作社群環境，禁止使用本服務生成、儲存或傳播涉及非法、猥褻、仇恨或侵犯他人版權之內容。SafeWrite 堅守內容中立原則，但對任何破壞和諧、違背基本法律道德的行為持零容忍態度，並保留暫停違規帳戶以維護整體平台安全的權利。
                  </p>
                </section>
                
                <div className="pt-16 border-t border-white/5 flex items-center justify-between">
                   <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-black">LAST UPDATED: JAN 20, 2026</p>
                   <p className="text-[10px] text-slate-800 font-black uppercase tracking-widest">LEGAL ID: SW-2026-01</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-8 sm:p-12 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B] to-transparent shrink-0 z-20">
          <button 
            onClick={onClose}
            className="w-full h-[88px] bg-white text-black font-black text-sm uppercase tracking-[0.5em] rounded-[3rem] shadow-[0_25px_60px_rgba(255,255,255,0.2)] active:scale-[0.97] transition-all hover:scale-[1.01] duration-500"
          >
            我 已 閱 讀 並 理 解
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyModal;
