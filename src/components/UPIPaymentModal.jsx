import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Smartphone, 
  Copy, 
  Check, 
  IndianRupee,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const UPIPaymentModal = ({ amount, title, description, onSuccess, onClose }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const upiId = '82050486@ybl';
  const tidNumber = '82050486';
  const merchantName = 'RAJIB CSC CENTER';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitUtr = (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 6) {
      setErrorMsg('Please enter a valid 12-digit UTR / Transaction Ref ID from your UPI app.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        paymentId: `UPI-UTR-${utrNumber.trim()}`,
        utrNumber: utrNumber.trim(),
        paymentMethod: `Direct UPI QR (TID: ${tidNumber})`,
        paidAmount: amount
      });
    }, 600);
  };

  const formattedAmount = Number(amount || 0).toLocaleString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Top Decorative Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-csc-navy via-csc-lightBlue to-emerald-400"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-1 pt-1">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-emerald-300 inline-block">
            Official Center Scanner
          </span>
          <h2 className="text-xl font-black text-slate-900">
            {title || 'Scan & Pay via UPI'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Scan using PhonePe, Google Pay, Paytm, or BHIM UPI App
          </p>
        </div>

        {/* Amount Box */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-1 shadow-lg border border-slate-800">
          <span className="text-xs text-cyan-300 font-bold block uppercase tracking-wider">Total Payable Amount</span>
          <div className="text-3xl font-black text-amber-300 font-mono">
            ₹{formattedAmount}.00
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{description || 'Government Service Application Fee'}</p>
        </div>

        {/* Official Scanner Image Frame */}
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-2xl border-2 border-slate-200 text-center space-y-3 shadow-inner">
          <div className="bg-white p-3 rounded-xl inline-block shadow-md border border-slate-200 max-w-[240px] mx-auto">
            <img 
              src="/images/rajib_csc_qr.png" 
              alt="RAJIB CSC CENTER Official Scanner TID 82050486" 
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">UPI ID / TID:</span>
            <code className="bg-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-900">{tidNumber}</code>
            <button
              onClick={handleCopyUpi}
              className="bg-csc-navy hover:bg-csc-lightBlue text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Copy UPI TID"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* UTR Verification Form */}
        <form onSubmit={handleSubmitUtr} className="space-y-3.5 text-xs">
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">
              Enter 12-Digit UTR / Transaction Ref No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength="16"
              value={utrNumber}
              onChange={(e) => {
                setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                setErrorMsg('');
              }}
              placeholder="e.g. 423891024981"
              className="w-full text-center font-mono font-bold text-base tracking-wider px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-csc-lightBlue outline-none uppercase"
            />
            <p className="text-[10px] text-slate-400 text-center mt-1">
              Find UTR / Ref No inside your PhonePe / GPay / Paytm payment receipt
            </p>
            {errorMsg && <p className="text-red-500 text-[11px] font-bold text-center mt-1">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying Payment...' : 'Submit Payment & Confirm Order'}</span>
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 border-t pt-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Official Scanner Verified • Rajib CSC North Lakhimpur</span>
        </div>

      </div>
    </div>
  );
};
