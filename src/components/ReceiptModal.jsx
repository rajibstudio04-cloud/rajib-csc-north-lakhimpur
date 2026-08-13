import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  QrCode, 
  Share2, 
  MapPin, 
  Phone,
  MessageSquare,
  Download,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { receiptPdfService } from '../services/receiptPdfService';

export const ReceiptModal = ({ application, onClose }) => {
  const { t, showToast } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await receiptPdfService.generateReceiptPDF(application, application.board ? 'utility' : 'application');
      showToast('Dynamic PDF Receipt generated & downloaded!', 'success');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Failed to generate PDF. Printing standard receipt instead.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Build Free WhatsApp Receipt Share Link using whatsapp://send?phone=&text=
  const phone = application.phone || application.consumerNo || '9435012345';
  const cleanPhone = String(phone).replace(/\D/g, '');
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const refId = application.id || application.txnId || 'CSC-LKP-RECP';
  const title = application.serviceTitle || application.board || 'CSC Digital Sewa Service';
  const amount = application.totalFee || application.amount || (application.govtFee + application.cscFee) || 0;
  const dateStr = application.submittedAt || application.paidAt || new Date().toLocaleString('en-IN');
  const name = application.applicantName || application.consumerName || 'Citizen Customer';

  const waMessage = `*RAJIB CSC - NORTH LAKHIMPUR*
প্ৰাপ্তি স্বীকাৰ / Payment Acknowledgment Receipt
------------------------------------------
✅ *Status*: SUCCESS / PAID
🆔 *Txn / App Ref ID*: ${refId}
👤 *Name*: ${name}
⚡ *Service / Board*: ${title}
💰 *Total Paid Amount*: ₹${amount}
📅 *Date*: ${dateStr}
${application.bbpsRefNo ? `📄 *BBPS Ref No*: ${application.bbpsRefNo}\n` : ''}${application.operatorRef ? `🏢 *Operator Ref*: ${application.operatorRef}\n` : ''}------------------------------------------
 official Digital Receipt: https://rajibcsc.rzdigitalstudio.in/track-status?id=${encodeURIComponent(refId)}

Thank you for choosing Rajib CSC Digital Sewa Kendra, Ward 8 Lakhimpur! (+91 94350 12345)`;

  const encodedMsg = encodeURIComponent(waMessage);
  // Support mobile app URI scheme and browser web scheme
  const waAppUrl = `whatsapp://send?phone=${targetPhone}&text=${encodedMsg}`;
  const waWebUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedMsg}`;

  const handleWhatsAppSend = (e) => {
    // Attempt mobile native URI scheme first; if fallback needed, navigate to web URL
    try {
      window.location.href = waAppUrl;
      setTimeout(() => {
        window.open(waWebUrl, '_blank');
      }, 500);
    } catch (err) {
      window.open(waWebUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header Actions */}
        <div className="p-4 bg-csc-navy text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Application Acknowledgment & E-Receipt</h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleWhatsAppSend}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow cursor-pointer"
              title="Send E-Receipt to WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Receipt to WhatsApp</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 bg-csc-lightBlue hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow cursor-pointer"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-6 space-y-6 printable-receipt">
          
          {/* Header Branding */}
          <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-csc-navy text-white flex items-center justify-center font-extrabold text-xl shadow">
                CSC
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-csc-navy tracking-tight">
                  RAJIB CSC - DIGITAL SEWA KENDRA
                </h2>
                <p className="text-xs font-medium text-slate-600">
                  Government Authorized Common Service Centre (VLE ID: 498120394812)
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500" />
                  Ward No. 8, Near District Library, Khelmati, North Lakhimpur, Assam - 787001
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 inline-block text-center">
                <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                <span className="text-[9px] font-mono text-slate-500 block mt-0.5">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Reference Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider block">
                Application Reference ID / Txn ID
              </span>
              <span className="text-2xl font-black text-csc-navy font-mono">
                {refId}
              </span>
            </div>
            <div className="text-right sm:text-right text-left">
              <span className="text-xs text-slate-500 block">Issued Date & Time</span>
              <span className="text-xs font-bold text-slate-800">{dateStr}</span>
              <span className="inline-block ml-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Status: {application.status || 'PAID'}
              </span>
            </div>
          </div>

          {/* Applicant & Service Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 uppercase block tracking-wider text-[11px] text-csc-navy">
                Applicant Information
              </span>
              <p><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{name}</strong></p>
              <p><span className="text-slate-500">Father/Guardian:</span> <strong className="text-slate-900">{application.fatherName || 'N/A'}</strong></p>
              <p><span className="text-slate-500">Phone / Consumer:</span> <strong className="text-slate-900">+91 {phone}</strong></p>
              <p><span className="text-slate-500">Aadhaar:</span> <strong className="text-slate-900 font-mono">{application.aadhaar || 'Verified'}</strong></p>
              <p><span className="text-slate-500">Address:</span> <strong className="text-slate-900">{application.address || 'North Lakhimpur, Assam'}</strong></p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 uppercase block tracking-wider text-[11px] text-csc-navy">
                Service Applied & Payment
              </span>
              <p><span className="text-slate-500">Service / Biller:</span> <strong className="text-slate-900">{title}</strong></p>
              <p><span className="text-slate-500">Department:</span> <strong className="text-slate-900">Revenue / BBPS Assam Portal</strong></p>
              <p><span className="text-slate-500">Payment Gateway:</span> <strong className="text-emerald-700 font-bold">{application.paymentMethod || 'Live PhonePe PG'}</strong></p>
              {application.bbpsRefNo && <p><span className="text-slate-500">BBPS Ref No:</span> <strong className="text-slate-900 font-mono">{application.bbpsRefNo}</strong></p>}
              {application.operatorRef && <p><span className="text-slate-500">Operator Ref:</span> <strong className="text-slate-900 font-mono">{application.operatorRef}</strong></p>}
            </div>
          </div>

          {/* Fee Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Fee Particulars</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {application.board ? (
                  <tr>
                    <td className="p-2.5 text-slate-700">APDCL Electricity Recharge Amount</td>
                    <td className="p-2.5 text-right font-medium">₹{amount}.00</td>
                  </tr>
                ) : (
                  <>
                    <tr>
                      <td className="p-2.5 text-slate-700">Assam Government Service Statutory Fee</td>
                      <td className="p-2.5 text-right font-medium">₹{application.govtFee || 30}.00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700">CSC Portal Processing & Operator Facilitation Charge</td>
                      <td className="p-2.5 text-right font-medium">₹{application.cscFee || 50}.00</td>
                    </tr>
                  </>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2.5 text-slate-900">Total Fee Paid (Receipt Cleared)</td>
                  <td className="p-2.5 text-right text-csc-navy text-sm">₹{amount}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Authorization Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Instructions for Citizen:</p>
              <p>1. Track status online anytime at: <span className="font-mono text-csc-navy font-bold">https://rajibcsc.rzdigitalstudio.in</span></p>
              <p>2. Keep this acknowledgment slip for physical document verification at Lakhimpur Circle Office if requested.</p>
            </div>

            <div className="text-center shrink-0">
              <div className="w-24 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] font-bold text-slate-400 mb-1">
                SEAL & STAMP
              </div>
              <span className="font-bold text-slate-800 block">Rajib CSC Operator</span>
              <span className="text-[10px] text-slate-500">North Lakhimpur Center</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-100 rounded-b-2xl border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={handleWhatsAppSend}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Receipt to WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 bg-csc-navy hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl shadow transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

