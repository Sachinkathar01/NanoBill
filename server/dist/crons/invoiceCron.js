import cron from "node-cron";
import pool from "../config/db.js";
import { sendOverdueEmail } from "../services/emailService.js";
// Run every day at 08:00 AM (server local time)
export const initCronJobs = () => {
    // pattern specifies: Minute | Hour | Day of Month | Month | Day of Week
    cron.schedule("0 8 * * *", async () => {
        console.log("[CRON] Executing daily overdue invoice check...");
        try {
            // Find all invoices where the due_date is past limit, and status isn't paid or already marked overdue
            const overdueCheckQuery = `
                SELECT 
                    i.id as invoice_id, 
                    i.invoice_number, 
                    i.total_amount, 
                    i.due_date,
                    i.payment_url,
                    c.name as client_name, 
                    c.email as client_email
                FROM invoices i
                JOIN clients c ON i.client_id = c.id
                WHERE i.due_date < CURRENT_DATE 
                AND i.status IN ('Sent', 'Draft')
            `;
            const { rows: overdueInvoices } = await pool.query(overdueCheckQuery);
            if (overdueInvoices.length === 0) {
                console.log("[CRON] No new overdue invoices found today.");
                return;
            }
            console.log(`[CRON] Found ${overdueInvoices.length} newly overdue invoice(s). Processing emails...`);
            for (const invoice of overdueInvoices) {
                // 1. Mark as overdue
                await pool.query("UPDATE invoices SET status = 'Overdue' WHERE id = $1", [invoice.invoice_id]);
                // 2. Dispatch Email Notice
                await sendOverdueEmail(invoice.client_email, invoice.client_name, invoice.invoice_number, invoice.total_amount, invoice.payment_url);
            }
            console.log("[CRON] Overdue processing completed smoothly.");
        }
        catch (error) {
            console.error("[CRON] Error executing overdue check:", error);
        }
    });
    console.log("Cron jobs initialized successfully.");
};
//# sourceMappingURL=invoiceCron.js.map