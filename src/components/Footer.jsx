import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink,
  Heart
} from 'lucide-react';

export const Footer = () => {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-csc-lightBlue">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-csc-lightBlue flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {t('centerTitle')}
                </h3>
                <p className="text-xs text-cyan-400 font-medium">Digital Sewa Kendra • Lakhimpur</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering citizens of North Lakhimpur, Assam with 100% online government certificate applications, Voter & PAN services, Aadhaar bookings, and instant APDCL electricity bill payments.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Govt Authorized CSC VLE ID: 498120394812
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
              Quick Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>•</span> Assam e-District PRC & Income Cert
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>•</span> New PAN Card / Correction (Form 49A)
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>•</span> Voter ID Form 6 & 8 Correction
                </Link>
              </li>
              <li>
                <Link to="/bill-pay" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>•</span> APDCL Electricity Bill Pay
                </Link>
              </li>
              <li>
                <Link to="/doorstep" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>•</span> Doorstep CSC Service Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Center Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
              North Lakhimpur Office
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-csc-lightBlue shrink-0 mt-0.5" />
                <span>Ward No. 8, Near District Library, Khelmati, North Lakhimpur, Assam - 787001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919435012345" className="hover:underline">+91 94350 12345 / +91 98540 67890</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>rajibcsc.lakhimpur@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t('centerHours')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Hosting & Direct WhatsApp */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
              Domain & Live Support
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Production Domain:</span>
              </div>
              <a 
                href="https://rajibcsc.rzdigitalstudio.in" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-cyan-300 underline font-mono break-all flex items-center gap-1 hover:text-white"
              >
                rajibcsc.rzdigitalstudio.in
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <a
              href="https://wa.me/919435012345?text=Hello%20Rajib%20CSC,%20I%20need%20assistance%20with%20an%20application."
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg hover:shadow-emerald-900/50"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Quick Help (+91 94350 12345)</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>© 2026 Rajib CSC Center Lakhimpur. All rights reserved.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <Link to="/" className="text-slate-400 hover:text-cyan-300 text-xs font-semibold transition-colors">
              {t('citizenLoginBtn')}
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/admin-login" className="text-slate-400 hover:text-amber-400 text-xs font-semibold transition-colors">
              {t('adminLoginBtn')}
            </Link>
            <span className="text-slate-700">•</span>
            <p className="flex items-center gap-1 text-slate-400 text-xs">
              Built for Lakhimpur Citizens with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
