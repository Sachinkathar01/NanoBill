export declare const sendOverdueEmail: (clientEmail: string, clientName: string, invoiceNumber: string, amount: string, paymentUrl: string | null) => Promise<void>;
export declare const sendReminderEmail: (clientEmail: string, clientName: string, invoiceNumber: string, amount: string, dueDate: string, paymentUrl: string | null, type: "new_invoice" | "upcoming" | "due_today" | "overdue") => Promise<void>;
export declare const sendVerificationEmail: (clientEmail: string, name: string, token: string) => Promise<void>;
export declare const sendResetEmail: (clientEmail: string, name: string, token: string) => Promise<void>;
//# sourceMappingURL=emailService.d.ts.map