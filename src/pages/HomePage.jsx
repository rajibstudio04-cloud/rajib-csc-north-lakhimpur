import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/HeroSection';
import { ServiceGrid } from '../components/ServiceGrid';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { lang, t, setSelectedService } = useApp();

  const handleHeroSearch = (query) => {
    setSelectedService(null);
    navigate(`/services?search=${encodeURIComponent(query)}`);
  };

  const handleViewAllServices = () => {
    setSelectedService(null);
  };

  const isAs = lang === 'as';

  return (
    <div className="space-y-10">
      {/* 1. Above-The-Fold Section: Side-by-Side on Desktop (Hero + Top 6 Popular Services) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (~42-45% width on desktop): Compact Hero */}
        <div className="lg:col-span-5 flex flex-col">
          <HeroSection onSearchService={handleHeroSearch} />
        </div>

        {/* RIGHT COLUMN (~55-58% width on desktop): Top 6 Popular Services (2 col x 3 row) */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          
          {/* Section Heading */}
          <div className="space-y-1 text-left border-b border-slate-200/80 pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                {t('badgePopular') || (isAs ? 'জনপ্ৰিয়' : 'POPULAR')}
              </span>

              <Link
                to="/services"
                onClick={handleViewAllServices}
                className="text-xs font-bold text-csc-navy hover:text-csc-lightBlue flex items-center gap-1 transition-colors"
              >
                <span>{isAs ? 'সকলো সেৱা চাওক' : 'View All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('popularServicesTitle') || (isAs ? 'জনপ্ৰিয় সেৱাসমূহ' : 'Top Popular Services')}
            </h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {t('popularServicesSubtitle') || (isAs ? 'আপোনাৰ প্ৰস্থানীয় সেৱা বাছনি কৰি সহজে আবেদন কৰক।' : 'Select your required service and apply easily online.')}
            </p>
          </div>

          {/* Compact 2-column x 3-row grid for 6 popular service cards */}
          <div className="flex-1">
            <ServiceGrid popularOnly={true} limit={6} compactGrid={true} />
          </div>

          {/* View All Services Footer Button */}
          <div className="pt-2 text-center border-t border-slate-200/80">
            <Link
              to="/services"
              onClick={handleViewAllServices}
              className="inline-flex items-center gap-2 bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{isAs ? 'সকলো সেৱা চাওক (All Services)' : 'Explore All CSC Services'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
            </Link>
          </div>

        </div>

      </section>
    </div>
  );
}
