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
  Tag
} from 'lucide-react';

export const AdminDashboard = ({ onLogout }) => {
  const { lang, t, applications, updateApplicationStatus, showToast } = useApp();
  
  // Active Admin View Tab: 'applications' or 'wallet'
  const [adminTab, setAdminTab] = useState('applications');
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Selected Application drawer state
  const [selectedApp, setSelectedApp] = useState(null);
  
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
              North Lakhimpur Common Service Centre • Live Application Manager
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
      {/* PENDING WORK SLA ALERT GUARD BANNER (Shows whenever there are pending applications) */}
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
                Ensure zero pending backlog — view and process citizen applications promptly to maintain fast SLA.
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

      {/* FLOATING BULK ACTIONS BAR (When items are selected) */}
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

      {/* 5. Main Applications Data Table */}
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
                <th className="p-3">Docs</th>
                <th className="p-3">Fee</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => {
                  const isPending = app.status === 'Pending' || app.status === 'Submitted' || app.status === 'Action Required';
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
                      
                      <td className="p-3 font-semibold text-blue-600">
                        {app.documents ? app.documents.length : 0} Files
                      </td>

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

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadReceipt(app)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                            title="Print PDF Acknowledgment Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openAppDrawer(app)}
                            className="bg-csc-navy hover:bg-csc-lightBlue text-white font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    No applications matching current search & status filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Document Viewer Modal Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="p-4 bg-csc-navy text-white flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="font-bold text-base">Application Inspector & Document Manager</h3>
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

                {/* Render Dynamic Service-Specific Fields */}
                {Object.keys(selectedApp).filter(k => ![
                  'id', 'serviceId', 'serviceTitle', 'applicantName', 'fatherName', 
                  'phone', 'email', 'aadhaar', 'address', 'panchayat', 'district', 
                  'pinCode', 'govtFee', 'cscFee', 'totalFee', 'documents', 'paymentMethod', 
                  'status', 'submittedAt', 'updatedAt', 'remarks', 'issuedDocUrl'
                ].includes(k)).length > 0 && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-csc-navy uppercase tracking-wider block mb-1">
                      Service Specific Form Parameters
                    </span>
                    <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
                      {Object.keys(selectedApp).filter(k => ![
                        'id', 'serviceId', 'serviceTitle', 'applicantName', 'fatherName', 
                        'phone', 'email', 'aadhaar', 'address', 'panchayat', 'district', 
                        'pinCode', 'govtFee', 'cscFee', 'totalFee', 'documents', 'paymentMethod', 
                        'status', 'submittedAt', 'updatedAt', 'remarks', 'issuedDocUrl'
                      ].includes(k)).map(key => (
                        <div key={key}>
                          <span className="text-[11px] text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <p className="font-semibold text-slate-800">{String(selectedApp[key])}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Documents Viewer Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-csc-navy" />
                  <span>Submitted Customer Documents ({selectedApp.documents ? selectedApp.documents.length : 0})</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedApp.documents && selectedApp.documents.length > 0 ? (
                    selectedApp.documents.map((doc, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {doc.url && doc.url.startsWith('data:image') ? (
                            <img src={doc.url} alt="doc thumbnail" className="w-10 h-10 object-cover rounded border" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                              PDF
                            </div>
                          )}
                          <div className="truncate text-xs">
                            <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">{doc.size || 'Verified'}</p>
                          </div>
                        </div>

                        {doc.url && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-slate-100 hover:bg-csc-lightBlue hover:text-white p-2 rounded-lg text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                              title="View Document"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </a>
                            <a
                              href={doc.url}
                              download={doc.name || `document_${idx + 1}`}
                              className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200"
                              title="Download Document"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic col-span-2">No uploaded document files attached.</p>
                  )}
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
                Close Inspector
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

