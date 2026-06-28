export declare const InvoiceServices: {
    reconcilePaymentStatuses(userId: string): Promise<void>;
    createInvoice(userId: string, clientId: string | undefined, clientName: string | undefined, clientEmail: string | undefined, clientPhone: string | undefined, clientAddress: string | undefined, invoiceNumber: string, dueDate: string, taxAmount: number, totalAmount: number, notes: string, items: {
        item_id?: string;
        name?: string;
        quantity: number;
        price: number;
    }[]): Promise<any>;
    getInvoicesByUser(userId: string): Promise<any[]>;
    getInvoiceDetails(invoiceId: string, userId: string): Promise<any>;
    updateInvoiceStatus(invoiceId: string, userId: string, status: string): Promise<any>;
    updateInvoicePdfUrl(invoiceId: string, userId: string, pdfUrl: string): Promise<any>;
    updateInvoicePaymentLink(invoiceId: string, userId: string, paymentUrl: string, paymentLinkId: string): Promise<any>;
};
//# sourceMappingURL=invoiceService.d.ts.map