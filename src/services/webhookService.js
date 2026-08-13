// Webhook & WhatsApp Alert Notification Service
// Sends webhook payloads to configured backend endpoints and constructs WhatsApp alert URLs

const ADMIN_WHATSAPP_NUMBER = '919435012345';
const DEFAULT_WEBHOOK_URL = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL || null;

export const webhookService = {
  // Send Webhook payload to external server/API endpoint
  async sendWebhookNotification(event, payload) {
    if (!DEFAULT_WEBHOOK_URL) {
      console.log(`[Webhook Placeholder] Event: "${event}". No endpoint defined in VITE_WHATSAPP_WEBHOOK_URL. Payload:`, payload);
      return { success: true, simulated: true };
    }

    try {
      const response = await fetch(DEFAULT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RajibCSC-Event': event
        },
        body: JSON.stringify({
          event,
          timestamp: new Date().toISOString(),
          data: payload
        })
      });
      return await response.json();
    } catch (error) {
      console.warn('[Webhook Error] Failed to reach webhook endpoint:', error);
      return { success: false, error: error.message };
    }
  },

  // Generate Admin WhatsApp alert link upon new citizen application
  getAdminAlertWhatsAppLink(app) {
    const text = `🚨 *NEW CSC APPLICATION RECEIVED*\n\n` +
      `📌 *Ref ID:* ${app.id}\n` +
      `👤 *Applicant:* ${app.applicantName}\n` +
      `📞 *Phone:* +91 ${app.phone}\n` +
      `📄 *Service:* ${app.serviceTitle}\n` +
      `📍 *Address:* ${app.address}, ${app.panchayat || 'Lakhimpur'}\n` +
      `📁 *Files Uploaded:* ${app.documents ? app.documents.length : 0} files\n` +
      `💰 *Total Fee:* ₹${app.totalFee}\n\n` +
      `👉 Manage in Operator Portal: https://rajibcsc.rzdigitalstudio.in/admin`;

    return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  },

  // Generate Citizen WhatsApp update link
  getCitizenUpdateWhatsAppLink(app, newStatus, remarks) {
    const text = `Hello ${app.applicantName},\n\n` +
      `Your application (*${app.id}*) for *${app.serviceTitle}* at Rajib CSC Lakhimpur has been updated:\n\n` +
      `STATUS: *${newStatus}*\n` +
      `REMARKS: ${remarks || 'Document under verification by government authorities.'}\n\n` +
      `Track live status anytime at: https://rajibcsc.rzdigitalstudio.in/track-status`;

    return `https://wa.me/91${app.phone}?text=${encodeURIComponent(text)}`;
  }
};
