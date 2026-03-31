import razorpayInstance from "../config/razorpay.js";
/**
 * Generates a dynamic Checkout URL using Razorpay's Payment Links API.
 */
export const generatePaymentLink = async (amountInRupees, invoiceNumber, clientName, clientEmail, clientPhone) => {
    try {
        const payload = {
            amount: Math.round(amountInRupees * 100), // Razorpay strictly requires subunit (paise)
            currency: "INR",
            accept_partial: false,
            description: `Payment for Invoice #${invoiceNumber}`,
            customer: {
                name: clientName || "Valued Customer",
                // Razorpay strongly enforces contact string formats. If DB data is corrupted or empty, we use a fail-safe payload.
                email: (clientEmail && clientEmail.includes("@")) ? clientEmail : "customer@example.com",
                contact: (clientPhone && clientPhone.length >= 10) ? clientPhone : "+919999999999"
            },
            notify: {
                sms: !!clientPhone,
                email: !!clientEmail
            },
            reminder_enable: true,
        };
        const paymentLink = await razorpayInstance.paymentLink.create(payload);
        return paymentLink;
    }
    catch (error) {
        console.error("Razorpay Utility Error:", error);
        if (error?.error?.code === 'BAD_REQUEST_ERROR' && error?.error?.description?.includes('amount')) {
            throw new Error("Razorpay Test Mode Limit Exceeded: Trial accounts block large amounts. Please keep test invoices under ₹10,000.");
        }
        throw new Error("Failed to construct Razorpay Payment Link.");
    }
};
//# sourceMappingURL=paymentUtil.js.map