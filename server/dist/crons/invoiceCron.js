import cron from "node-cron";
import pool from "../config/db.js";
import { sendReminderEmail } from "../services/emailService.js";
import { sendWhatsAppReminder } from "../services/whatsappService.js";
import { generatePaymentLink } from "../utils/paymentUtil.js";
// Run every day at 08:00 AM (server local time)
export const initCronJobs = () => {
    // pattern specifies: Minute | Hour | Day of Month | Month | Day of Week
    cron.schedule("0 8 * * *", async () => {
        console.log("[CRON] Executing automated SaaS billing alert routines...");
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // --- 1. PROCESS OVERDUE TRANSITIONS & APPLY 1.5% LATE FEE ---
            // Transition any invoice whose due date is in the past to 'Overdue' status and add 1.5% late fee.
            const transitionOverdueQuery = `
                UPDATE invoices 
                SET status = 'Overdue',
                    total_amount = total_amount * 1.015,
                    notes = CONCAT(notes, E'\r\n[SYSTEM] A 1.5% late fee penalty (1.5% interest) has been applied to this payment.')
                WHERE due_date < CURRENT_DATE 
                AND status IN ('Sent', 'Draft')
                RETURNING id, invoice_number, total_amount;
            `;
            const { rows: transitioned } = await client.query(transitionOverdueQuery);
            for (const invoice of transitioned) {
                console.log(`[CRON] Transitioned Invoice #${invoice.invoice_number} to 'Overdue' and applied 1.5% late fee. New Total: ₹${invoice.total_amount}`);
                // Regenerate payment link to match the updated total_amount with late fee
                try {
                    const clientInfoRes = await client.query(`
                        SELECT c.name, c.email, c.phone
                        FROM invoices i
                        JOIN clients c ON i.client_id = c.id
                        WHERE i.id = $1
                    `, [invoice.id]);
                    if (clientInfoRes.rows.length > 0) {
                        const { name, email, phone } = clientInfoRes.rows[0];
                        const paymentLinkResponse = await generatePaymentLink(parseFloat(invoice.total_amount), invoice.invoice_number, name, email || "", phone || "");
                        // Save the new payment link to invoice
                        await client.query("UPDATE invoices SET payment_url = $1, payment_link_id = $2 WHERE id = $3", [paymentLinkResponse.short_url, paymentLinkResponse.id, invoice.id]);
                    }
                }
                catch (linkErr) {
                    console.error(`[CRON] Failed to regenerate payment link with late fee for Invoice #${invoice.invoice_number}:`, linkErr.message);
                }
            }
            // --- 2. FETCH ACTIVE INVOICES NEEDING REMINDERS ---
            // We fetch invoices along with client details and user notification settings.
            const fetchRemindersQuery = `
                SELECT 
                    i.id as invoice_id, 
                    i.invoice_number, 
                    i.total_amount, 
                    i.due_date,
                    i.payment_url,
                    i.status,
                    i.reminders_sent_count,
                    i.last_reminder_sent_at,
                    c.name as client_name, 
                    c.email as client_email,
                    c.phone as client_phone,
                    u.reminder_email_enabled,
                    u.reminder_whatsapp_enabled
                FROM invoices i
                JOIN clients c ON i.client_id = c.id
                JOIN users u ON i.user_id = u.id
                WHERE i.status IN ('Sent', 'Draft', 'Overdue')
            `;
            const { rows: activeInvoices } = await client.query(fetchRemindersQuery);
            for (const invoice of activeInvoices) {
                const dueDate = new Date(invoice.due_date);
                const today = new Date();
                // Reset times for accurate day difference calculations
                dueDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                const timeDiff = dueDate.getTime() - today.getTime();
                const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Days until due date
                let reminderType = null;
                if (dayDiff === 1) {
                    // Due tomorrow
                    reminderType = "upcoming";
                }
                else if (dayDiff === 0) {
                    // Due today
                    reminderType = "due_today";
                }
                else if (dayDiff < 0) {
                    // Overdue. We send reminders:
                    // - On the day it becomes overdue (first day)
                    // - Every 3 days thereafter
                    const lastSent = invoice.last_reminder_sent_at ? new Date(invoice.last_reminder_sent_at) : null;
                    if (lastSent) {
                        lastSent.setHours(0, 0, 0, 0);
                        const daysSinceLastReminder = Math.ceil((today.getTime() - lastSent.getTime()) / (1000 * 3600 * 24));
                        if (daysSinceLastReminder >= 3) {
                            reminderType = "overdue";
                        }
                    }
                    else {
                        reminderType = "overdue"; // First time overdue notice
                    }
                }
                if (reminderType) {
                    console.log(`[CRON] Dispatching ${reminderType} reminder for Invoice #${invoice.invoice_number} to ${invoice.client_name}`);
                    let emailSuccess = false;
                    let whatsappSuccess = false;
                    // Send Email if enabled by SaaS user
                    if (invoice.reminder_email_enabled && invoice.client_email) {
                        try {
                            await sendReminderEmail(invoice.client_email, invoice.client_name, invoice.invoice_number, invoice.total_amount, invoice.due_date.toISOString().split('T')[0], invoice.payment_url, reminderType);
                            emailSuccess = true;
                            await client.query("INSERT INTO invoice_reminders_log (invoice_id, medium, status) VALUES ($1, $2, 'Success')", [invoice.invoice_id, "Email"]);
                        }
                        catch (e) {
                            await client.query("INSERT INTO invoice_reminders_log (invoice_id, medium, status) VALUES ($1, $2, 'Failed')", [invoice.invoice_id, "Email"]);
                        }
                    }
                    // Send WhatsApp if enabled by SaaS user
                    if (invoice.reminder_whatsapp_enabled && invoice.client_phone) {
                        try {
                            whatsappSuccess = await sendWhatsAppReminder(invoice.client_phone, invoice.client_name, invoice.invoice_number, invoice.total_amount, invoice.due_date.toISOString().split('T')[0], invoice.payment_url, reminderType);
                            if (whatsappSuccess) {
                                await client.query("INSERT INTO invoice_reminders_log (invoice_id, medium, status) VALUES ($1, $2, 'Success')", [invoice.invoice_id, "WhatsApp"]);
                            }
                        }
                        catch (e) {
                            await client.query("INSERT INTO invoice_reminders_log (invoice_id, medium, status) VALUES ($1, $2, 'Failed')", [invoice.invoice_id, "WhatsApp"]);
                        }
                    }
                    // Update invoice metadata if at least one reminder medium was triggered
                    if (emailSuccess || whatsappSuccess) {
                        await client.query(`UPDATE invoices 
                             SET last_reminder_sent_at = CURRENT_TIMESTAMP, 
                                 reminders_sent_count = reminders_sent_count + 1 
                             WHERE id = $1`, [invoice.invoice_id]);
                    }
                }
            }
            await client.query("COMMIT");
            console.log("[CRON] Daily automated reminder routine executed successfully.");
        }
        catch (error) {
            await client.query("ROLLBACK");
            console.error("[CRON] Error executing automated reminders:", error);
        }
        finally {
            client.release();
        }
    });
    console.log("Cron jobs initialized successfully.");
};
//# sourceMappingURL=invoiceCron.js.map