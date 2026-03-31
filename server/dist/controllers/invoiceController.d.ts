import type { Request, Response } from "express";
export declare const createInvoice: (req: Request, res: Response) => Promise<void>;
export declare const getInvoices: (req: Request, res: Response) => Promise<void>;
export declare const getInvoiceById: (req: Request, res: Response) => Promise<void>;
export declare const updateInvoiceStatus: (req: Request, res: Response) => Promise<void>;
export declare const generateInvoicePdf: (req: Request, res: Response) => Promise<void>;
export declare const generateInvoicePaymentLink: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=invoiceController.d.ts.map