import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ReceiptModal } from './ReceiptModal';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  MessageSquare, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

export const TrackStatus = () => {
  const { t, applications, activeTrackingId, setActiveTrackingId } = useApp();
  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [searchedApp, setSearchedApp] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (activeTrackingId) {
      setSearchInput(activeTrackingId);
      performSearch(activeTrackingId);
    }
  }, [activeTrackingId]);

  const performSearch = (query) => {
    setHasSearched(true);
    const cleanQuery = query.trim().toLowerCase();
    const found = applications.find(
      (app) => app.id.toLowerCase() === cleanQuery || app.phone === cleanQuery
    );
    setSearchedApp(found || null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    performSearch(searchInput);
  };

  // Steps definition for visual progress timeline
  const getStepProgress = (status) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'Verified':
        return 2;
      case 'Processing':
        return 3;
      case 'Completed':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
      
      {/* Search Header Banner */}
      <div className="bg-csc-navy text-white p-6 sm:p-8 rounded-2xl shadow-xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t('trackTitle')}</h2>
        <p className="text-xs sm:text-sm text-cyan-200 max-w-xl mx-auto">
          {t('trackSubtitle')}
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. CSC-LKP-2026-89412 or 9854012345"
              className="w-full pl-10 pr-4 py-3 border-2 border-cyan-400/40 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 font-mono shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="bg-csc-lightBlue hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-all shrink-0"
          >
            {t('btnSearchTrack')}
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-300 pt-2">
          <span>Sample Demo IDs:</span>
          {applications.slice(0, 3).map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setSearchInput(app.id);
                performSearch(app.id);
              }}
              className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-[11px] font-mono text-cyan-300 underline"
            >
              {app.id} ({app.status})
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      {hasSearched && (
        searchedApp ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-8 animate-in fade-in">
            
            {/* Top Status Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Application Reference Number
                </span>
                <h3 className="text-2xl font-black text-csc-navy font-mono">
                  {searchedApp.id}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  Service: <span className="text-csc-lightBlue">{searchedApp.serviceTitle}</span>
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  searchedApp.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : searchedApp.status === 'Processing'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  Status: {searchedApp.status}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Submitted: {searchedApp.submittedAt}
                </span>
              </div>
            </div>

            {/* Visual Step Tracker Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Application Processing Timeline
              </h4>
              
              <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4 py-6">
                {/* Timeline Bar Background */}
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                <div 
                  className="absolute top-1/2 left-8 h-1 bg-csc-lightBlue -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${((getStepProgress(searchedApp.status) - 1) / 3) * 100}%` }}
                ></div>

                {/* Step 1: Submitted */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                    getStepProgress(searchedApp.status) >= 1 ? 'bg-csc-navy text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    1
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2 text-center">
                    Submitted Online
                  </span>
                </div>

                {/* Step 2: Verification */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                    getStepProgress(searchedApp.status) >= 2 ? 'bg-csc-navy text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    2
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2 text-center">
                    CSC Verification
                  </span>
                </div>

                {/* Step 3: Govt Dept */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                    getStepProgress(searchedApp.status) >= 3 ? 'bg-csc-navy text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    3
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2 text-center">
                    Revenue Dept
                  </span>
                </div>

                {/* Step 4: Approved */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                    getStepProgress(searchedApp.status) >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    4
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2 text-center">
                    Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Operator Remarks Note */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Official CSC Operator Note:
              </span>
              <p className="text-slate-800 font-medium">
                {searchedApp.remarks || 'Application is under active verification at Lakhimpur center.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setShowReceipt(true)}
                className="flex items-center gap-2 bg-csc-navy hover:bg-csc-lightBlue text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{t('btnDownloadReceipt')}</span>
              </button>

              {searchedApp.status === 'Completed' && (
                <a
                  href={`#download-${searchedApp.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading official e-Certificate for Ref ID: ${searchedApp.id}`);
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('btnDownloadCertificate')}</span>
                </a>
              )}

              <a
                href={`https://wa.me/919435012345?text=Hello%20Rajib%20CSC,%20I%20am%20querying%20about%20Application%20Ref:%20${searchedApp.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-emerald-300"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ask Operator on WhatsApp</span>
              </a>
            </div>

          </div>
        ) : (
          /* Not Found Box */
          <div className="bg-white rounded-2xl p-8 text-center space-y-3 shadow-md border border-slate-200">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">{t('notFound')}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please double check the reference number on your acknowledgment slip or contact Rajib CSC helpline.
            </p>
          </div>
        )
      )}

      {/* Render Printable Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          application={searchedApp}
          onClose={() => setShowReceipt(false)}
        />
      )}

    </div>
  );
};
