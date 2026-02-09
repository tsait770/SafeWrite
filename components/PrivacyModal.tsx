
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
    <div className={`border-b border-white/5 transition-all ${isOpen ? 'bg-white/[0.02]' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-2 flex items-center justify-between group"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}>
            <i className={`fa-solid ${icon}`}></i>
          </div>
          <span className={`text-sm font-black uppercase tracking-[0.15em] transition-colors ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
            {title}
          </span>
        </div>
        <i className={`fa-solid fa-chevron-down text-[10px] text-slate-600 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}></i>
      </button>
      
      <div className={`overflow-hidden transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${isOpen ? 'max-h-[2000px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
        <div className="px-14 text-sm text-slate-400 leading-relaxed font-medium space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'CENTER' | 'TERMS'>('CENTER');

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center animate-in fade-in duration-300 px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0F0F10] border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] shadow-3xl overflow-hidden flex flex-col h-[92vh] sm:h-[85vh]">
        
        {/* Sticky Header */}
        <header className="px-8 pt-8 pb-6 border-b border-white/5 bg-[#0F0F10] shrink-0 z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">隱私與法律中心</h2>
              <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] mt-1">PRIVACY & LEGAL PROTOCOL v1.1</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('CENTER')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CENTER' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              隱私權管理
            </button>
            <button 
              onClick={() => setActiveTab('TERMS')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TERMS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              服務條款
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-4">
          {activeTab === 'CENTER' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Trust Summary Card */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/5 rounded-[2.5rem] p-8 border border-blue-600/20 mb-8">
                <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">承諾承諾 TRUST MANIFESTO</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: 'fa-user-shield', title: '100% 著作權歸屬', desc: '作者保留作品完整版權，SafeWrite 不主張任何內容權利。' },
                    { icon: 'fa-database', title: '本地存儲優先', desc: '所有稿件默認加密存於設備本地，未經授權不主動同步。' },
                    { icon: 'fa-robot', title: 'AI 隱私防護', desc: '內容僅在請求時傳送至 AI，不被用於公開模型訓練。' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                        <i className={`fa-solid ${item.icon} text-xs`}></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modular Legal Sections */}
              <div className="space-y-1">
                <LegalSection title="資料收集與用途" icon="fa-database" defaultOpen={true}>
                  <p>我們僅收集維持服務運作所需的最小限度資料：</p>
                  <ul className="list-disc pl-5 space-y-2 text-[13px]">
                    <li><strong className="text-white">帳戶資料：</strong>電子郵件與會員等級，用於跨裝置同步與訂閱核驗。</li>
                    <li><strong className="text-white">內容資料：</strong>草稿與章節內容。若開啟雲端同步，資料將經 AES-256 加密後傳輸。</li>
                    <li><strong className="text-white">使用行為：</strong>匿名化的功能操作頻率，旨在優化 UI/UX。</li>
                  </ul>
                </LegalSection>

                <LegalSection title="AI 與模型安全說明" icon="fa-bolt-lightning">
                  <p>當您使用 Gemini AI 助理（點評、潤色、分析）時：</p>
                  <ul className="list-disc pl-5 space-y-2 text-[13px]">
                    <li>系統僅會傳送您<strong className="text-white">當前選取或正在編輯</strong>的片段。</li>
                    <li>我們使用 Google API 的 Enterprise 級別處理，根據協議，您的內容<strong className="text-white">不會</strong>被用於訓練 Google 的公開模型。</li>
                    <li>AI 分析結果為即時生成，SafeWrite 伺服器不會永久存儲您的 AI 交互對話歷史。</li>
                  </ul>
                </LegalSection>

                <LegalSection title="出版與內容權利 (KDP 合規)" icon="fa-book-open">
                  <p>SafeWrite 是為專業出版設計的工具：</p>
                  <ul className="list-disc pl-5 space-y-2 text-[13px]">
                    <li><strong className="text-white">著作權：</strong>您在 SafeWrite 創作的所有內容，其知識產權 100% 屬於您。</li>
                    <li><strong className="text-white">商業出版：</strong>匯出的 PDF/EPUB 格式符合 Amazon KDP 與全球各大出版社的標準規範。</li>
                    <li><strong className="text-white">第三方分發：</strong>當您使用「一鍵投遞」功能時，我們僅充當加密傳輸媒介，不對內容進行審查或抽成。</li>
                  </ul>
                </LegalSection>

                <LegalSection title="第三方服務披露" icon="fa-link">
                  <p>為了提供完整功能，我們整合了以下受信任的服務：</p>
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-black text-white mb-2">Google Drive API</p>
                      <p className="text-[11px] leading-relaxed">僅在您手動開啟備份時，請求寫入與讀取 SafeWrite 指定資料夾的權限。</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-black text-white mb-2">Firebase / Supabase</p>
                      <p className="text-[11px] leading-relaxed">用於處理實時協作數據流與帳戶認證系統，數據採用業界標準 SSL 加密。</p>
                    </div>
                  </div>
                </LegalSection>

                <LegalSection title="第三方 UI 元件授權標註" icon="fa-certificate">
                  <p>本應用程式使用了來自 Uiverse.io 的開源 UI 元件，根據 MIT 授權條款要求列出以下資訊：</p>
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-black text-white mb-1">A. Angry Shrimp 34 (結帳/表單 UI)</p>
                      <ul className="text-[10px] space-y-0.5 text-slate-500">
                        <li>作者：zanina-yassine (Yassine Zanina)</li>
                        <li>來源：Uiverse.io | 授權：MIT License</li>
                        <li className="text-slate-400 font-mono italic">Copyright (c) 2026 zanina-yassine (Yassine Zanina)</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-black text-white mb-1">B. Black Lizard 62 (卡片/支付 UI)</p>
                      <ul className="text-[10px] space-y-0.5 text-slate-500">
                        <li>作者：Praashoo7 (Prashant)</li>
                        <li>來源：Uiverse.io | 授權：MIT License</li>
                        <li className="text-slate-400 font-mono italic">Copyright (c) 2026 Praashoo7 (Prashant)</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-xs font-black text-white mb-1">C. Neat Starfish 50 (天氣/資訊卡片 UI)</p>
                      <ul className="text-[10px] space-y-0.5 text-slate-500">
                        <li>作者：zanina-yassine (Yassine Zanina)</li>
                        <li>來源：Uiverse.io | 授權：MIT License</li>
                        <li className="text-slate-400 font-mono italic">Copyright (c) 2026 zanina-yassine (Yassine Zanina)</li>
                      </ul>
                    </div>
                    <p className="text-[10px] italic text-slate-500 mt-2">根據 MIT 授權條款，本應用程式副本已包含上述版權聲明與許可聲明。</p>
                  </div>
                </LegalSection>

                <LegalSection title="使用者權利與資料控制" icon="fa-user-gear">
                  <p>您對自己的資料擁有絕對控制權：</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600/10 transition-all">
                      下載所有資料 JSON
                    </button>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
                      永久刪除帳戶
                    </button>
                  </div>
                  <p className="mt-4 text-[11px]">符合歐盟 GDPR 與加州 CCPA 規範，我們支持「被遺忘權」。</p>
                </LegalSection>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-8 pb-20">
                <section>
                  <h3 className="text-white font-black text-lg">1. 接受條款</h3>
                  <p className="text-slate-400 leading-relaxed mt-2">
                    歡迎使用 SafeWrite。透過訪問或使用本應用程式，即表示您同意受本服務條款的約束。如果您不同意這些條款，請勿使用本服務。
                  </p>
                </section>
                <section>
                  <h3 className="text-white font-black text-lg">2. 服務說明</h3>
                  <p className="text-slate-400 leading-relaxed mt-2">
                    SafeWrite 提供寫作管理、AI 協作與數位出版工具。我們致力於提供穩定、安全的環境，但不保證服務永遠不會中斷或完全沒有錯誤。
                  </p>
                </section>
                <section>
                  <h3 className="text-white font-black text-lg">3. 訂閱與退款</h3>
                  <p className="text-slate-400 leading-relaxed mt-2">
                    Pro 與 Premium 訂閱費用按月或按年收取。您可以隨時取消續訂。因數位產品特性，除法律規定外，已生效的訂閱期恕不退款。
                  </p>
                </section>
                <section>
                  <h3 className="text-white font-black text-lg">4. 禁止行為</h3>
                  <p className="text-slate-400 leading-relaxed mt-2">
                    禁止使用本服務儲存、生成或傳播非法、淫穢、威脅性或侵犯他人版權的內容。我們保留終止違規帳戶的權利。
                  </p>
                </section>
                <div className="pt-10 border-t border-white/5">
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest">最後更新日期：2026年1月20日</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Overlay */}
        <footer className="p-8 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10] to-transparent shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] shadow-2xl active:scale-95 transition-all"
          >
            我 已 閱讀 並 理解
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyModal;
