import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export const PROVIDER_OPTIONS = {
  PREPAID: 'APDCL Smart Prepaid Meter Recharge',
  POSTPAID_LAKHIMPUR: 'APDCL (Upper Assam Circle - Lakhimpur Division)',
  POSTPAID_LOWER: 'APDCL (Lower Assam Electricity Distribution)',
  POSTPAID_CENTRAL: 'APDCL (Central Assam Circle)'
};

export const ProviderSelect = ({ selectedProvider, onSelectProvider }) => {
  const isPrepaid = selectedProvider === PROVIDER_OPTIONS.PREPAID;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
        <span>Select Board / Electricity Provider</span>
        {isPrepaid && (
          <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <Sparkles className="w-3 h-3" />
            Smart Meter Instant Sync
          </span>
        )}
      </label>

      <div className="relative">
        <select
          value={selectedProvider}
          onChange={(e) => onSelectProvider(e.target.value)}
          className="w-full px-4 py-3.5 bg-slate-900/90 text-white font-bold text-sm rounded-2xl border-2 border-slate-700/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all shadow-inner cursor-pointer"
        >
          <option value={PROVIDER_OPTIONS.PREPAID}>
            ⚡ APDCL Smart Prepaid Meter Recharge (Instant Refill)
          </option>
          <option value={PROVIDER_OPTIONS.POSTPAID_LAKHIMPUR}>
            🏢 APDCL (Upper Assam Circle - Lakhimpur Division)
          </option>
          <option value={PROVIDER_OPTIONS.POSTPAID_LOWER}>
            🏢 APDCL (Lower Assam Electricity Distribution)
          </option>
          <option value={PROVIDER_OPTIONS.POSTPAID_CENTRAL}>
            🏢 APDCL (Central Assam Circle)
          </option>
        </select>
      </div>
    </div>
  );
};
