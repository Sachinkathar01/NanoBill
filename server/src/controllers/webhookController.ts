import type { Request, Response } from "express";
import Razorpay from "razorpay";
import pool from "../config/db.js";

export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error("CRITICAL: Webhook secret not configured in .env");
            res.status(500).json({ status: "error configured" });
            return;
        }

        const signature = req.headers["x-razorpay-signature"] as string;
        if (!signature) {
            res.status(400).json({ status: "missing signature" });
            return;
        }

        if (!Buffer.isBuffer(req.body)) {
            res.status(400).json({ status: "invalid webhook body" });
            return;
        }

        const rawBody = req.body.toString("utf8");

        // Validate signature cryptographically
        const isValid = Razorpay.validateWebhookSignature(rawBody, signature, secret);

        if (!isValid) {
            res.status(400).json({ status: "invalid signature" });
            return;
        }

        const body = JSON.parse(rawBody);

        const event = body.event;
        let paymentLinkId: string | undefined;

        // Listen specifically for payment_link.paid
        if (event === "payment_link.paid" || event === "payment_link.partially_paid") {
            paymentLinkId = body?.payload?.payment_link?.entity?.id;
        }

        // Some integrations emit payment.captured while still carrying the payment_link_id in payment entity
        if (event === "payment.captured") {
            paymentLinkId = body?.payload?.payment?.entity?.payment_link_id;
        }

        if (paymentLinkId) {
            const result = await pool.query(
                "UPDATE invoices SET status = 'Paid' WHERE payment_link_id = $1 RETURNING id",
                [paymentLinkId]
            );

            if (result.rowCount && result.rowCount > 0) {
                console.log(`Razorpay Webhook: Invoice with payment_link_id ${paymentLinkId} marked as Paid.`);
            } else {
                console.warn(`Razorpay Webhook: No invoice found for payment_link_id ${paymentLinkId}.`);
            }
        }

        // Acknowledge receipt 
        res.status(200).json({ status: "ok" });
    } catch (error: any) {
        console.error("Webhook processing error:", error.message);
        res.status(500).json({ status: "error processing webhook" });
    }
};
