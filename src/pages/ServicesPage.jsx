import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ServiceGrid } from '../components/ServiceGrid';
import { MultiStepForm } from '../components/MultiStepForm';
import { FileText, Search, Filter, Grid, ShieldCheck, CreditCard, Zap, Briefcase } from 'lucide-react';

export function ServicesPage() {
  const { selectedService, lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  if (selectedService) {
    return <MultiStepForm />;
  }

  const isAs = lang === 'as';

  const categories = [
    { id: 'all', label: isAs ? 'সকলো সেৱা' : 'All Services', icon: Grid },
    { id: 'edistrict', label: isAs ? 'ই-ডিষ্ট্ৰিক্ট প্ৰমাণপত্ৰ' : 'e-District Certificates', icon: FileText },
    { id: 'identity', label: isAs ? 'পৰিচয় পত্ৰ আৰু আঁচনি' : 'Identity Cards & Schemes', icon: CreditCard },
    { id: 'utility', label: isAs ? 'ইউটিলিটি আৰু বিল' : 'Utility & Bills', icon: Zap },
    { id: 'employment', label: isAs ? 'নিয়োগ আৰু ব্যৱসায়' : 'Employment & Business', icon: Briefcase },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-csc-navy via-slate-900 to-csc-lightBlue text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 border border-cyan-500/30">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
          <FileText className="w-3.5 h-3.5" />
          {isAs ? 'ৰাজহ আৰু ই-ডিষ্ট্ৰিক্ট সেৱা' : 'Official e-District & CSC Services'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {isAs ? 'সকলো অনলাইন চৰকাৰী সেৱা' : 'All Online Services & Certificate Applications'}
        </h1>
        <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed max-w-3xl font-medium">
          {isAs 
            ? 'তলৰ যিকোনো চৰকাৰী প্ৰমাণপত্ৰ, আধাৰ/পান কাৰ্ড, বা বিদ্যুৎ বিল সেৱা বাছনি কৰি ৰাজীব চি.এছ.চি উত্তৰ লক্ষীমপুৰৰ জৰিয়তে পোনপটীয়াকৈ আৱেদন কৰক।'
            : 'Select any government certificate, ID card, or digital service below to start your online application through Rajib CSC North Lakhimpur.'}
        </p>
      </div>

      {/* Interactive Controls: Search Box & Category Filter Tabs */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
        
        {/* Search Box */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={isAs ? 'সেৱা অনুসন্ধান কৰক... (যেনে: Income, PRC, PAN, APDCL, Voter)' : 'Search services... (e.g. Income, PRC, PAN Card, APDCL, Voter ID)'}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-csc-lightBlue focus:border-csc-lightBlue outline-none shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-csc-navy text-cyan-300 shadow-md border border-cyan-400/40 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Catalogue Grid */}
      <ServiceGrid searchQuery={searchQuery} categoryFilter={categoryFilter} />
    </div>
  );
}
