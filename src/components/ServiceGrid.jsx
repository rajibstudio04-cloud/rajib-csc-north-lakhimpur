import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SERVICES } from '../data/servicesData';
import { 
  Fingerprint, 
  HeartPulse, 
  Award, 
  Flame, 
  ShieldCheck, 
  CreditCard, 
  IndianRupee, 
  FileCheck, 
  Vote, 
  Zap, 
  Briefcase, 
  Users,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Centered Official Icon Badge matching Digital Seva Portal
const ServiceIconBadge = ({ id, iconName }) => {
  if (id === 'aadhaar-booking' || iconName === 'Fingerprint') {
    return (
      <div className="w-full h-full rounded-lg bg-white border border-blue-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-400 flex items-center justify-center shadow-sm">
          <Fingerprint className="w-4 h-4 text-slate-900" />
        </div>
        <span className="text-[6.5px] font-black text-slate-900 tracking-tighter uppercase mt-0.5 font-mono">
          AADHAAR
        </span>
      </div>
    );
  }

  if (id === 'ayushman-card') {
    return (
      <div className="w-full h-full rounded-lg bg-white border border-emerald-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-[6px] font-extrabold text-emerald-800 uppercase mt-0.5 text-center leading-tight">
          आयुष्मान
        </span>
      </div>
    );
  }

  if (id === 'jeevan-pramaan') {
    return (
      <div className="w-full h-full rounded-lg bg-white border border-sky-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center">
          <Award className="w-4 h-4 text-sky-600" />
        </div>
        <span className="text-[5.5px] font-extrabold text-sky-900 uppercase mt-0.5 text-center leading-tight">
          Pramaan
        </span>
      </div>
    );
  }

  if (id === 'lpg-services') {
    return (
      <div className="w-full h-full rounded-lg bg-white border border-red-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
          <Flame className="w-4 h-4 text-red-500 fill-red-400" />
        </div>
        <span className="text-[6.5px] font-black text-red-700 uppercase mt-0.5 text-center">
          LPG
        </span>
      </div>
    );
  }

  if (id === 'nps-scheme') {
    return (
      <div className="w-full h-full rounded-lg bg-red-600 flex flex-col items-center justify-center p-1 shadow border border-red-700">
        <span className="text-xs font-black text-white tracking-widest font-mono">nps</span>
        <span className="text-[5px] font-bold text-white uppercase text-center tracking-tighter leading-none mt-0.5">
          PENSION
        </span>
      </div>
    );
  }

  if (id === 'pan-card') {
    return (
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-100 to-blue-50 border border-blue-300 p-1 flex flex-col justify-between shadow-inner">
        <div className="flex justify-between items-center">
          <div className="w-2.5 h-1.5 bg-amber-400 rounded-sm"></div>
          <span className="text-[4.5px] font-mono font-black text-blue-900">GOVT INDIA</span>
        </div>
        <div className="flex items-center gap-1 my-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <div className="space-y-0.5 flex-1">
            <div className="h-0.5 bg-slate-400 rounded w-full"></div>
            <div className="h-0.5 bg-slate-300 rounded w-3/4"></div>
          </div>
        </div>
        <span className="text-[5.5px] font-mono font-bold text-slate-800 text-center">PAN CARD</span>
      </div>
    );
  }

  if (id === 'income-cert') {
    return (
      <div className="w-full h-full rounded-lg bg-amber-50 border border-amber-300 flex flex-col items-center justify-center p-1 shadow-inner">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
          <IndianRupee className="w-3.5 h-3.5" />
        </div>
        <span className="text-[6px] font-black text-amber-900 uppercase mt-0.5">INCOME</span>
      </div>
    );
  }

  if (id === 'voter-id') {
    return (
      <div className="w-full h-full rounded-lg bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <Vote className="w-5 h-5 text-indigo-600" />
        <span className="text-[6px] font-extrabold text-indigo-800 uppercase mt-0.5">VOTER ID</span>
      </div>
    );
  }

  if (id === 'apdcl-payment') {
    return (
      <div className="w-full h-full rounded-lg bg-yellow-400/20 border border-amber-400 flex flex-col items-center justify-center p-1 shadow-inner">
        <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
        <span className="text-[6px] font-black text-slate-900 uppercase mt-0.5">APDCL</span>
      </div>
    );
  }

  if (id === 'emp-exchange') {
    return (
      <div className="w-full h-full rounded-lg bg-slate-100 border border-slate-300 flex flex-col items-center justify-center p-1 shadow-inner">
        <Briefcase className="w-5 h-5 text-slate-700" />
        <span className="text-[5.5px] font-bold text-slate-800 uppercase mt-0.5">JOB REG</span>
      </div>
    );
  }

  if (id === 'senior-citizen-cert') {
    return (
      <div className="w-full h-full rounded-lg bg-teal-50 border border-teal-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <Award className="w-5 h-5 text-teal-700" />
        <span className="text-[5.5px] font-bold text-teal-900 uppercase mt-0.5">SENIOR</span>
      </div>
    );
  }

  if (id === 'nok-cert') {
    return (
      <div className="w-full h-full rounded-lg bg-purple-50 border border-purple-200 flex flex-col items-center justify-center p-1 shadow-inner">
        <Users className="w-5 h-5 text-purple-700" />
        <span className="text-[5.5px] font-bold text-purple-900 uppercase mt-0.5">NOK</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg bg-blue-50 border border-blue-200 flex flex-col items-center justify-center p-1 shadow-inner">
      <FileCheck className="w-5 h-5 text-csc-navy" />
      <span className="text-[6px] font-bold text-csc-navy uppercase mt-0.5">E-SEWA</span>
    </div>
  );
};

// Helper for Assamese numerals
const toAssameseDigits = (num) => {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => digits[d]);
};

export const ServiceGrid = ({ searchQuery, limit, popularOnly = false, categoryFilter = 'all', compactGrid = false }) => {
  const { lang, t, startServiceApplication } = useApp();
  const navigate = useNavigate();

  let filteredServices = SERVICES.filter((s) => {
    if (popularOnly && !s.popular) {
      return false;
    }

    if (categoryFilter && categoryFilter !== 'all' && s.category !== categoryFilter) {
      return false;
    }

    const titleEn = typeof s.title === 'object' ? s.title.en : s.title;
    const titleAs = typeof s.title === 'object' ? s.title.as : s.title;
    const assameseSub = s.assameseSub || '';
    const useCasesEn = s.useCases?.en || '';
    const useCasesAs = s.useCases?.as || '';

    const searchableText = `${titleEn} ${titleAs} ${assameseSub} ${useCasesEn} ${useCasesAs}`.toLowerCase();
    const query = searchQuery ? searchQuery.toLowerCase().trim() : '';

    return !query || searchableText.includes(query);
  });

  if (limit && typeof limit === 'number') {
    filteredServices = filteredServices.slice(0, limit);
  }

  const handleCardClick = (service) => {
    if (service.id === 'apdcl-payment' || service.id === 'lpg-services') {
      navigate('/bill-pay');
    } else {
      startServiceApplication(service);
      navigate('/services');
    }
  };

  const handleKeyDown = (e, service) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(service);
    }
  };

  const gridClass = compactGrid
    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6";

  if (filteredServices.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
        <p className="text-sm font-bold text-slate-700">No services match your criteria.</p>
        <p className="text-xs text-slate-500">Try adjusting your search query or selecting a different category filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Service Cards Grid */}
      <div className={gridClass}>
        {filteredServices.map((service) => {
          const totalFee = (service.govtFee || 0) + (service.cscFee || 0);
          
          // Formatted title according to selected language
          const titleText = typeof service.title === 'object' 
            ? service.title[lang] || service.title.en 
            : service.title;

          const assameseSub = service.assameseSub || (typeof service.title === 'object' ? service.title.as : '');
          const englishTitle = typeof service.title === 'object' ? service.title.en : service.title;
          
          const useCasesText = service.useCases 
            ? (service.useCases[lang] || service.useCases.en) 
            : '';

          const deptText = service.deptLoc 
            ? (service.deptLoc[lang] || service.deptLoc.en) 
            : (service.dept || '');

          const processingText = service.processingTime 
            ? (service.processingTime[lang] || service.processingTime.en) 
            : (service.processingDays || '');

          // Localized numbers
          const isAs = lang === 'as';
          const formattedTotalFee = isAs ? toAssameseDigits(totalFee) : totalFee;
          const formattedGovtFee = isAs ? toAssameseDigits(service.govtFee || 0) : (service.govtFee || 0);
          const formattedCscFee = isAs ? toAssameseDigits(service.cscFee || 0) : (service.cscFee || 0);

          return (
            <div
              key={service.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(service)}
              onKeyDown={(e) => handleKeyDown(e, service)}
              aria-label={`${titleText} - ${t('totalFeeLabel')} ₹${totalFee}`}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-3 sm:gap-4 cursor-pointer group hover:-translate-y-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-csc-lightBlue focus-visible:ring-offset-2 relative"
            >
              {/* TOP HEADER: Icon + Title & Assamese Meaning + Popular Badge */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  {/* Service Icon Frame */}
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl border border-slate-200/80 bg-slate-50 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                    <ServiceIconBadge id={service.id} iconName={service.iconName} />
                  </div>

                  {/* Popular Badge (if applicable) */}
                  {service.popular && (
                    <span className="inline-flex items-center gap-1 bg-amber-100/90 text-amber-900 border border-amber-300 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      {t('badgePopular') || (isAs ? 'জনপ্ৰিয়' : 'POPULAR')}
                    </span>
                  )}
                </div>

                {/* 1. PRIMARY: Service Name & Assamese Meaning */}
                <div className="text-left space-y-0.5">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-csc-navy transition-colors">
                    {titleText}
                  </h3>

                  {/* Assamese meaning alongside if in English mode, or English sub if in Assamese mode */}
                  {isAs ? (
                    englishTitle !== titleText && (
                      <p className="text-xs font-semibold text-slate-500 font-mono">
                        {englishTitle}
                      </p>
                    )
                  ) : (
                    assameseSub && (
                      <p className="text-xs sm:text-sm font-semibold text-blue-700">
                        {assameseSub}
                      </p>
                    )
                  )}
                </div>

                {/* 2. SECONDARY: Compact Quick-Understanding Use Cases */}
                {useCasesText && (
                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-1.5 text-left">
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                      {useCasesText}
                    </p>
                  </div>
                )}
              </div>

              {/* BOTTOM SECTION: Fee + Processing Time + Department + Apply Button */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 mt-auto">
                {/* 3. SUPPORTING: Processing Time & Fee */}
                <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-blue-50/60 to-emerald-50/60 p-2.5 rounded-xl border border-blue-100/80">
                  {/* Processing Time */}
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>⏱ {processingText}</span>
                  </div>

                  {/* Total Fee & Breakdown */}
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-xs sm:text-sm leading-tight">
                      {t('totalFeeLabel') || (isAs ? 'মুঠ মাচুল' : 'Total Fee')} ₹{formattedTotalFee}
                    </div>
                    {(service.govtFee > 0 || service.cscFee > 0) && (
                      <div className="text-[9px] sm:text-[11px] font-medium text-slate-500">
                        {t('govtFeeLabel') || (isAs ? 'চৰকাৰী' : 'Govt')} ₹{formattedGovtFee} + {t('cscFeeLabel') || (isAs ? 'চি.এছ.চি' : 'CSC')} ₹{formattedCscFee}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. LOWEST PRIORITY: Department / Issuing Authority */}
                {deptText && (
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-tight text-left truncate" title={deptText}>
                    <span className="font-medium text-slate-400">{t('issuedByLabel') || (isAs ? 'দ্বাৰা প্ৰদান কৰা' : 'Issued by')}:</span> {deptText}
                  </p>
                )}

                {/* 5. APPLY BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(service);
                  }}
                  className="w-full bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-csc-lightBlue"
                >
                  <span>{t('btnApplyCard') || (isAs ? 'আবেদন কৰক →' : 'Apply Now →')}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
