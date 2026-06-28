import { InvoiceServices } from "../services/invoiceService.js";
import { generatePDFBuffer } from "../utils/pdfGenerator.js";
import { uploadToCloudinary, getSignedCloudinaryUrl } from "../utils/cloudinaryUtil.js";
import { generatePaymentLink } from "../utils/paymentUtil.js";
import { sendReminderEmail } from "../services/emailService.js";
import { sendWhatsAppReminder } from "../services/whatsappService.js";
import pool from "../config/db.js";
export const createInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { client_id, client_name, client_email, client_phone, client_address, invoice_number, due_date, tax_amount, total_amount, notes, items } = req.body;
        if ((!client_id && !client_name) || !invoice_number || !total_amount || !items || items.length === 0) {
            res.status(400).json({ message: "Missing required invoice fields." });
            return;
        }
        // 1. Create invoice in database
        const invoice = await InvoiceServices.createInvoice(userId, client_id, client_name, client_email, client_phone, client_address, invoice_number, due_date, tax_amount, total_amount, notes, items);
        // 2. Fetch full client info to generate payment link
        const clientRes = await pool.query("SELECT name, email, phone FROM clients WHERE id = $1", [invoice.client_id]);
        const client = clientRes.rows[0];
        // 3. Generate payment link automatically in the background
        try {
            const paymentLinkResponse = await generatePaymentLink(parseFloat(invoice.total_amount), invoice.invoice_number, client.name, client.email || "", client.phone || "");
            // 4. Save payment link to invoice
            await InvoiceServices.updateInvoicePaymentLink(invoice.id, userId, paymentLinkResponse.short_url || "", paymentLinkResponse.id || "");
            invoice.payment_url = paymentLinkResponse.short_url || "";
            invoice.payment_link_id = paymentLinkResponse.id || "";
            // 5. Fetch user notification preferences
            const userRes = await pool.query("SELECT reminder_email_enabled, reminder_whatsapp_enabled FROM users WHERE id = $1", [userId]);
            if (userRes.rows.length > 0) {
                const userPrefs = userRes.rows[0];
                const dueDateFormatted = invoice.due_date ? (new Date(invoice.due_date).toISOString().split('T')[0] || "") : "";
                // Send immediate email if configured
                if (userPrefs.reminder_email_enabled && client.email) {
                    await sendReminderEmail(client.email, client.name, invoice.invoice_number, invoice.total_amount, dueDateFormatted, paymentLinkResponse.short_url || null, "new_invoice");
                }
                // Send immediate WhatsApp if configured
                if (userPrefs.reminder_whatsapp_enabled && client.phone) {
                    await sendWhatsAppReminder(client.phone, client.name, invoice.invoice_number, invoice.total_amount, dueDateFormatted, paymentLinkResponse.short_url || null, "new_invoice");
                }
            }
        }
        catch (linkErr) {
            console.error("Auto-payment link or notification dispatch failed:", linkErr.message);
        }
        res.status(201).json({ invoice });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error creating invoice" });
    }
};
export const getInvoices = async (req, res) => {
    try {
        const userId = req.user.id;
        await InvoiceServices.reconcilePaymentStatuses(userId);
        const invoices = await InvoiceServices.getInvoicesByUser(userId);
        res.status(200).json({ invoices });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const getInvoiceById = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const invoice = await InvoiceServices.getInvoiceDetails(id, userId);
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }
        res.status(200).json({ invoice });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const updateInvoiceStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const { status } = req.body;
        const updated = await InvoiceServices.updateInvoiceStatus(id, userId, status);
        if (!updated) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }
        res.status(200).json({ invoice: updated });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const generateInvoicePdf = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        // Fetch full user data to allow them to map their brand_name, etc in the future
        const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (userRes.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const user = userRes.rows[0];
        const invoice = await InvoiceServices.getInvoiceDetails(id, userId);
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }
        const pdfBuffer = await generatePDFBuffer({ user, invoice });
        // Bypass Cloudinary strict PDF restrictions completely. Serve file stream natively from local Node memory.
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoice.invoice_number}.pdf"`);
        res.send(pdfBuffer);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error generating PDF" });
    }
};
export const generateInvoicePaymentLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const invoice = await InvoiceServices.getInvoiceDetails(id, userId);
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }
        const paymentLinkResponse = await generatePaymentLink(parseFloat(invoice.total_amount), invoice.invoice_number, invoice.client_name, invoice.client_email, invoice.client_phone);
        const updatedInvoice = await InvoiceServices.updateInvoicePaymentLink(id, userId, paymentLinkResponse.short_url || "", paymentLinkResponse.id || "");
        res.status(200).json({
            message: "Payment Link Generated Successfully",
            payment_url: updatedInvoice.payment_url
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error generating Payment Link" });
    }
};
//# sourceMappingURL=invoiceController.js.map