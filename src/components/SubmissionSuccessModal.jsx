import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  Copy, 
  Printer, 
  Home,
  X
} from 'lucide-react';
import { webhookService } from '../services/webhookService';
import { useApp } from '../context/AppContext';

export const SubmissionSuccessModal = ({ application, onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  if (!application) return null;

  const adminWhatsAppUrl = webhookService.getAdminAlertWhatsAppLink(application);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(application.id);
    showToast(`Reference ID ${application.id} copied to clipboard!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-1">
              Application Successfully Saved & Submitted
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {application.serviceTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your details and uploaded documents have been securely stored in Rajib CSC Database.
            </p>
          </div>
        </div>

        {/* Reference ID Highlight Box */}
        <div className="bg-gradient-to-r from-csc-navy to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md border border-cyan-500/30">
          <div>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">Official Tracking Reference ID</span>
            <span className="text-xl font-black font-mono tracking-wide text-amber-300">{application.id}</span>
          </div>
          <button
            onClick={handleCopyRef}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Ref ID</span>
          </button>
        </div>

        {/* Application Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
          <div className="flex justify-between border-b pb-1.5 text-slate-700">
            <span className="text-slate-500">Applicant Name:</span>
            <span className="font-bold text-slate-900">{application.applicantName}</span>
          </div>
          <div className="flex justify-between border-b pb-1.5 text-slate-700">
            <span className="text-slate-500">Contact Number:</span>
            <span className="font-bold font-mono text-slate-900">+91 {application.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-1.5 text-slate-700">
            <span className="text-slate-500">Uploaded Documents:</span>
            <span className="font-extrabold text-emerald-700">{application.documents ? application.documents.length : 0} Files Attached</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span className="text-slate-500">Processing Status:</span>
            <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">Submitted (Pending Verification)</span>
          </div>
        </div>

        {/* Admin WhatsApp Alert Action Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Notify Rajib CSC Operator via WhatsApp Alert</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Send an instant notification alert with your reference details directly to the North Lakhimpur VLE operator.
          </p>
          <a
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send WhatsApp Alert to VLE (+91 94350 12345)</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate(`/track-status?id=${encodeURIComponent(application.id)}`);
            }}
            className="flex-1 bg-csc-navy hover:bg-csc-lightBlue text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Track Application Status</span>
          </button>

          <button
            onClick={() => {
              onClose();
              navigate('/services');
            }}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-5 rounded-xl text-xs transition-colors"
          >
            Done & Return
          </button>
        </div>

      </div>
    </div>
  );
};
