import React from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Award, 
  CheckCircle2,
  Lock,
  Building2
} from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: CreditCard,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      title: 'Live Razorpay UPI Gateway',
      description: 'Instant 256-bit encrypted payments via Google Pay, PhonePe, Paytm & Credit/Debit cards.'
    },
    {
      icon: ShieldCheck,
      color: 'text-csc-lightBlue bg-blue-50 border-blue-200',
      title: 'Verified CSC VLE Center',
      description: 'Official Government Authorized Common Services Center (VLE ID: 498120394812).'
    },
    {
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      title: 'Live BBPS Power Recharge',
      description: 'Direct B2B connection to APDCL smart prepaid meter server for instant balance refill.'
    },
    {
      icon: Award,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      title: 'Official Assam Govt Seal',
      description: 'Direct integration with e-District, NSDL, APDCL, & Election Commission portals.'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div 
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all flex items-start gap-3.5 group hover:-translate-y-0.5"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${badge.color} shadow-inner group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-csc-navy transition-colors">
                {badge.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-normal">
                {badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
