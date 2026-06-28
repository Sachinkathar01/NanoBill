import dotenv from "dotenv";
dotenv.config();

/**
 * Dispatches a WhatsApp billing notice to a client.
 * In production, you would configure this to hit Twilio WhatsApp API, Wati, or Gupshup.
 */
export const sendWhatsAppReminder = async (
    clientPhone: string,
    clientName: string,
    invoiceNumber: string,
    amount: string,
    dueDate: string,
    paymentUrl: string | null,
    type: "new_invoice" | "upcoming" | "due_today" | "overdue"
): Promise<boolean> => {
    try {
        if (!clientPhone) {
            console.log(`[WHATSAPP SERVICE] Skipping WhatsApp reminder for Invoice #${invoiceNumber}. No phone number.`);
            return false;
        }

        // Format message template
        let message = "";
        if (type === "new_invoice") {
            message = `Hello ${clientName}, a new Invoice #${invoiceNumber} for ₹${amount} has been generated, due on ${dueDate}. Secure checkout link: ${paymentUrl || "N/A"}`;
        } else if (type === "upcoming") {
            message = `Hello ${clientName}, this is a friendly reminder that Invoice #${invoiceNumber} for ₹${amount} is due tomorrow (${dueDate}). Please pay here: ${paymentUrl || "N/A"}`;
        } else if (type === "due_today") {
            message = `Hello ${clientName}, Invoice #${invoiceNumber} for ₹${amount} is due today. You can pay securely here: ${paymentUrl || "N/A"}`;
        } else {
            message = `URGENT: Hello ${clientName}, Invoice #${invoiceNumber} for ₹${amount} was due on ${dueDate} and is now OVERDUE. Please pay immediately to avoid service disruption: ${paymentUrl || "N/A"}`;
        }

        console.log(`[WHATSAPP SERVICE] [SIMULATION] Sending to ${clientPhone}: "${message}"`);

        // PRODUCTION IMPLEMENTATION (e.g., using Twilio):
        /*
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+14155238886'
        
        if (accountSid && authToken && fromWhatsApp) {
            const twilio = require('twilio');
            const client = twilio(accountSid, authToken);
            
            await client.messages.create({
                body: message,
                from: fromWhatsApp,
                to: `whatsapp:${clientPhone.startsWith('+') ? clientPhone : '+91' + clientPhone}`
            });
            console.log(`[WHATSAPP SERVICE] Successfully dispatched Twilio WhatsApp msg to ${clientPhone}`);
            return true;
        }
        */

        return true;
    } catch (error) {
        console.error("[WHATSAPP SERVICE] Failed to send WhatsApp reminder:", error);
        return false;
    }
};
