
import React, { useState } from 'react';

interface CheckoutModalProps {
  planName: string;
  price: string;
  onSuccess: () => void;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ planName, price, onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Container matching the Uiverse.io style from the screenshot */}
      <div className="relative w-full max-w-[450px] bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <form className="p-8 flex flex-col gap-6" onClick={(e) => e.stopPropagation()} onSubmit={handleCheckout}>
          
          <div className="flex justify-between items-center mb-2">
             <div>
               <h2 className="text-xl font-black text-[#121212] tracking-tight">結帳付款</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                 {planName} · {price}
               </p>
             </div>
             <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
               <i className="fa-solid fa-xmark"></i>
             </button>
          </div>

          {/* Payment Options Row */}
          <div className="grid grid-cols-3 gap-4">
            <button type="button" className="h-[55px] bg-[#F2F2F2] rounded-xl flex items-center justify-center border-0 outline-none active:scale-95 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            </button>
            <button type="button" className="h-[55px] bg-[#F2F2F2] rounded-xl flex items-center justify-center border-0 outline-none active:scale-95 transition-all">
               <i className="fa-brands fa-apple text-xl"></i><span className="ml-1 font-bold">Pay</span>
            </button>
            <button type="button" className="h-[55px] bg-[#F2F2F2] rounded-xl flex items-center justify-center border-0 outline-none active:scale-95 transition-all">
               <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="GPay" className="h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#8B8E98] my-2">
            <hr className="flex-1 border-gray-200" />
            <p className="text-[11px] font-bold">or pay using credit card</p>
            <hr className="flex-1 border-gray-200" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8B8E98] font-bold uppercase tracking-wider">Card holder full name</label>
              <input 
                required
                className="h-10 px-4 rounded-xl bg-[#F2F2F2] border border-transparent focus:border-black outline-none transition-all text-sm font-medium text-[#121212]" 
                type="text" 
                placeholder="Enter your full name" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-[#8B8E98] font-bold uppercase tracking-wider">Card Number</label>
              <div className="relative">
                <input 
                  required
                  className="w-full h-10 px-4 rounded-xl bg-[#F2F2F2] border border-transparent focus:border-black outline-none transition-all text-sm font-medium text-[#121212] tracking-widest" 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                />
                <i className="fa-solid fa-credit-card absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#8B8E98] font-bold uppercase tracking-wider">Expiry Date</label>
                <input 
                  required
                  className="h-10 px-4 rounded-xl bg-[#F2F2F2] border border-transparent focus:border-black outline-none transition-all text-sm font-medium text-[#121212]" 
                  type="text" 
                  placeholder="01/23" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#8B8E98] font-bold uppercase tracking-wider">CVV</label>
                <input 
                  required
                  className="h-10 px-4 rounded-xl bg-[#F2F2F2] border border-transparent focus:border-black outline-none transition-all text-sm font-medium text-[#121212]" 
                  type="password" 
                  maxLength={3}
                  placeholder="CVV" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className="h-[55px] mt-2 rounded-xl text-white text-sm font-bold uppercase tracking-[0.2em] bg-gradient-to-b from-[#363636] via-[#1B1B1B] to-[#000000] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Checkout</span>
            )}
          </button>
          
          <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-widest">
            <i className="fa-solid fa-lock mr-2"></i>
            SECURE SSL ENCRYPTED PAYMENT
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
