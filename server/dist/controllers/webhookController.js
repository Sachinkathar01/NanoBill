import Razorpay from "razorpay";
import pool from "../config/db.js";
export const handleRazorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error("CRITICAL: Webhook secret not configured in .env");
            res.status(500).json({ status: "error configured" });
            return;
        }
        const signature = req.headers["x-razorpay-signature"];
        if (!signature) {
            res.status(400).json({ status: "missing signature" });
            return;
        }
        // Validate signature cryptographically
        const isValid = Razorpay.validateWebhookSignature(JSON.stringify(req.body), signature, secret);
        if (!isValid) {
            res.status(400).json({ status: "invalid signature" });
            return;
        }
        const event = req.body.event;
        // Listen specifically for payment_link.paid
        if (event === "payment_link.paid" || event === "payment_link.partially_paid") {
            const paymentLinkId = req.body.payload.payment_link.entity.id;
            await pool.query("UPDATE invoices SET status = 'Paid' WHERE payment_link_id = $1", [paymentLinkId]);
            console.log(`Razorpay Webhook: Invoice with payment_link_id ${paymentLinkId} marked as Paid.`);
        }
        // Acknowledge receipt 
        res.status(200).json({ status: "ok" });
    }
    catch (error) {
        console.error("Webhook processing error:", error.message);
        res.status(500).json({ status: "error processing webhook" });
    }
};
//# sourceMappingURL=webhookController.js.map