import React from 'react';
import { 
  CreditCard, 
  MousePointerClick, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  QrCode,
  FileCheck,
  Smartphone
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Select Service or APDCL Bill',
      desc: 'Choose Income Cert, PRC, PAN Card, or APDCL Smart Prepaid Meter Recharge from the digital catalog.',
      icon: MousePointerClick,
      badge: 'Step 1: Select Service'
    },
    {
      step: '02',
      title: 'Pay Online via Razorpay UPI / Card',
      desc: 'Pay instantly & securely using Google Pay, PhonePe, Paytm UPI, Debit/Credit Card, or Netbanking.',
      icon: CreditCard,
      badge: 'Step 2: Instant Payment'
    },
    {
      step: '03',
      title: 'Receive Certificate / Recharge at Home',
      desc: 'Track application live via SMS/WhatsApp alerts. Get official Assam Govt certified PDF or instant meter refill.',
      icon: CheckCircle2,
      badge: 'Step 3: Direct Delivery'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-csc-navy to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-csc-lightBlue/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
          Simple 3-Step Process
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          How Rajib CSC Digital Portal Works
        </h2>
        <p className="text-xs sm:text-sm text-cyan-100/80">
          No queue, no hassle. Complete government applications & APDCL bill payments online with instant receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div 
              key={idx} 
              className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4 hover:border-csc-lightBlue transition-all group relative backdrop-blur-sm"
            >
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-2xl bg-csc-navy text-cyan-300 flex items-center justify-center font-extrabold border border-cyan-500/30 group-hover:bg-csc-lightBlue group-hover:text-white transition-colors shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-amber-400 transition-colors">
                  {s.step}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  {s.badge}
                </span>
                <h3 className="text-base font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              {idx < 2 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-cyan-400">
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
