import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        // 1. Total Active Clients
        const clientCountRes = await pool.query(
            "SELECT COUNT(*) as count FROM clients WHERE user_id = $1", 
            [userId]
        );
        const activeClientsCount = parseInt(clientCountRes.rows[0].count, 10);

        // 2. Total Revenue (sum of total_amount for 'Paid' invoices)
        const revenueRes = await pool.query(
            "SELECT SUM(total_amount) as total FROM invoices WHERE user_id = $1 AND status = 'Paid'",
            [userId]
        );
        const totalRevenue = revenueRes.rows[0].total ? parseFloat(revenueRes.rows[0].total) : 0;

        // 3. Pending Invoices (count of invoices that are NOT 'Paid')
        const pendingInvoicesRes = await pool.query(
            "SELECT COUNT(*) as count FROM invoices WHERE user_id = $1 AND status != 'Paid'",
            [userId]
        );
        const pendingInvoicesCount = parseInt(pendingInvoicesRes.rows[0].count, 10);

        // 4. Recent Invoices (limit 5)
        const recentInvoicesRes = await pool.query(
            `SELECT i.id, i.invoice_number, i.status, i.total_amount, i.created_at, c.name as client_name
             FROM invoices i
             LEFT JOIN clients c ON i.client_id = c.id
             WHERE i.user_id = $1
             ORDER BY i.created_at DESC
             LIMIT 5`,
            [userId]
        );
        const recentInvoices = recentInvoicesRes.rows;

        res.status(200).json({
            stats: {
                activeClients: activeClientsCount,
                totalRevenue: totalRevenue,
                pendingInvoices: pendingInvoicesCount
            },
            recentInvoices
        });
    } catch (err: any) {
        console.error("Dashboard Stats Error:", err.message);
        res.status(500).json({ message: "Server Error fetching dashboard stats" });
    }
};
