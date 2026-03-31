import pool from "../config/db.js";
export const InvoiceServices = {
    async createInvoice(userId, clientId, invoiceNumber, dueDate, taxAmount, totalAmount, notes, items) {
        // Use a dedicated client for transaction
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // 1. Insert Master Invoice
            const invoiceResult = await client.query(`INSERT INTO invoices 
                (user_id, client_id, invoice_number, due_date, tax_amount, total_amount, notes, status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'Draft') RETURNING *`, [userId, clientId, invoiceNumber, dueDate, taxAmount, totalAmount, notes]);
            const newInvoice = invoiceResult.rows[0];
            // 2. Insert Line Items
            for (const item of items) {
                await client.query(`INSERT INTO invoice_items 
                    (invoice_id, item_id, quantity, price) 
                    VALUES ($1, $2, $3, $4)`, [newInvoice.id, item.item_id, item.quantity, item.price]);
            }
            await client.query("COMMIT");
            return newInvoice;
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    },
    async getInvoicesByUser(userId) {
        // A joined query to fetch invoices with client details
        const invoices = await pool.query(`SELECT i.*, c.name as client_name, c.email as client_email 
             FROM invoices i 
             LEFT JOIN clients c ON i.client_id = c.id 
             WHERE i.user_id = $1 
             ORDER BY i.created_at DESC`, [userId]);
        return invoices.rows;
    },
    async getInvoiceDetails(invoiceId, userId) {
        // Fetch invoice master
        const invoiceRes = await pool.query(`SELECT i.*, c.name as client_name, c.email as client_email, c.phone as client_phone, c.address as client_address
             FROM invoices i 
             LEFT JOIN clients c ON i.client_id = c.id 
             WHERE i.id = $1 AND i.user_id = $2`, [invoiceId, userId]);
        if (invoiceRes.rows.length === 0)
            return null;
        const invoice = invoiceRes.rows[0];
        // Fetch line items
        const itemsRes = await pool.query(`SELECT ii.*, it.name, it.description 
             FROM invoice_items ii
             LEFT JOIN items it ON ii.item_id = it.id
             WHERE ii.invoice_id = $1`, [invoiceId]);
        return { ...invoice, items: itemsRes.rows };
    },
    async updateInvoiceStatus(invoiceId, userId, status) {
        const result = await pool.query("UPDATE invoices SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [status, invoiceId, userId]);
        return result.rows[0] || null;
    },
    async updateInvoicePdfUrl(invoiceId, userId, pdfUrl) {
        const result = await pool.query("UPDATE invoices SET pdf_url = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [pdfUrl, invoiceId, userId]);
        return result.rows[0] || null;
    },
    async updateInvoicePaymentLink(invoiceId, userId, paymentUrl, paymentLinkId) {
        const result = await pool.query("UPDATE invoices SET payment_url = $1, payment_link_id = $2, status = 'Sent' WHERE id = $3 AND user_id = $4 RETURNING *", [paymentUrl, paymentLinkId, invoiceId, userId]);
        return result.rows[0] || null;
    }
};
//# sourceMappingURL=invoiceService.js.map