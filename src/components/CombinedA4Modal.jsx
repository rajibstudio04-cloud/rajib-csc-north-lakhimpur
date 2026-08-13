import React, { useState } from 'react';
import {
  X, Download, ShieldCheck, FileText, CheckCircle2,
  Layers, Square, ChevronLeft, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { jsPDF } from 'jspdf';

/* ─────────────────────────────────────────────
   Helper: draw one A4 page (front or back only)
   ───────────────────────────────────────────── */
const buildSinglePagePDF = ({ docTitle, applicantName, phone, refId, side, doc }) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.8);
  pdf.rect(6, 6, 198, 285);
  pdf.setFillColor(15, 23, 42);
  pdf.rect(6, 6, 198, 26, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RAJIB CSC DIGITAL SEVA KENDRA', 105, 15, { align: 'center' });
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('North Lakhimpur, Assam - 787001 | VLE ID: 498120394812 | Mobile: +91 94350 12345', 105, 22, { align: 'center' });
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${String(docTitle).toUpperCase()} — ${side === 'front' ? 'FRONT SIDE' : 'BACK SIDE'}`, 12, 40);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Applicant: ${applicantName || 'N/A'}`, 12, 47);
  pdf.text(`Mobile: +91 ${phone || 'N/A'}`, 12, 52);
  if (refId) pdf.text(`Ref ID: ${refId}`, 135, 47);
  pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 135, 52);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(12, 56, 198, 56);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  const label = side === 'front'
    ? '1. FRONT SIDE (সকলো প্ৰমান পত্ৰ - সন্মুখৰ ভাগ)'
    : '2. BACK SIDE (সকলো প্ৰমান পত্ৰ - পিছফালৰ ভাগ)';
  pdf.text(label, 12, 63);
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(12, 67, 186, 200);
  if (doc?.url && (doc.url.startsWith('data:image') || doc.url.startsWith('blob:'))) {
    try { pdf.addImage(doc.url, 'JPEG', 15, 69, 180, 195, undefined, 'FAST'); }
    catch { pdf.setFontSize(9); pdf.text(doc.name || `${side === 'front' ? 'Front' : 'Back'} Side Document`, 105, 167, { align: 'center' }); }
  } else {
    pdf.setFillColor(248, 250, 252);
    pdf.rect(13, 68, 184, 198, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(doc?.name || `${side === 'front' ? 'Front' : 'Back'} Side Document Attached`, 105, 167, { align: 'center' });
  }
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Digitally Verified & Stored at Rajib CSC Digital Seva Kendra North Lakhimpur.', 105, 282, { align: 'center' });
  pdf.text(`Page 1 of 1 | ${side === 'front' ? 'Front Side' : 'Back Side'} A4 Sheet`, 105, 286, { align: 'center' });
  return pdf;
};

/* ─────────────────────────────────────────────
   Helper: build combined 2-in-1 A4 PDF
   ───────────────────────────────────────────── */
const buildCombinedPDF = ({ docTitle, applicantName, phone, refId, frontDoc, backDoc }) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.8);
  pdf.rect(6, 6, 198, 285);
  pdf.setFillColor(15, 23, 42);
  pdf.rect(6, 6, 198, 26, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RAJIB CSC DIGITAL SEVA KENDRA', 105, 15, { align: 'center' });
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('North Lakhimpur, Assam - 787001 | VLE ID: 498120394812 | Mobile: +91 94350 12345', 105, 22, { align: 'center' });
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(docTitle).toUpperCase(), 12, 40);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Applicant Name: ${applicantName || 'N/A'}`, 12, 47);
  pdf.text(`Mobile Contact: +91 ${phone || 'N/A'}`, 12, 52);
  if (refId) pdf.text(`Ref / App ID: ${refId}`, 135, 47);
  pdf.text(`Verification Date: ${new Date().toLocaleDateString('en-IN')}`, 135, 52);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(12, 56, 198, 56);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text('1. FRONT SIDE (সকলো প্ৰমান পত্ৰ - সন্মুখৰ ভাগ)', 12, 63);
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(12, 66, 186, 95);
  if (frontDoc?.url && (frontDoc.url.startsWith('data:image') || frontDoc.url.startsWith('blob:'))) {
    try { pdf.addImage(frontDoc.url, 'JPEG', 15, 68, 180, 91, undefined, 'FAST'); }
    catch { pdf.setFontSize(9); pdf.text(frontDoc.name || 'Front Side Document', 105, 113, { align: 'center' }); }
  } else {
    pdf.setFillColor(248, 250, 252);
    pdf.rect(13, 67, 184, 93, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(frontDoc?.name || 'Front Side Document File Attached', 105, 113, { align: 'center' });
  }
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text('2. BACK SIDE (সকলো প্ৰমান পত্ৰ - পিছফালৰ ভাগ)', 12, 172);
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(12, 175, 186, 95);
  if (backDoc?.url && (backDoc.url.startsWith('data:image') || backDoc.url.startsWith('blob:'))) {
    try { pdf.addImage(backDoc.url, 'JPEG', 15, 177, 180, 91, undefined, 'FAST'); }
    catch { pdf.setFontSize(9); pdf.text(backDoc.name || 'Back Side Document', 105, 222, { align: 'center' }); }
  } else {
    pdf.setFillColor(248, 250, 252);
    pdf.rect(13, 176, 184, 93, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(backDoc?.name || 'Back Side Document File Attached', 105, 222, { align: 'center' });
  }
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Digitally Verified & Stored at Rajib CSC Digital Seva Kendra North Lakhimpur.', 105, 282, { align: 'center' });
  pdf.text('Page 1 of 1 (Standard A4 Combined View Sheet)', 105, 286, { align: 'center' });
  return pdf;
};

export const CombinedA4Modal = ({
  isOpen,
  onClose,
  title = 'Address Proof',
  applicantName = 'Citizen Customer',
  phone = '',
  refId = '',
  frontDoc = null,
  backDoc = null
}) => {
  const [tab, setTab] = useState(backDoc ? 'combined' : 'front');
  const [previewVisible, setPreviewVisible] = useState(true);

  // When backDoc changes (modal reused), reset tab
  React.useEffect(() => {
    setTab(backDoc ? 'combined' : 'front');
  }, [backDoc, isOpen]);

  if (!isOpen) return null;

  const docTitle = title || 'Official Attachment';
  const safe = (s) => String(s).replace(/[^a-zA-Z0-9]/g, '_');

  /* ── Download handlers ── */
  const downloadCombined = () => {
    try {
      buildCombinedPDF({ docTitle, applicantName, phone, refId, frontDoc, backDoc })
        .save(`${safe(docTitle)}_Combined_A4.pdf`);
    } catch (err) { console.error(err); alert('Could not generate PDF.'); }
  };
  const downloadFront = () => {
    try {
      buildSinglePagePDF({ docTitle, applicantName, phone, refId, side: 'front', doc: frontDoc })
        .save(`${safe(docTitle)}_Front_Side_A4.pdf`);
    } catch (err) { console.error(err); alert('Could not generate PDF.'); }
  };
  const downloadBack = () => {
    try {
      buildSinglePagePDF({ docTitle, applicantName, phone, refId, side: 'back', doc: backDoc })
        .save(`${safe(docTitle)}_Back_Side_A4.pdf`);
    } catch (err) { console.error(err); alert('Could not generate PDF.'); }
  };

  /* ── Sub-components ── */
  const DocImage = ({ doc, label }) => (
    <div
      className="border-2 border-slate-300 rounded-xl p-2 bg-slate-50 flex items-center justify-center overflow-hidden"
      style={{ minHeight: tab === 'combined' ? '260px' : '420px', maxHeight: tab === 'combined' ? '370px' : '560px' }}
    >
      {doc?.url && (doc.url.startsWith('data:image') || doc.url.startsWith('blob:')) ? (
        <img src={doc.url} alt={label} className="max-h-full w-auto object-contain rounded-lg shadow-sm" />
      ) : (
        <div className="text-center space-y-2 p-8">
          <FileText className="w-14 h-14 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-slate-700">{doc?.name || label}</p>
          <p className="text-[10px] text-slate-500">Document File Attached</p>
        </div>
      )}
    </div>
  );

  const PaperHeader = () => (
    <div className="bg-slate-900 text-white p-4 rounded-xl text-center space-y-1 shadow">
      <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase">RAJIB CSC DIGITAL SEVA KENDRA</h1>
      <p className="text-[11px] text-cyan-300 font-bold">
        North Lakhimpur, Assam - 787001 | VLE ID: 498120394812 | Mob: +91 94350 12345
      </p>
    </div>
  );

  const PaperMeta = ({ badge }) => (
    <div className="border-b-2 border-slate-300 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
      <div>
        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 block w-max mb-1">{badge}</span>
        <h2 className="text-base font-extrabold text-slate-900 uppercase">{docTitle}</h2>
        <p className="text-slate-600 font-medium text-[11px] mt-0.5">
          Citizen: <strong className="text-slate-900">{applicantName}</strong> {phone ? `(+91 ${phone})` : ''}
        </p>
      </div>
      <div className="text-left sm:text-right font-mono text-[11px] text-slate-600">
        {refId && <p className="font-bold text-slate-900">Ref ID: {refId}</p>}
        <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
      </div>
    </div>
  );

  const PaperFooter = () => (
    <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-medium">
      <span className="flex items-center gap-1 text-emerald-700 font-bold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Digitally Stored &amp; Verified at Rajib CSC Lakhimpur
      </span>
      <span>A4 Paper Standard View</span>
    </div>
  );

  const SectionLabel = ({ num, label, size }) => (
    <div className="flex justify-between items-center">
      <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-3 py-1 rounded-md border border-slate-300">
        {num}. {label}
      </span>
      <span className="text-[10px] text-slate-500 font-mono">{size || 'Verified Document'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full text-white shadow-2xl border border-slate-800 flex flex-col max-h-[95vh] overflow-hidden">

        {/* ── Top Header ── */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
              Official A4 Paper — View &amp; Download
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewVisible(v => !v)}
              title={previewVisible ? 'Hide Preview' : 'Show Preview'}
              className="text-slate-400 hover:text-cyan-300 p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {previewVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Tab Switcher + Quick Download ── */}
        <div className="px-4 pt-3 pb-0 bg-slate-950 shrink-0">
          <div className="flex gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800 w-full sm:w-max">
            {[
              { id: 'combined', label: '📄 Combined A4',   active: 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30',   inactive: 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800' },
              { id: 'front',    label: '🟣 Front Side',    active: 'bg-violet-500 text-white shadow-lg shadow-violet-500/30', inactive: 'text-slate-400 hover:text-violet-300 hover:bg-slate-800' },
              { id: 'back',     label: '🟠 Back Side',     active: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',   inactive: 'text-slate-400 hover:text-amber-300 hover:bg-slate-800' },
            ].filter(t => backDoc ? true : (t.id === 'front')).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-none ${tab === t.id ? t.active : t.inactive}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick download under tabs */}
          <div className="flex gap-2 py-3">
            {tab === 'combined' && (
              <button onClick={downloadCombined} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2 px-4 rounded-xl shadow-lg transition-all cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download Combined A4 PDF
              </button>
            )}
            {tab === 'front' && (
              <button onClick={downloadFront} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold py-2 px-4 rounded-xl shadow-lg transition-all cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download Front Side A4 PDF
              </button>
            )}
            {tab === 'back' && (
              <button onClick={downloadBack} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-extrabold py-2 px-4 rounded-xl shadow-lg transition-all cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download Back Side A4 PDF
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable A4 Preview ── */}
        {previewVisible && (
          <div className="flex-1 overflow-y-auto px-4 pb-4 bg-slate-950 flex justify-center">

            {/* ════ COMBINED TAB ════ */}
            {tab === 'combined' && (
              <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 shadow-2xl border border-slate-300 rounded-xl space-y-5 font-sans select-none">
                <PaperHeader />
                <PaperMeta badge="OFFICIAL ATTACHMENT — COMBINED A4 SHEET" />
                <div className="space-y-2">
                  <SectionLabel num="1" label="FRONT SIDE (সন্মুখৰ ভাগ)" size={frontDoc?.size} />
                  <DocImage doc={frontDoc} label="Front Side Document" />
                </div>
                <div className="space-y-2 pt-2">
                  <SectionLabel num="2" label="BACK SIDE (পিছফালৰ ভাগ)" size={backDoc?.size} />
                  <DocImage doc={backDoc} label="Back Side Document" />
                </div>
                <PaperFooter />
              </div>
            )}

            {/* ════ FRONT SIDE TAB ════ */}
            {tab === 'front' && (
              <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 shadow-2xl border border-slate-300 rounded-xl space-y-5 font-sans select-none">
                <PaperHeader />
                <PaperMeta badge="FRONT SIDE — SINGLE A4 SHEET" />
                <div className="space-y-2">
                  <SectionLabel num="1" label="FRONT SIDE (সন্মুখৰ ভাগ)" size={frontDoc?.size} />
                  <DocImage doc={frontDoc} label="Front Side Document" />
                </div>
                <PaperFooter />
              </div>
            )}

            {/* ════ BACK SIDE TAB ════ */}
            {tab === 'back' && (
              <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 shadow-2xl border border-slate-300 rounded-xl space-y-5 font-sans select-none">
                <PaperHeader />
                <PaperMeta badge="BACK SIDE — SINGLE A4 SHEET" />
                <div className="space-y-2">
                  <SectionLabel num="2" label="BACK SIDE (পিছফালৰ ভাগ)" size={backDoc?.size} />
                  <DocImage doc={backDoc} label="Back Side Document" />
                </div>
                <PaperFooter />
              </div>
            )}

          </div>
        )}

        {/* ── Bottom Controls Bar ── */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-xs text-slate-400 font-medium text-center sm:text-left">
            {!backDoc && '📄 Single Document — A4 Sheet View'}
            {backDoc && tab === 'combined' && '📄 Combined Front & Back — A4 Sheet View'}
            {backDoc && tab === 'front'    && '🟣 Front Side Only — Single A4 Sheet'}
            {backDoc && tab === 'back'     && '🟠 Back Side Only — Single A4 Sheet'}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-center sm:justify-end">
            {backDoc && (
              <button
                onClick={() => { downloadFront(); setTimeout(downloadBack, 400); setTimeout(downloadCombined, 800); }}
                className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-600 transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />
                Download All 3 PDFs
              </button>
            )}
            <button
              onClick={tab === 'combined' ? downloadCombined : tab === 'front' ? downloadFront : downloadBack}
              className={`flex items-center gap-1.5 text-white text-xs font-extrabold py-2.5 px-5 rounded-xl shadow-lg transition-all cursor-pointer
                ${tab === 'combined' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  tab === 'front'    ? 'bg-violet-600 hover:bg-violet-500' :
                                       'bg-amber-500 hover:bg-amber-400'}`}
            >
              <Download className="w-4 h-4" />
              {tab === 'combined' && 'Download Combined PDF'}
              {(tab === 'front' || !backDoc) && 'Download A4 PDF'}
              {tab === 'back' && backDoc && 'Download Back Side PDF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};


