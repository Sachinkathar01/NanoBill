import express from "express";
import { createInvoice, getInvoices, getInvoiceById, updateInvoiceStatus, generateInvoicePdf, generateInvoicePaymentLink } from "../controllers/invoiceController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id/status", updateInvoiceStatus);
router.get("/:id/download-pdf", generateInvoicePdf);
router.post("/:id/payment-link", generateInvoicePaymentLink);

export default router;
