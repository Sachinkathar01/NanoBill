/**
 * Generates a dynamic Checkout URL using Razorpay's Payment Links API.
 */
export declare const generatePaymentLink: (amountInRupees: number, invoiceNumber: string, clientName: string, clientEmail: string | null | undefined, clientPhone: string | null | undefined) => Promise<import("razorpay/dist/types/paymentLink.js").PaymentLinks.RazorpayPaymentLink>;
//# sourceMappingURL=paymentUtil.d.ts.map