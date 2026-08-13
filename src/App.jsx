import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BillPayPage } from './pages/BillPayPage';
import { TrackStatusPage } from './pages/TrackStatusPage';
import { ContactPage } from './pages/ContactPage';
import { DoorstepPage } from './pages/DoorstepPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

import { CheckCircle2 } from 'lucide-react';

export function AppContent() {
  const { toast } = useApp();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-csc-bgLight text-slate-800">
      <ScrollToTop />
      
      {/* Toast Alert Popup */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`p-4 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border text-white ${
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-csc-navy border-blue-400'
          }`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Render Public Header ONLY on Customer-Facing Pages */}
      {!isAdminRoute && <Header />}

      {/* Main Container */}
      <main className={`flex-1 max-w-[1750px] w-full mx-auto px-4 sm:px-8 lg:px-12 ${isAdminRoute ? 'py-4 sm:py-6 space-y-6' : 'py-6 space-y-10'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/bill-pay" element={<BillPayPage />} />
          <Route path="/track-status" element={<TrackStatusPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/doorstep" element={<DoorstepPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminPage />} />
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Render Public Footer ONLY on Customer-Facing Pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
