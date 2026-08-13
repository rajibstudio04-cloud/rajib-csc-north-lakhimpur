import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { webhookService } from '../services/webhookService';
import { receiptPdfService } from '../services/receiptPdfService';
import { AdminWalletManager } from './AdminWalletManager';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Upload, 
  MessageSquare, 
  Download, 
  ExternalLink,
  ShieldCheck,
  X,
  AlertCircle,
  Wallet,
  LogOut,
  Printer,
  FileSpreadsheet,
  CheckSquare,
  Square,
  AlertTriangle,
  Send,
  Zap,
  Tag,
  FileCheck,
  Image as ImageIcon,
  FolderOpen,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Building2
} from 'lucide-react';

export const AdminDashboard = ({ onLogout }) => {
  const { lang, t, applications, updateApplicationStatus, showToast } = useApp();
  
  // Active Admin View Tab: 'applications' or 'wallet'
  const [adminTab, setAdminTab] = useState('applications');
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal States
  const [viewFormApp, setViewFormApp] = useState(null); // Full Application Form Details Modal
  const [viewDocsApp, setViewDocsApp] = useState(null); // Documents Viewer Gallery Modal
  const [selectedApp, setSelectedApp] = useState(null); // Full Inspector / Edit Status Modal
  
  // Active previewed document in document gallery
  const [previewDoc, setPreviewDoc] = useState(null);

  // Bulk selection state
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  
  // Form State inside drawer
  const [editStatus, setEditStatus] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [issuedDocName, setIssuedDocName] = useState('');

  // Real Stats calculation
  const totalReceived = (applications || []).length;
  const pendingApps = (applications || []).filter(a => a.status === 'Pending' || a.status === 'Submitted' || a.status === 'Action Required');
  const pendingCount = pendingApps.length;
  const processingCount = (applications || []).filter(a => a.status === 'Processing').length;
  const completedCount = (applications || []).filter(a => a.status === 'Completed').length;
  const totalRevenue = (applications || []).reduce((sum, a) => sum + (a.totalFee || 80), 0);

  // Filtered list
  const filteredApps = (applications || []).filter((app) => {
    if (!app) return false;
    const id = String(app?.id || '').toLowerCase();
    const name = String(app?.applicantName || '').toLowerCase();
    const phone = String(app?.phone || '');
    const serviceTitle = String(app?.serviceTitle || '').toLowerCase();
    const term = String(searchTerm || '').toLowerCase();

    const matchesSearch = id.includes(term) || name.includes(term) || phone.includes(term) || serviceTitle.includes(term);
    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Pending' 
      ? (app.status === 'Pending' || app.status === 'Submitted' || app.status === 'Action Required')
      : app?.status === statusFilter;
      
    const matchesCategory = categoryFilter === 'All' ? true : (app?.serviceId || '').toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Bulk Selection handlers
  const toggleSelectAll = () => {
    if (selectedAppIds.length === filteredApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApps.map(a => a.id));
    }
  };

  const toggleSelectApp = (id) => {
    setSelectedAppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedAppIds.length === 0) return;
    selectedAppIds.forEach(id => {
      updateApplicationStatus(id, newStatus, `Bulk status updated to ${newStatus}`);
    });
    showToast(`Updated ${selectedAppIds.length} applications to "${newStatus}"`, 'success');
    setSelectedAppIds([]);
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    if (!filteredApps || filteredApps.length === 0) {
      showToast('No applications available to export', 'info');
      return;
    }
    const headers = ['Ref Number', 'Applicant Name', 'Phone', 'Service Title', 'Submitted On', 'Total Fee (INR)', 'Status', 'Operator Remarks'];
    const rows = filteredApps.map(a => [
      a.id,
      `"${(a.applicantName || '').replace(/"/g, '""')}"`,
      a.phone || '',
      `"${(a.serviceTitle || '').replace(/"/g, '""')}"`,
      a.submittedAt || '',
      a.totalFee || 80,
      a.status || 'Pending',
      `"${(a.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rajib_CSC_Applications_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Applications Register downloaded successfully', 'success');
  };

  const openAppDrawer = (app) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditRemarks(app.remarks || '');
    setIssuedDocName(app.issuedDocUrl || '');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    updateApplicationStatus(
      selectedApp.id,
      editStatus,
      editRemarks,
      issuedDocName || null
    );

    // Update local state copy
    setSelectedApp((prev) => ({
      ...prev,
      status: editStatus,
      remarks: editRemarks,
      issuedDocUrl: issuedDocName || null
    }));
  };

  const handleSendWhatsAppNotification = (app = selectedApp) => {
    if (!app) return;
    const url = webhookService.getCitizenUpdateWhatsAppLink(app, app.status || editStatus, app.remarks || editRemarks);
    window.open(url, '_blank');
    showToast(`WhatsApp message draft opened for +91 ${app.phone}`, 'success');
  };

  const handleDownloadReceipt = (app) => {
    if (!app) return;
    receiptPdfService.generateReceiptPDF(app, 'application');
    showToast(`PDF Receipt generated for ${app.id}`, 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      
      {/* 1. ONE Compact Admin-Only Header */}
      <header className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-csc-lightBlue via-blue-600 to-csc-navy flex items-center justify-center border border-cyan-400/30 shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                Rajib CSC <span className="text-cyan-300 font-extrabold">Admin & Operator Portal</span>
              </h1>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0">
                Session Active
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium tracking-wide">
              North Lakhimpur Common Service Centre • Live Application & Document Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer border border-emerald-400/30"
            title="Download CSV Register"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Export CSV Register</span>
          </button>

          <div className="bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Wallet</span>
            <span className="text-base font-black text-amber-400 font-mono leading-tight">₹24,850.00</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Admin Module Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4">
        <button
          onClick={() => setAdminTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === 'applications'
              ? 'bg-white border-csc-lightBlue text-csc-navy shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-csc-lightBlue" />
          <span>Applications Management ({totalReceived})</span>
        </button>

        <button
          onClick={() => setAdminTab('wallet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            adminTab === 'wallet'
              ? 'bg-white border-amber-500 text-amber-600 shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4 text-amber-500" />
          <span>Wallet Management</span>
        </button>
      </div>

      {adminTab === 'wallet' ? (
        <AdminWalletManager />
      ) : (
        <>
      {/* PENDING WORK SLA ALERT GUARD BANNER */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-md border border-amber-400 flex flex-col sm:flex-row justify-between items-center gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-950 uppercase tracking-wide">
                ⚡ Pending Work Alert: {pendingCount} Customer Application(s) Awaiting Processing!
              </h3>
              <p className="text-xs font-semibold text-slate-900">
                Inspect customer applied forms and uploaded documents to approve or complete applications.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatusFilter('Pending')}
            className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold px-4 py-2 rounded-xl text-xs shadow transition-all cursor-pointer shrink-0"
          >
            Show Pending Items Only ({pendingCount})
          </button>
        </div>
      )}

      {/* 3. 5 Work Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm space-y-1 ${statusFilter === 'All' ? 'bg-blue-50 border-csc-lightBlue' : 'bg-white border-slate-200/90 hover:border-slate-300'}`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Received</span>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-black text-csc-navy font-mono">{totalReceived}</span>
            <FileText className="w-5 h-5 text-csc-lightBlue shrink-0" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm space-y-1 ${statusFilter === 'Pending' ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200/90 hover:border-slate-300'}`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Pending Action</span>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-500 shrink-0" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Processing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm space-y-1 ${statusFilter === 'Processing' ? 'bg-sky-50 border-sky-400' : 'bg-white border-slate-200/90 hover:border-slate-300'}`}
        >
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Processing</span>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono">{processingCount}</span>
            <Clock className="w-5 h-5 text-blue-500 shrink-0" />
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm space-y-1 ${statusFilter === 'Completed' ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200/90 hover:border-slate-300'}`}
        >
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Completed</span>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">{completedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Fees Collected</span>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-black text-csc-navy font-mono">₹{totalRevenue}</span>
            <IndianRupee className="w-5 h-5 text-csc-navy shrink-0" />
          </div>
        </div>
      </div>

      {/* 4. Controls Bar: Search, Status Filters & Category Filter */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-3">
        
        {/* Search Box */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Ref No, Applicant Name, Phone..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-csc-lightBlue outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter Pills & Category Dropdown */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-slate-50 text-slate-700 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="income">Income Certificate</option>
            <option value="prc">PRC Certificate</option>
            <option value="pan">PAN Card</option>
            <option value="voter">Voter ID</option>
            <option value="apdcl">APDCL Utility</option>
          </select>

          <div className="flex items-center gap-1 flex-wrap">
            {['All', 'Pending', 'Processing', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-csc-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* FLOATING BULK ACTIONS BAR */}
      {selectedAppIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3 px-4 rounded-xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedAppIds.length} application(s) selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">Bulk Action:</span>
            <button
              onClick={() => handleBulkStatusChange('Processing')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
            >
              Mark Processing
            </button>
            <button
              onClick={() => handleBulkStatusChange('Completed')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
            >
              Mark Completed
            </button>
            <button
              onClick={() => setSelectedAppIds([])}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Applications Data Table with explicit VIEW FORM & VIEW DOCUMENTS buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={filteredApps.length > 0 && selectedAppIds.length === filteredApps.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="p-3">Ref Number</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Service Title</th>
                <th className="p-3">Submitted On</th>
                <th className="p-3">Fee</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Customer Form</th>
                <th className="p-3 text-center">Uploaded Docs</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => {
                  const isPending = app.status === 'Pending' || app.status === 'Submitted' || app.status === 'Action Required';
                  const docCount = app.documents ? app.documents.length : 0;

                  return (
                    <tr 
                      key={app.id} 
                      className={`transition-colors ${isPending ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedAppIds.includes(app.id)}
                          onChange={() => toggleSelectApp(app.id)}
                          className="rounded border-slate-300 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 font-mono font-bold text-csc-navy">
                        <div className="flex items-center gap-1.5">
                          <span>{app.id}</span>
                          {isPending && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="Pending Action Needed"></span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <strong className="text-slate-900 block">{app.applicantName}</strong>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-mono text-[11px]">+91 {app.phone}</span>
                          <a
                            href={`https://wa.me/91${app.phone}?text=Hello%20${encodeURIComponent(app.applicantName)},%20update%20from%20Rajib%20CSC%20Lakhimpur%20regarding%20Application%20${app.id}:%20Status%20is%20${app.status}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-500 p-0.5 rounded cursor-pointer"
                            title="Direct WhatsApp Message"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-emerald-100" />
                          </a>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-slate-700 max-w-xs truncate">{app.serviceTitle}</td>
                      <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">{app.submittedAt}</td>

                      <td className="p-3 font-extrabold text-slate-900 font-mono">₹{app.totalFee || 80}</td>

                      {/* Interactive Quick Status Select Cell */}
                      <td className="p-3">
                        <select
                          value={app.status || 'Pending'}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value, `Status updated via quick inline menu to ${e.target.value}`)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase border cursor-pointer outline-none ${
                            app.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : app.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Action Required">Action Req</option>
                        </select>
                      </td>

                      {/* EXPLICIT VIEW FORM BUTTON */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setViewFormApp(app)}
                          className="bg-blue-50 hover:bg-blue-600 hover:text-white text-csc-navy border border-blue-200 font-extrabold px-3 py-1.5 rounded-xl text-[11px] inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-csc-lightBlue" />
                          <span>View Form</span>
                        </button>
                      </td>

                      {/* EXPLICIT VIEW DOCUMENTS BUTTON */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setViewDocsApp(app);
                            if (app.documents && app.documents.length > 0) {
                              setPreviewDoc(app.documents[0]);
                            }
                          }}
                          className={`font-extrabold px-3 py-1.5 rounded-xl text-[11px] inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer border ${
                            docCount > 0 
                              ? 'bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-900 border-purple-200' 
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                          <span>View Docs ({docCount})</span>
                        </button>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDownloadReceipt(app)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                            title="Print PDF Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openAppDrawer(app)}
                            className="bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Full Status & Update Drawer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-500">
                    No applications matching current search & status filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. DEDICATED "VIEW CUSTOMER APPLIED FORM" MODAL DRAWER */}
      {/* ------------------------------------------------------------- */}
      {viewFormApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Form Header */}
            <div className="p-5 bg-gradient-to-r from-csc-navy via-slate-900 to-csc-lightBlue text-white flex justify-between items-center rounded-t-3xl border-b border-cyan-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <FileText className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded">
                    Official Customer Application Form
                  </span>
                  <h3 className="font-black text-lg text-white leading-tight">{viewFormApp.serviceTitle}</h3>
                  <p className="text-xs text-slate-300 font-mono">Ref ID: {viewFormApp.id} • Submitted: {viewFormApp.submittedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadReceipt(viewFormApp)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => setViewFormApp(null)}
                  className="text-slate-300 hover:text-white p-1 cursor-pointer rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Body - Structured Print-Style Layout */}
            <div className="p-6 space-y-6 text-xs text-slate-800">
              
              {/* Reference Banner */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Service Category & Title</span>
                  <strong className="text-sm text-csc-navy font-bold">{viewFormApp.serviceTitle}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Processing Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    viewFormApp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    viewFormApp.status === 'Processing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {viewFormApp.status || 'Submitted'}
                  </span>
                </div>
              </div>

              {/* 1. Applicant Primary Personal Info */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-csc-navy uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-csc-lightBlue" />
                  <span>1. Applicant Personal Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Applicant Name:</span>
                    <strong className="text-slate-900 text-sm font-bold">{viewFormApp.applicantName}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Father / Husband / Guardian Name:</span>
                    <strong className="text-slate-900 text-sm">{viewFormApp.fatherName}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Mobile Phone Number:</span>
                    <strong className="text-slate-900 font-mono text-sm">+91 {viewFormApp.phone}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Aadhaar Card Number:</span>
                    <strong className="text-slate-900 font-mono text-sm">{viewFormApp.aadhaar}</strong>
                  </div>
                </div>
              </div>

              {/* 2. Lakhimpur Residential Address */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-csc-navy uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>2. Residential Address Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Street / Village / Town Address:</span>
                    <strong className="text-slate-900">{viewFormApp.address}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Panchayat / Circle:</span>
                    <strong className="text-slate-900">{viewFormApp.panchayat}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">District:</span>
                    <strong className="text-slate-900">North Lakhimpur, Assam</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">PIN Code:</span>
                    <strong className="text-slate-900 font-mono">{viewFormApp.pinCode}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Service Specific Input Parameters (If any extra fields submitted) */}
              {Object.keys(viewFormApp).filter(k => ![
                'id', 'serviceId', 'serviceTitle', 'applicantName', 'fatherName', 
                'phone', 'email', 'aadhaar', 'address', 'panchayat', 'district', 
                'pinCode', 'govtFee', 'cscFee', 'totalFee', 'documents', 'paymentMethod', 
                'status', 'submittedAt', 'updatedAt', 'remarks', 'issuedDocUrl'
              ].includes(k)).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-csc-navy uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>3. Additional Service Specific Parameters</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-200/80">
                    {Object.keys(viewFormApp).filter(k => ![
                      'id', 'serviceId', 'serviceTitle', 'applicantName', 'fatherName', 
                      'phone', 'email', 'aadhaar', 'address', 'panchayat', 'district', 
                      'pinCode', 'govtFee', 'cscFee', 'totalFee', 'documents', 'paymentMethod', 
                      'status', 'submittedAt', 'updatedAt', 'remarks', 'issuedDocUrl'
                    ].includes(k)).map(key => (
                      <div key={key} className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <strong className="text-slate-900 text-xs font-semibold">{String(viewFormApp[key])}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Financial Fee Summary */}
              <div className="bg-gradient-to-r from-slate-900 to-csc-navy text-white p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase text-cyan-300 font-bold block">Application Fee Paid</span>
                  <span className="text-xs text-slate-300">Govt Fee ₹{viewFormApp.govtFee || 30} + CSC Portal Fee ₹{viewFormApp.cscFee || 50}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-emerald-300 font-bold block">Total Cleared</span>
                  <span className="text-xl font-black text-amber-400 font-mono">₹{viewFormApp.totalFee || 80}</span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-100 rounded-b-3xl border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  const app = viewFormApp;
                  setViewFormApp(null);
                  setViewDocsApp(app);
                  if (app.documents && app.documents.length > 0) setPreviewDoc(app.documents[0]);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Switch to View Documents ({viewFormApp.documents ? viewFormApp.documents.length : 0})</span>
              </button>

              <button
                onClick={() => setViewFormApp(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Form
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. DEDICATED "VIEW CUSTOMER DOCUMENTS GALLERY" MODAL */}
      {/* ------------------------------------------------------------- */}
      {viewDocsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Docs Header */}
            <div className="p-5 bg-gradient-to-r from-purple-900 via-slate-900 to-csc-navy text-white flex justify-between items-center rounded-t-3xl border-b border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-400/30">
                  <FolderOpen className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded">
                    Customer Submitted Documents Gallery
                  </span>
                  <h3 className="font-black text-lg text-white leading-tight">
                    {viewDocsApp.applicantName} — {viewDocsApp.serviceTitle}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">Total Uploaded Files: {viewDocsApp.documents ? viewDocsApp.documents.length : 0}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setViewDocsApp(null);
                  setPreviewDoc(null);
                }}
                className="text-slate-300 hover:text-white p-1 cursor-pointer rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Docs Body - Preview Pane + Thumbnails */}
            <div className="p-6 space-y-6">
              
              {viewDocsApp.documents && viewDocsApp.documents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Full Document Preview Display (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 text-white min-h-[340px]">
                    {previewDoc ? (
                      <>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs font-extrabold text-cyan-300 truncate max-w-xs">{previewDoc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{previewDoc.size || 'Verified'}</span>
                        </div>

                        {/* Preview canvas */}
                        <div className="flex-1 flex items-center justify-center p-2 overflow-hidden bg-slate-950 rounded-xl min-h-[250px]">
                          {previewDoc.url && previewDoc.url.startsWith('data:image') ? (
                            <img src={previewDoc.url} alt={previewDoc.name} className="max-h-[300px] w-auto object-contain rounded shadow" />
                          ) : (
                            <div className="text-center space-y-2 p-6">
                              <FileText className="w-16 h-16 text-purple-400 mx-auto" />
                              <p className="text-xs font-bold text-slate-300">{previewDoc.name}</p>
                              <p className="text-[10px] text-slate-500">PDF Document File</p>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                          {previewDoc.url && (
                            <>
                              <a
                                href={previewDoc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-csc-navy hover:bg-csc-lightBlue text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Full Screen</span>
                              </a>

                              <a
                                href={previewDoc.url}
                                download={previewDoc.name || 'document'}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download File</span>
                              </a>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                        Select a document from the list to preview.
                      </div>
                    )}
                  </div>

                  {/* Right Column: List of All Uploaded Files (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                      Attached Document Files List ({viewDocsApp.documents.length})
                    </h4>

                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {viewDocsApp.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          onClick={() => setPreviewDoc(doc)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            previewDoc === doc 
                              ? 'bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-400/30' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {doc.url && doc.url.startsWith('data:image') ? (
                              <img src={doc.url} alt="thumb" className="w-10 h-10 object-cover rounded-lg border shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                                PDF
                              </div>
                            )}
                            <div className="truncate">
                              <p className="font-extrabold text-slate-800 text-xs truncate">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.size || 'Verified Document'}</p>
                            </div>
                          </div>

                          <Eye className={`w-4 h-4 shrink-0 ${previewDoc === doc ? 'text-purple-600' : 'text-slate-400'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
                  <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No documents attached for this application.</p>
                </div>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-100 rounded-b-3xl border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  const app = viewDocsApp;
                  setViewDocsApp(null);
                  setViewFormApp(app);
                }}
                className="bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-300" />
                <span>Switch to View Applied Form</span>
              </button>

              <button
                onClick={() => {
                  setViewDocsApp(null);
                  setPreviewDoc(null);
                }}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Gallery
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. FULL APPLICATION INSPECTOR & STATUS UPDATE DRAWER */}
      {/* ------------------------------------------------------------- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="p-4 bg-csc-navy text-white flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="font-bold text-base">Application Status Manager</h3>
                <p className="text-xs text-cyan-200 font-mono">Ref ID: {selectedApp.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadReceipt(selectedApp)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download PDF Receipt</span>
                </button>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-300 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Applicant Info Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Applicant Name:</span>
                  <strong className="text-slate-900 text-sm">{selectedApp.applicantName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Father/Husband/Guardian:</span>
                  <strong className="text-slate-900">{selectedApp.fatherName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile Contact:</span>
                  <strong className="text-slate-900 font-mono">+91 {selectedApp.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Aadhaar Number:</span>
                  <strong className="text-slate-900 font-mono">{selectedApp.aadhaar}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Address:</span>
                  <strong className="text-slate-900">{selectedApp.address}, {selectedApp.panchayat}, Lakhimpur - {selectedApp.pinCode}</strong>
                </div>
              </div>

              {/* Admin Update Form */}
              <form onSubmit={handleSaveStatus} className="bg-blue-50/70 p-5 rounded-xl border border-blue-200 space-y-4 text-xs">
                <h4 className="font-bold text-csc-navy flex items-center gap-1.5 text-sm">
                  <Edit3 className="w-4 h-4" />
                  <span>Update Processing Status & Official Certificate</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Processing Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white outline-none text-csc-navy"
                    >
                      <option value="Submitted">Submitted (Initial)</option>
                      <option value="Verified">Verified at CSC</option>
                      <option value="Processing">Processing at Govt Dept</option>
                      <option value="Completed">Completed & Certificate Issued</option>
                      <option value="Action Required">Action Required / Re-upload</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Official E-Certificate File Name / Link</label>
                    <input
                      type="text"
                      value={issuedDocName}
                      onChange={(e) => setIssuedDocName(e.target.value)}
                      placeholder="e.g. PRC_Official_Certificate_Approved.pdf"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Operator Remarks / Govt Tracking Ref ID</label>
                  <textarea
                    rows="2"
                    value={editRemarks}
                    onChange={(e) => setEditRemarks(e.target.value)}
                    placeholder="Enter Circle Office reference or instructions for citizen"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                  ></textarea>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Status & Notify</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppNotification(selectedApp)}
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Send WhatsApp Alert</span>
                  </button>
                </div>
              </form>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-100 rounded-b-2xl border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close Manager
              </button>
            </div>

          </div>
        </div>
      )}
      </>
      )}

    </div>
  );
};


