import React from 'react';
import { AlertTriangle, MapPin, MessageSquare, ShieldAlert, X, CreditCard, ArrowRight } from 'lucide-react';

export const InsufficientBalanceModal = ({ isOpen, onClose, requiredAmount, availableBalance }) => {
  if (!isOpen) return null;

  const shortfall = Math.max(0, Number(requiredAmount || 0) - Number(availableBalance || 0));

  const whatsappTopupUrl = `https://wa.me/919435012345?text=${encodeURIComponent(
    `Hello Rajib CSC, I need to top-up my Digital Wallet. Shortfall amount: ₹${shortfall}. Please provide UPI details / credit balance.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-red-200 space-y-6 relative overflow-hidden">
        
        {/* Top Warning Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <AlertTriangle className="w-9 h-9" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block mb-1">
              Transaction Blocked • Insufficient Funds
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Insufficient Wallet Balance
            </h2>
            <p className="text-xs text-slate-500">
              Your Rajib CSC Digital Wallet balance is too low for this transaction.
            </p>
          </div>
        </div>

        {/* Balance Breakdown Grid */}
        <div className="bg-red-50/60 border border-red-200 rounded-2xl p-4 text-xs space-y-2.5">
          <div className="flex justify-between items-center border-b border-red-200/80 pb-2">
            <span className="text-slate-600 font-semibold">Required Payment Amount:</span>
            <span className="font-mono font-black text-slate-900 text-base">₹{requiredAmount}.00</span>
          </div>

          <div className="flex justify-between items-center border-b border-red-200/80 pb-2">
            <span className="text-slate-600 font-semibold">Your Current Wallet Balance:</span>
            <span className="font-mono font-extrabold text-red-600 text-base">₹{availableBalance}.00</span>
          </div>

          <div className="flex justify-between items-center text-red-900 pt-0.5">
            <span className="font-black uppercase text-[11px] tracking-wider">Required Top-Up Shortfall:</span>
            <span className="font-mono font-black text-red-700 text-lg bg-red-100 px-3 py-1 rounded-xl border border-red-300">
              ₹{shortfall}.00
            </span>
          </div>
        </div>

        {/* Top-up Options */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-csc-navy" />
            <span>Select Wallet Top-Up Option</span>
          </h4>

          {/* Option 1: WhatsApp UPI Top-up */}
          <a
            href={whatsappTopupUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-lg transition-all text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-extrabold">Instant UPI Top-Up via WhatsApp</span>
                <span className="text-[11px] text-emerald-100 font-normal">Send UPI to +91 94350 12345 for instant credit</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Option 2: Visit physical center */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-csc-navy text-white flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-xs">Offline Cash Top-Up at Center</span>
              <span className="text-[11px] text-slate-500">Visit Rajib CSC Center, Ward 8 near District Library, North Lakhimpur.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
        >
          Close & Return
        </button>

      </div>
    </div>
  );
};
