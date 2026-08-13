import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Building2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function ContactPage() {
  const { t } = useApp();

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-csc-navy to-csc-lightBlue text-white p-8 rounded-3xl shadow-xl space-y-2 text-center">
        <span className="bg-blue-100/20 text-cyan-300 border border-cyan-400/30 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
          Direct Touchpoint & Center Details
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t('centerAddressTitle')}</h1>
        <p className="text-xs sm:text-sm text-cyan-100">Official Government Authorized VLE Center in Lakhimpur</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 space-y-8">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-sm">Center Address</strong>
                <span className="text-slate-600">{t('centerAddress')}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-sm">Helpline Numbers</strong>
                <span className="text-slate-600">{t('centerPhone')}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-sm">Email Address</strong>
                <span className="text-slate-600">{t('centerEmail')}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-csc-lightBlue shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-sm">Working Hours</strong>
                <span className="text-slate-600">{t('centerHours')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Block */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-300 relative min-h-[260px] flex flex-col justify-center items-center p-6 text-center space-y-3">
            <MapPin className="w-12 h-12 text-csc-navy animate-bounce" />
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">North Lakhimpur District Library Area</h3>
              <p className="text-xs text-slate-500">Ward No. 8, Khelmati, Assam - 787001</p>
            </div>
            <a
              href="https://maps.google.com/?q=North+Lakhimpur+District+Library"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-csc-navy hover:bg-csc-lightBlue text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-all"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* WhatsApp & Trust Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Govt Authorized CSC VLE ID: 498120394812</span>
          </div>

          <a
            href="https://wa.me/919435012345?text=Hello%20Rajib%20CSC,%20I%20need%20assistance."
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-all inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Rajib CSC on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
