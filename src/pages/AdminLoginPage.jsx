import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert, Key, User } from 'lucide-react';

export function AdminLoginPage() {
  const { showToast, t } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@rajibcsc.in');
  const [password, setPassword] = useState('RajibCSC@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      // Validate Admin Credentials
      if (email.trim().toLowerCase() === 'admin@rajibcsc.in' && password === 'RajibCSC@2026') {
        localStorage.setItem('rajib_csc_admin_auth', 'true');
        showToast('VLE Operator Admin Authenticated Successfully!', 'success');
        navigate('/admin-dashboard');
      } else {
        setErrorMsg('Invalid Admin Email or Password. Access Denied.');
      }
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        
        {/* Top Decorative Bar */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-csc-navy via-amber-500 to-csc-lightBlue"></div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-slate-800">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-600 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200 inline-block">
            VLE Operator Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Strict Admin Portal Login
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            North Lakhimpur Common Services Center Management
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Operator Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rajibcsc.in"
                className="w-full pl-10 pr-3.5 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-csc-lightBlue outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Operator Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-csc-lightBlue outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-csc-navy text-amber-300 font-black py-3.5 rounded-xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Access Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center space-y-1">
          <p>Restricted Access for Rajib CSC Operator Staff Only.</p>
          <p className="font-mono text-slate-700 font-bold">Default: admin@rajibcsc.in / RajibCSC@2026</p>
        </div>

        {/* Switch to Citizen Services Link */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs font-bold text-slate-700">
            {t('switchToCitizen')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow cursor-pointer w-full"
          >
            <User className="w-4 h-4 text-cyan-300" />
            <span>Go to Citizen Portal & Services</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
