/**
 * Dispatches a WhatsApp billing notice to a client.
 * In production, you would configure this to hit Twilio WhatsApp API, Wati, or Gupshup.
 */
export declare const sendWhatsAppReminder: (clientPhone: string, clientName: string, invoiceNumber: string, amount: string, dueDate: string, paymentUrl: string | null, type: "new_invoice" | "upcoming" | "due_today" | "overdue") => Promise<boolean>;
//# sourceMappingURL=whatsappService.d.ts.map