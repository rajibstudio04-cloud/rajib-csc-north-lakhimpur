import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Building, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Smartphone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PhonePePaymentModal = ({ amount, title, description, onSuccess, onClose }) => {
  const { showToast } = useApp();
  const [method, setMethod] = useState('phonepe_qr'); // phonepe_qr, phonepe_upi, card, netbanking
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [upiId, setUpiId] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const txnPayload = {
      paymentMethod: method === 'phonepe_qr' ? 'PhonePe UPI QR' : method === 'phonepe_upi' ? 'PhonePe VPA Intent' : method === 'card' ? 'PhonePe Cards Gateway' : 'PhonePe NetBanking',
      paymentId: `PAY-PPE-${randomSuffix}`,
      utrNumber: `UTRPP${Date.now().toString().slice(-8)}`,
      amountPaid: amount,
      merchantId: 'RAJIB_CSC_LKP_PG',
      status: 'PAYMENT_SUCCESS'
    };

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess(txnPayload);
      }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* PhonePe Header */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-purple-700 flex items-center justify-center font-black text-xl shadow">
              Pe
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">PhonePe Payment Gateway</h3>
                <span className="bg-purple-900/60 text-purple-200 border border-purple-400/40 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded">
                  LIVE PG
                </span>
              </div>
              <p className="text-[11px] text-purple-200 font-medium">{title || 'Rajib CSC Digital Sewa Kendra'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-purple-200 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">PhonePe Payment Received!</h4>
            <p className="text-xs text-slate-500 font-mono">
              Amount ₹{amount} verified by Bank Settlement Gateway.
            </p>
          </div>
        ) : isProcessing ? (
          /* Processing State Screen */
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Processing PhonePe Checkout...</h4>
            <p className="text-xs text-slate-500">
              Verifying transaction token with NPCI / PhonePe merchant server...
            </p>
          </div>
        ) : (
          /* Payment Selection Form */
          <div className="p-5 space-y-5">
            
            {/* Amount Banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider block">Payable Amount</span>
                <span className="text-xs text-slate-600 font-medium">{description || 'Government Service & Facilitation Fee'}</span>
              </div>
              <span className="text-2xl font-black text-purple-900 font-mono">₹{amount}</span>
            </div>

            {/* Method Selectors */}
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMethod('phonepe_qr')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${
                  method === 'phonepe_qr'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>PhonePe QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('phonepe_upi')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${
                  method === 'phonepe_upi'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>UPI ID</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${
                  method === 'card'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('netbanking')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${
                  method === 'netbanking'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5 text-emerald-600" />
                <span>NetBank</span>
              </button>
            </div>

            {/* Payment Method Screens */}
            <form onSubmit={handlePay} className="space-y-4">
              
              {method === 'phonepe_qr' && (
                <div className="text-center space-y-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                  <p className="text-xs font-bold text-slate-800">
                    Scan with PhonePe, Paytm, Google Pay, or BHIM UPI App
                  </p>

                  <div className="w-40 h-40 bg-white p-2.5 rounded-2xl mx-auto border-2 border-dashed border-purple-400 shadow-md flex flex-col items-center justify-center relative">
                    <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center text-white p-2">
                      <QrCode className="w-20 h-20 text-purple-400" />
                      <span className="text-[9px] font-mono text-purple-200 mt-1">RAJIB CSC @ PHONEPE PG</span>
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-purple-900 font-bold">
                    Merchant: Rajib CSC North Lakhimpur
                  </p>
                </div>
              )}

              {method === 'phonepe_upi' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Enter PhonePe / UPI VPA Handle</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. 9435012345@ybl or user@ibl"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    A payment request link will be pushed instantly to your PhonePe mobile app.
                  </p>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8912"
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength="3"
                        required
                        placeholder="•••"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Select NetBanking Provider</label>
                  <select className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-purple-600 outline-none">
                    <option>State Bank of India (SBI)</option>
                    <option>Assam Gramin Vikash Bank (AGVB)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Punjab National Bank (PNB)</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{amount} via PhonePe PG</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Verified 256-Bit SSL NPCI Banking Channel</span>
                </div>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
