import pool from "../config/db.js";
import razorpayInstance from "../config/razorpay.js";
export const InvoiceServices = {
    async reconcilePaymentStatuses(userId) {
        const sentInvoicesRes = await pool.query(`SELECT id, payment_link_id, status
             FROM invoices
             WHERE user_id = $1 AND payment_link_id IS NOT NULL AND status != 'Paid'`, [userId]);
        for (const invoice of sentInvoicesRes.rows) {
            try {
                const paymentLink = await razorpayInstance.paymentLink.fetch(invoice.payment_link_id);
                if (paymentLink?.status === "paid") {
                    await pool.query("UPDATE invoices SET status = 'Paid' WHERE id = $1", [invoice.id]);
                }
            }
            catch (error) {
                console.warn(`Payment reconciliation skipped for invoice ${invoice.id}: ${error?.message || "Unknown error"}`);
            }
        }
    },
    async createInvoice(userId, clientId, clientName, clientEmail, clientPhone, clientAddress, invoiceNumber, dueDate, taxAmount, totalAmount, notes, items) {
        // Use a dedicated client for transaction
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            let resolvedClientId = clientId;
            // Resolve or create Client
            if (!resolvedClientId && clientName) {
                // Check if client exists with same email or name for this user
                const checkClient = await client.query("SELECT id FROM clients WHERE user_id = $1 AND (email = $2 OR name = $3)", [userId, clientEmail || "", clientName]);
                if (checkClient.rows.length > 0) {
                    resolvedClientId = checkClient.rows[0].id;
                }
                else {
                    const newClientRes = await client.query("INSERT INTO clients (user_id, name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id", [userId, clientName, clientEmail || null, clientPhone || null, clientAddress || null]);
                    resolvedClientId = newClientRes.rows[0].id;
                }
            }
            if (!resolvedClientId) {
                throw new Error("A valid client must be provided or created.");
            }
            // 1. Insert Master Invoice
            const invoiceResult = await client.query(`INSERT INTO invoices 
                (user_id, client_id, invoice_number, due_date, tax_amount, total_amount, notes, status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'Draft') RETURNING *`, [userId, resolvedClientId, invoiceNumber, dueDate, taxAmount, totalAmount, notes]);
            const newInvoice = invoiceResult.rows[0];
            // 2. Resolve or create Items, then insert invoice_items
            for (const item of items) {
                let resolvedItemId = item.item_id;
                if (!resolvedItemId && item.name) {
                    // Check if item exists with same name for this user
                    const checkItem = await client.query("SELECT id FROM items WHERE user_id = $1 AND name = $2", [userId, item.name]);
                    if (checkItem.rows.length > 0) {
                        resolvedItemId = checkItem.rows[0].id;
                    }
                    else {
                        const newItemRes = await client.query("INSERT INTO items (user_id, name, default_price) VALUES ($1, $2, $3) RETURNING id", [userId, item.name, item.price]);
                        resolvedItemId = newItemRes.rows[0].id;
                    }
                }
                if (!resolvedItemId) {
                    throw new Error(`Item ID or Name is required for all invoice items.`);
                }
                await client.query(`INSERT INTO invoice_items 
                    (invoice_id, item_id, quantity, price) 
                    VALUES ($1, $2, $3, $4)`, [newInvoice.id, resolvedItemId, item.quantity, item.price]);
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