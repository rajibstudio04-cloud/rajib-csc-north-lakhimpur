import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  FileCheck, 
  Zap, 
  Award, 
  Users, 
  Clock, 
  Star, 
  ArrowRight
} from 'lucide-react';

export const HeroSection = ({ onSearchService }) => {
  const { lang, t, setSelectedService } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchService) {
      onSearchService(query);
    }
    setSelectedService(null);
    navigate(`/services?search=${encodeURIComponent(query)}`);
  };

  const handleNavigateServices = () => {
    setSelectedService(null);
    navigate('/services');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-csc-navy via-csc-darkBlue to-slate-950 text-white rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-7 border border-csc-lightBlue/30 flex flex-col justify-between h-full">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-csc-lightBlue/20 rounded-full blur-3xl -z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

      <div className="relative z-10 space-y-4">
        
        {/* Top Authorized & Live PhonePe PG Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-csc-lightBlue/20 border border-amber-400/40 px-3 py-1 rounded-full text-[11px] font-extrabold text-amber-300 shadow-sm backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>CSC VLE ID: 498120394812</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/50 px-3 py-1 rounded-full text-[11px] font-black text-purple-200 shadow-sm backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Live PhonePe PG</span>
          </div>
        </div>

        {/* Bilingual Hero Headline */}
        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            ঘৰতে বহি পাওক <span className="bg-gradient-to-r from-cyan-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">সকলো চৰকাৰী সেৱা</span>
          </h1>
          <p className="text-sm sm:text-base font-bold text-cyan-200 tracking-wide">
            Digital Sewa & Official Certificate Portal • North Lakhimpur
          </p>
        </div>

        {/* Concise Supporting Text */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium text-left">
          Apply online for e-District Income, PRC & Caste Certificates, pay APDCL electricity bills & smart prepaid meter recharge with instant PhonePe checkout.
        </p>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearch} className="pt-1">
          <div className="relative flex items-center shadow-xl rounded-2xl overflow-hidden border border-cyan-400/40 bg-white/10 backdrop-blur-xl">
            <Search className="w-4 h-4 text-cyan-300 absolute left-3.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. Income Cert, PRC, PAN Card, APDCL..."
              className="w-full pl-10 pr-24 py-3 text-xs text-white placeholder-slate-300 bg-transparent focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 bg-csc-lightBlue hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Action CTAs */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleNavigateServices}
            className="bg-csc-lightBlue hover:bg-blue-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Apply e-District Services</span>
          </button>

          <button
            onClick={() => navigate('/bill-pay')}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Pay APDCL Bill</span>
          </button>

          <button
            onClick={() => navigate('/track-status')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
          >
            <span>Track Application</span>
          </button>
        </div>

      </div>

      {/* Trust Stats Bar — Compact Single Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-700/60 relative z-10">
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <Users className="w-4 h-4 text-cyan-300 mx-auto mb-0.5" />
          <span className="text-[10px] font-bold text-white block">15,000+ Citizens</span>
        </div>
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <Award className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
          <span className="text-[10px] font-bold text-white block">30+ e-Services</span>
        </div>
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mx-auto mb-0.5" />
          <span className="text-[10px] font-bold text-white block">4.9 ★ Rating</span>
        </div>
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center">
          <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
          <span className="text-[10px] font-bold text-white block">Fast 3-5 Days</span>
        </div>
      </div>

    </div>
  );
};
