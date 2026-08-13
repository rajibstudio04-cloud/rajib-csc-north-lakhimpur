import React from 'react';
import { Zap, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FintechHeader = () => {
  const { t } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-csc-navy to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-cyan-500/30">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-300 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full backdrop-blur-md shadow">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            APDCL North Lakhimpur Sub-Division
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Direct Gateway
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Assam Electricity & Utility Payment Portal
        </h1>

        <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed max-w-2xl font-normal">
          Instant online APDCL Smart Prepaid meter recharge & postpaid electricity bill payments with zero surcharge and 100% official e-receipt confirmation.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-semibold text-slate-300 border-t border-slate-800">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Instant Meter Refill Sync
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero Convenience Surcharge
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Printable QR Code Receipt
          </span>
        </div>
      </div>
    </div>
  );
};
