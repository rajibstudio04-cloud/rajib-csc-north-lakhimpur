import React from 'react';
import { Zap, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const QUICK_AMOUNTS = [500, 1000, 2000, 3000];

export const PrepaidSection = ({
  consumerNo,
  setConsumerNo,
  rechargeAmount,
  setRechargeAmount,
  onProceedRecharge
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consumerNo.trim() || !rechargeAmount) return;
    onProceedRecharge();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
      
      {/* Consumer Number Input */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
          Smart Meter Consumer Number <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={consumerNo}
            onChange={(e) => setConsumerNo(e.target.value)}
            placeholder="e.g. 10200049123"
            className="w-full px-4 py-3.5 bg-slate-900/80 border-2 border-slate-700/80 rounded-2xl text-white font-mono text-base font-extrabold focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all placeholder-slate-500 shadow-inner"
          />
          <button
            type="button"
            onClick={() => setConsumerNo('10200049123')}
            className="absolute right-3 top-3 text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all"
          >
            Sample: 10200049123
          </button>
        </div>
      </div>

      {/* Recharge Amount (₹) Input */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Recharge Amount (₹) <span className="text-amber-400">*</span>
          </label>
          <span className="text-[11px] text-cyan-400 font-semibold">Min ₹100 • Max ₹10,000</span>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-3.5 text-xl font-black text-amber-400 font-mono">₹</span>
          <input
            type="number"
            required
            min="100"
            max="10000"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            placeholder="Enter recharge amount"
            className="w-full pl-9 pr-4 py-3.5 bg-slate-900/80 border-2 border-slate-700/80 rounded-2xl text-white font-mono text-xl font-black focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all placeholder-slate-500 shadow-inner"
          />
        </div>
      </div>

      {/* Quick Amount Selection Chips */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Select Amount Chips
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {QUICK_AMOUNTS.map((amt) => {
            const isSelected = String(rechargeAmount) === String(amt);
            return (
              <button
                key={amt}
                type="button"
                onClick={() => setRechargeAmount(amt)}
                className={`py-3 px-4 rounded-xl border-2 text-center font-mono font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-1 shadow-md ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 shadow-amber-500/20 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                <span>₹{amt}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Button: Proceed to Recharge */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 rounded-2xl text-base shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <Zap className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
        <span>Proceed to Recharge (₹{rechargeAmount || 0})</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Trust Callout */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Instant Balance Sync with APDCL Smart Meter Server</span>
      </div>

    </form>
  );
};
