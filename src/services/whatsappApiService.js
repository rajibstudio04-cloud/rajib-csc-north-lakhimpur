// WhatsApp Cloud API & Twilio Messaging Webhook Integration Service

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER || '919435012345';
const WHATSAPP_CLOUD_API_TOKEN = import.meta.env.VITE_WHATSAPP_CLOUD_API_TOKEN || null;
const WHATSAPP_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || null;
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || null;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || null;

export const whatsappApiService = {
  // Send automated WhatsApp alert using WhatsApp Cloud API (Graph API) or Twilio Webhook
  async sendAutomatedWhatsAppAlert(appData) {
    const alertMessage = 
      `🚨 *NEW APPLICATION SUBMITTED AT RAJIB CSC*\n\n` +
      `📌 *Ref ID:* ${appData.id}\n` +
      `👤 *Citizen Name:* ${appData.applicantName}\n` +
      `📞 *Mobile:* +91 ${appData.phone}\n` +
      `📄 *Service:* ${appData.serviceTitle}\n` +
      `📍 *Location:* ${appData.address}, ${appData.panchayat || 'Lakhimpur'}\n` +
      `📁 *Uploaded Docs:* ${appData.documents ? appData.documents.length : 0} files\n` +
      `💰 *Total Fee:* ₹${appData.totalFee}\n\n` +
      `🔗 Open Operator Dashboard: https://rajibcsc.rzdigitalstudio.in/admin`;

    // 1. WhatsApp Cloud API Integration (Graph API endpoint)
    if (WHATSAPP_CLOUD_API_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_CLOUD_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: ADMIN_PHONE,
            type: 'text',
            text: { body: alertMessage }
          })
        });
        const json = await response.json();
        console.log('[WhatsApp Cloud API Alert Response]:', json);
        return { success: true, api: 'WhatsApp Cloud API', result: json };
      } catch (err) {
        console.warn('[WhatsApp Cloud API Error]:', err);
      }
    }

    // 2. Twilio Programmable Messaging API Integration
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      try {
        const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
        const bodyParams = new URLSearchParams({
          From: 'whatsapp:+14155238886',
          To: `whatsapp:+${ADMIN_PHONE}`,
          Body: alertMessage
        });

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams.toString()
        });
        const json = await response.json();
        console.log('[Twilio WhatsApp API Response]:', json);
        return { success: true, api: 'Twilio API', result: json };
      } catch (err) {
        console.warn('[Twilio WhatsApp API Error]:', err);
      }
    }

    // Fallback: Log payload & prepare direct click URL
    console.log('[WhatsApp API Placeholder] Dispatching alert message to Admin +91 ' + ADMIN_PHONE);
    return {
      success: true,
      api: 'Direct Webhook Link',
      directUrl: `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(alertMessage)}`
    };
  }
};
