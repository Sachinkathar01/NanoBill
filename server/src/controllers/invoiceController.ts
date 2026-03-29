import type { Request, Response } from "express";
import { InvoiceServices } from "../services/invoiceService.js";
import { generatePDFBuffer } from "../utils/pdfGenerator.js";
import { uploadToCloudinary, getSignedCloudinaryUrl } from "../utils/cloudinaryUtil.js";
import { generatePaymentLink } from "../utils/paymentUtil.js";
import pool from "../config/db.js";

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { client_id, invoice_number, due_date, tax_amount, total_amount, notes, items } = req.body;

        if (!client_id || !invoice_number || !total_amount || !items || items.length === 0) {
             res.status(400).json({ message: "Missing required invoice fields." });
             return;
        }

        const invoice = await InvoiceServices.createInvoice(
            userId, client_id, invoice_number, due_date, tax_amount, total_amount, notes, items
        );
        
        res.status(201).json({ invoice });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error creating invoice" });
    }
};

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const invoices = await InvoiceServices.getInvoicesByUser(userId);
        res.status(200).json({ invoices });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const id = req.params.id as string;

        const invoice = await InvoiceServices.getInvoiceDetails(id, userId);
        
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }
        
        res.status(200).json({ invoice });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateInvoiceStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const id = req.params.id as string;
        const { status } = req.body;

        const updated = await InvoiceServices.updateInvoiceStatus(id, userId, status);
        
        if (!updated) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }
        res.status(200).json({ invoice: updated });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const generateInvoicePdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const id = req.params.id as string;

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
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error generating PDF" });
    }
};

export const generateInvoicePaymentLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const id = req.params.id as string;

        const invoice = await InvoiceServices.getInvoiceDetails(id, userId);
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found or unauthorized" });
            return;
        }

        const paymentLinkResponse = await generatePaymentLink(
            parseFloat(invoice.total_amount),
            invoice.invoice_number,
            invoice.client_name,
            invoice.client_email,
            invoice.client_phone 
        );

        const updatedInvoice = await InvoiceServices.updateInvoicePaymentLink(
            id, 
            userId, 
            paymentLinkResponse.short_url, 
            paymentLinkResponse.id
        );

        res.status(200).json({ 
            message: "Payment Link Generated Successfully",
            payment_url: updatedInvoice.payment_url 
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error generating Payment Link" });
    }
};
