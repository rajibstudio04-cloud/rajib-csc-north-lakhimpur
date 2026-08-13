import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LoginModal } from './LoginModal';
import { 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  Search,
  Zap,
  FileText,
  Home,
  Truck,
  MapPin,
  User,
  LogOut,
  Shield
} from 'lucide-react';

export const Header = () => {
  const { lang, setLang, t, currentUser, logoutUser, setSelectedService } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('navHome'), icon: Home },
    { path: '/services', label: t('navServices'), icon: FileText },
    { path: '/bill-pay', label: t('navUtility'), icon: Zap },
    { path: '/track-status', label: t('navTrack'), icon: Search },
    { path: '/doorstep', label: t('navDoorstep'), icon: Truck },
    { path: '/contact', label: t('navContact'), icon: MapPin }
  ];

  const handleNavClick = (path) => {
    if (path === '/services' || path === '/') {
      setSelectedService(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 shadow-md">
        {/* Top Announcement Bar */}
        <div className="bg-csc-darkBlue text-slate-200 text-xs py-1.5 px-4 border-b border-slate-700/50">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                Digital India CSC
              </span>
              
              <span className="hidden md:inline text-slate-400">|</span>
              <a href="tel:+919435012345" className="flex items-center gap-1 hover:text-white transition-colors">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                {t('helpline')}: +91 94350 12345
              </a>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Separate Citizen Login / Profile Button */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-xs">
                  <User className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="font-bold text-white max-w-[130px] truncate">
                    {currentUser?.name || `+91 ${currentUser?.phone || ''}`}
                  </span>
                  <button
                    onClick={logoutUser}
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold ml-1 cursor-pointer"
                    title="Logout"
                  >
                    (Logout)
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center gap-1.5 bg-csc-lightBlue hover:bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer border border-cyan-300/30"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('citizenLoginBtn')}</span>
                </button>
              )}

              {/* Separate Admin / Operator Login Button */}
              <Link
                to="/admin-login"
                className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('adminLoginBtn')}</span>
              </Link>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md border border-slate-700">
                <button
                  onClick={() => setLang('as')}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-all cursor-pointer ${
                    lang === 'as' ? 'bg-csc-lightBlue text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  অসমীয়া
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-all cursor-pointer ${
                    lang === 'hi' ? 'bg-csc-lightBlue text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 text-xs font-medium rounded transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-csc-lightBlue text-white font-bold shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Main Navigation Bar */}
      <div className="bg-csc-navy text-white border-b border-csc-lightBlue/30">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Prominent Branding */}
          <Link 
            to="/"
            onClick={() => setSelectedService(null)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-csc-lightBlue via-blue-600 to-csc-navy flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-cyan-400/40 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-cyan-200 transition-colors leading-tight">
                  Rajib CSC <span className="text-cyan-300 font-extrabold">- Digital Sewa Kendra</span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full hidden sm:inline-block shrink-0 shadow-2xs">
                  Verified CSC
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide">
                Common Service Centre • North Lakhimpur, Assam
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => handleNavClick(item.path)}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-white/15 text-cyan-300 shadow-inner border border-white/20'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-300'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-csc-darkBlue border-t border-slate-700/80 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => {
                    handleNavClick(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-csc-lightBlue text-white font-bold shadow'
                        : 'text-slate-200 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 text-cyan-300" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* Mobile Dedicated Login Options */}
            <div className="pt-3 border-t border-slate-700/80 space-y-2">
              {!currentUser && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-csc-lightBlue text-white py-3 rounded-xl font-bold text-sm shadow cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{t('citizenLoginBtn')} (Phone OTP)</span>
                </button>
              )}

              <Link
                to="/admin-login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 py-3 rounded-xl font-bold text-sm transition-all"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{t('adminLoginBtn')} (Operator Portal)</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>

    <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};
