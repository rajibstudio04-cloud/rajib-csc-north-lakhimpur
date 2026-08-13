import React from 'react';
import { Search, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const PostpaidSection = ({
  consumerNo,
  setConsumerNo,
  onFetchBill,
  isSearching,
  fetchedBill,
  onProceedPostpaidPay
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consumerNo.trim()) return;
    onFetchBill();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
            APDCL Postpaid Consumer Number <span className="text-cyan-400">*</span>
          </label>
          
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={consumerNo}
                onChange={(e) => setConsumerNo(e.target.value)}
                placeholder="e.g. 10200049123 or 10200088912"
                className="w-full px-4 py-3.5 bg-slate-900/80 border-2 border-slate-700/80 rounded-2xl text-white font-mono text-base font-extrabold focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all placeholder-slate-500 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="bg-gradient-to-r from-csc-lightBlue to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Fetching Bill...' : 'Fetch Bill'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Tip: Consumer number is printed on your physical APDCL paper bill. Try sample ID{' '}
            <button
              type="button"
              onClick={() => setConsumerNo('10200049123')}
              className="text-cyan-300 font-bold underline font-mono"
            >
              10200049123
            </button>
          </p>
        </div>
      </form>

      {/* Fetched Bill Details Card */}
      {fetchedBill && (
        <div className="bg-gradient-to-br from-slate-900 via-csc-navy to-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex justify-between items-start border-b border-cyan-500/20 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full inline-block">
                APDCL Official Bill Verified
              </span>
              <h4 className="text-xl font-extrabold text-white mt-1">
                {fetchedBill.consumerName}
              </h4>
              <p className="text-xs text-slate-300">{fetchedBill.subDivision}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Amount Due</span>
              <span className="text-3xl font-black text-amber-300 font-mono">
                ₹{fetchedBill.amountDue}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Consumer No</span>
              <strong className="font-mono text-cyan-300 font-bold text-sm">{fetchedBill.consumerNo}</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Billing Month</span>
              <strong className="text-white font-bold">{fetchedBill.billMonth}</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase">Payment Due Date</span>
              <strong className="text-red-400 font-bold text-sm">{fetchedBill.dueDate}</strong>
            </div>
          </div>

          <button
            onClick={onProceedPostpaidPay}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Pay Postpaid Bill Now (₹{fetchedBill.amountDue})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
