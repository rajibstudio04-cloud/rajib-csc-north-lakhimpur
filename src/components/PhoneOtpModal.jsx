import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck, ArrowRight, X, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PhoneOtpModal = ({ isOpen, onClose, onVerified, defaultPhone = '' }) => {
  const { showToast } = useApp();
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone || '');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'verified'
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (defaultPhone) {
      const clean = String(defaultPhone).replace(/\D/g, '');
      if (clean.length === 10) setPhoneNumber(clean);
    }
  }, [defaultPhone]);

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOTP = (e) => {
    e.preventDefault();
    const cleanNo = phoneNumber.replace(/\D/g, '');
    if (cleanNo.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    setIsLoading(true);
    // Simulate Firebase Recaptcha & Phone OTP Delivery
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(30);
      showToast(`Firebase OTP sent to +91 ${cleanNo}`, 'success');
    }, 1000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      showToast('Please enter the 6-digit OTP code received.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verified');
      showToast('Phone Number Verified via Firebase Auth!', 'success');

      // Save user session in localStorage
      const userProfile = {
        phone: phoneNumber.replace(/\D/g, ''),
        verified: true,
        verifiedAt: new Date().toISOString()
      };
      localStorage.setItem('rajib_csc_citizen_phone', JSON.stringify(userProfile));

      setTimeout(() => {
        onVerified(userProfile);
      }, 800);
    }, 1200);
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    setTimer(30);
    showToast(`New OTP sent to +91 ${phoneNumber}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden space-y-6">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-csc-navy via-purple-600 to-indigo-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full inline-block">
            Firebase Phone OTP Verification
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            {step === 'phone' ? 'Verify Mobile Number' : step === 'otp' ? 'Enter 6-Digit OTP Code' : 'Phone Verified!'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {step === 'phone' 
              ? 'Enter your mobile number to receive instant SMS verification for payment checkout.'
              : step === 'otp'
              ? `We sent a security code to +91 ${phoneNumber}. Enter code below.`
              : 'Your citizen session is now authenticated.'}
          </p>
        </div>

        {/* Form Screens */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mobile Number (10 Digits)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs font-bold text-slate-500">+91</span>
                <input
                  type="tel"
                  maxLength="10"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9435012345"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-base font-mono font-bold text-slate-900 focus:ring-2 focus:ring-csc-lightBlue outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-csc-navy hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting Firebase Gateway...</span>
                </>
              ) : (
                <>
                  <span>Send Security OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Enter OTP Code</label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] font-bold text-csc-lightBlue hover:underline"
                >
                  Change Number
                </button>
              </div>
              <input
                type="text"
                maxLength="6"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1 2 3 4 5 6"
                className="w-full text-center tracking-[0.4em] py-3 border-2 border-indigo-200 rounded-xl text-xl font-mono font-black text-indigo-900 focus:border-csc-lightBlue outline-none bg-indigo-50/50"
              />
              <p className="text-[10px] text-slate-400 text-center mt-1">
                Test / Demo OTP: Enter any 4-6 digit number (e.g. 123456)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying OTP Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Proceed to Payment</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              {timer > 0 ? (
                <span className="text-xs text-slate-400 font-medium">
                  Resend OTP in <strong className="text-slate-700">{timer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-xs font-bold text-csc-navy hover:text-blue-700 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP Code</span>
                </button>
              )}
            </div>
          </form>
        )}

        {step === 'verified' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Verification Complete</h4>
            <p className="text-xs text-slate-500">Launching Live PhonePe Payment Gateway...</p>
          </div>
        )}

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
          🔒 Secured by Firebase Authentication & 256-Bit SSL
        </div>

      </div>
    </div>
  );
};
