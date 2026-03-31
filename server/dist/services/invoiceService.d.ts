interface InvoiceItemInput {
    item_id: string;
    quantity: number;
    price: number;
}
export declare const InvoiceServices: {
    createInvoice(userId: string, clientId: string, invoiceNumber: string, dueDate: string, taxAmount: number, totalAmount: number, notes: string, items: InvoiceItemInput[]): Promise<any>;
    getInvoicesByUser(userId: string): Promise<any[]>;
    getInvoiceDetails(invoiceId: string, userId: string): Promise<any>;
    updateInvoiceStatus(invoiceId: string, userId: string, status: string): Promise<any>;
    updateInvoicePdfUrl(invoiceId: string, userId: string, pdfUrl: string): Promise<any>;
    updateInvoicePaymentLink(invoiceId: string, userId: string, paymentUrl: string, paymentLinkId: string): Promise<any>;
};
export {};
//# sourceMappingURL=invoiceService.d.ts.map