import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Building, 
  Wallet, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentModal = ({ amount, title, onSuccess, onClose }) => {
  const { t } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking, wallet
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess({ method: paymentMethod });
      }, 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-csc-navy p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-csc-lightBlue flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-sm">Secure CSC Payment Gateway</h3>
              <p className="text-[11px] text-cyan-200">{title || 'Service Fee Payment'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Payment Successful!</h4>
            <p className="text-xs text-slate-500">
              Amount ₹{amount} received. Generating your official acknowledgment receipt...
            </p>
          </div>
        ) : isProcessing ? (
          /* Processing State Screen */
          <div className="p-10 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-csc-lightBlue animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">Processing Payment...</h4>
            <p className="text-xs text-slate-500">
              Communicating securely with Banking Gateway. Please do not close or refresh.
            </p>
          </div>
        ) : (
          /* Payment Form Screen */
          <div className="p-5 space-y-5">
            
            {/* Amount Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Total Payable Amount:</span>
              <span className="text-2xl font-black text-csc-navy font-mono">₹{amount}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-semibold ${
                  paymentMethod === 'upi'
                    ? 'border-csc-lightBlue bg-blue-50/80 text-csc-navy shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-semibold ${
                  paymentMethod === 'card'
                    ? 'border-csc-lightBlue bg-blue-50/80 text-csc-navy shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-semibold ${
                  paymentMethod === 'netbanking'
                    ? 'border-csc-lightBlue bg-blue-50/80 text-csc-navy shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5 text-emerald-600" />
                <span>NetBank</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-semibold ${
                  paymentMethod === 'wallet'
                    ? 'border-csc-lightBlue bg-blue-50/80 text-csc-navy shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Wallet className="w-5 h-5 text-amber-600" />
                <span>Wallet</span>
              </button>
            </div>

            {/* Method Details Box */}
            <form onSubmit={handlePay} className="space-y-4 pt-1">
              {paymentMethod === 'upi' && (
                <div className="text-center space-y-3 bg-purple-50/60 p-4 rounded-xl border border-purple-100">
                  <p className="text-xs font-semibold text-slate-700">
                    Scan UPI QR Code using PhonePe, GPay, Paytm, or BHIM
                  </p>
                  
                  {/* Generated QR Code Frame */}
                  <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto border-2 border-dashed border-purple-300 shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white p-2">
                      <QrCode className="w-16 h-16 text-cyan-300" />
                      <span className="text-[9px] font-mono mt-1 text-purple-200">rajibcsc@upi</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono">
                    Merchant: Rajib CSC North Lakhimpur
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8912"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-csc-lightBlue outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-csc-lightBlue outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">CVV Code</label>
                      <input
                        type="password"
                        maxLength="3"
                        placeholder="•••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-csc-lightBlue outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Select Bank</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-csc-lightBlue outline-none bg-white">
                    <option>State Bank of India (SBI)</option>
                    <option>Assam Gramin Vikash Bank (AGVB)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Punjab National Bank (PNB)</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>CSC Digital Sewa Wallet Balance:</span>
                    <span>₹24,850.00</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Direct instant debit from Rajib CSC Operator Wallet.
                  </p>
                </div>
              )}

              {/* Security Shield & Pay Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{amount} & Complete</span>
                </button>
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit SSL Encrypted Payment Portal</span>
                </div>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
