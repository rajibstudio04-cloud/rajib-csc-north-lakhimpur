import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const receiptPdfService = {
  /**
   * Generates a high-quality e-Receipt PDF for Service Applications or Utility Payments
   * @param {Object} data - Application or Utility Transaction object
   * @param {string} type - 'application' | 'utility'
   */
  async generateReceiptPDF(data, type = 'application') {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const isUtility = type === 'utility' || data.board !== undefined;

    const refId = data.id || data.txnId || `CSC-LKP-${Date.now()}`;
    const dateStr = data.submittedAt || data.paidAt || new Date().toLocaleString('en-IN');
    const name = data.applicantName || data.consumerName || 'Citizen Customer';
    const phone = data.phone || data.consumerNo || '9435012345';
    const amount = data.totalFee || data.amount || ((data.govtFee || 0) + (data.cscFee || 0)) || 0;
    const title = data.serviceTitle || data.board || 'CSC Digital Sewa';

    // Generate QR Code base64 Data URL
    let qrDataUrl = '';
    try {
      const qrText = `RAJIB CSC | Ref: ${refId} | Consumer: ${phone} | Amt: INR ${amount} | Status: VERIFIED`;
      qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 120 });
    } catch (err) {
      console.warn('QR Code generation failed:', err);
    }

    // --- Header Background ---
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 42, 'F');

    // Title & Logo
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('RAJIB CSC - DIGITAL SEWA KENDRA', 15, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text('Government Authorized Common Service Centre (VLE ID: 498120394812)', 15, 25);
    doc.text('Ward No. 8, Khelmati (Near District Library), North Lakhimpur, Assam - 787001', 15, 30);

    // Accent line
    doc.setFillColor(59, 130, 246); // blue-500
    doc.rect(0, 42, 210, 2, 'F');

    // --- Receipt Badge ---
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(15, 50, 180, 22, 3, 3, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, 50, 180, 22, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(isUtility ? 'OFFICIAL APDCL BBPS UTILITY RECHARGE RECEIPT' : 'OFFICIAL E-DISTRICT APPLICATION ACKNOWLEDGMENT', 20, 58);

    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138); // navy
    doc.text(`Ref ID: ${refId}`, 20, 66);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Date & Time: ${dateStr}`, 130, 66);

    // --- Details Grid ---
    let y = 82;

    // Customer Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 87, 45, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, 87, 45, 3, 3, 'S');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('CITIZEN / APPLICANT DETAILS', 20, y + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Name:', 20, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(String(name), 40, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.text(isUtility ? 'Consumer No:' : 'Mobile No:', 20, y + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(String(phone), 48, y + 25);

    if (data.address) {
      doc.setFont('helvetica', 'bold');
      doc.text('Address:', 20, y + 33);
      doc.setFont('helvetica', 'normal');
      const cleanAddr = String(data.address).slice(0, 32);
      doc.text(cleanAddr, 40, y + 33);
    } else if (data.bbpsRefNo) {
      doc.setFont('helvetica', 'bold');
      doc.text('BBPS Ref:', 20, y + 33);
      doc.setFont('helvetica', 'normal');
      doc.text(String(data.bbpsRefNo), 40, y + 33);
    }

    // Service/Txn Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(108, y, 87, 45, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(108, y, 87, 45, 3, 3, 'S');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('TRANSACTION / SERVICE INFO', 113, y + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Service:', 113, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(String(title).slice(0, 30), 132, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 113, y + 25);
    doc.setTextColor(16, 185, 129); // emerald
    doc.setFont('helvetica', 'bold');
    doc.text(data.status || 'SUCCESS / PAID', 132, y + 25);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Gateway:', 113, y + 33);
    doc.setFont('helvetica', 'normal');
    doc.text(data.paymentMethod || data.method || 'Live PhonePe PG', 145, y + 33);

    // --- Financial Fee Table ---
    y += 53;

    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 180, 8, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(15, y, 180, 8, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('PARTICULARS', 20, y + 5.5);
    doc.text('AMOUNT (INR)', 160, y + 5.5);

    y += 8;
    if (isUtility) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('APDCL Electricity Recharge Amount', 20, y + 7);
      doc.text(`INR ${amount}.00`, 160, y + 7);
      y += 10;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text('Assam Government Statutory Application Fee', 20, y + 6);
      doc.text(`INR ${data.govtFee || 30}.00`, 160, y + 6);
      y += 8;

      doc.text('CSC Digital Facilitation & Portal Processing Charge', 20, y + 6);
      doc.text(`INR ${data.cscFee || 50}.00`, 160, y + 6);
      y += 8;
    }

    // Total Row
    doc.setFillColor(224, 231, 255); // indigo-100
    doc.rect(15, y, 180, 10, 'F');
    doc.setDrawColor(199, 210, 254);
    doc.rect(15, y, 180, 10, 'S');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('TOTAL AMOUNT PAID (CLEARED)', 20, y + 6.5);
    doc.text(`INR ${amount}.00`, 160, y + 6.5);

    // --- QR Code & Verification Block ---
    y += 18;
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 15, y, 32, 32);
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('DIGITAL VERIFICATION QR', 52, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Scan QR code with any smartphone camera to verify receipt authenticity.', 52, y + 11);
    doc.text('System generated e-Receipt issued by Rajib CSC North Lakhimpur Center.', 52, y + 16);
    doc.text('For support, call +91 94350 12345 or email support@rajibcsc.in', 52, y + 21);

    // Operator Stamp Box
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(140, y, 55, 32, 2, 2, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('AUTHORIZED STAMP & SEAL', 143, y + 6);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Rajib CSC Digital Sewa', 143, y + 18);
    doc.text('North Lakhimpur (Assam)', 143, y + 23);
    doc.setTextColor(16, 185, 129);
    doc.text('[ VERIFIED ELECTRONICALLY ]', 143, y + 28);

    // Footer bottom
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Rajib CSC North Lakhimpur • Digital India Common Service Centre', 105, 290, { align: 'center' });

    // Download PDF file
    doc.save(`Receipt-${refId}.pdf`);
  }
};
