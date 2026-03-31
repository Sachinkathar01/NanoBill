import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOverdueEmail = async (clientEmail: string, clientName: string, invoiceNumber: string, amount: string, paymentUrl: string | null) => {
    try {
        if (!clientEmail) {
             console.log(`Skipping overdue email for Invoice # ${invoiceNumber}. No client email provided.`);
             return;
        }

        const mailOptions = {
            from: `"NanoBill Alerts" <${process.env.SMTP_USER}>`,
            to: clientEmail,
            subject: `URGENT: Invoice #${invoiceNumber} is Overdue`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #d9534f;">Invoice Overdue Notice</h2>
                    <p>Dear <strong>${clientName}</strong>,</p>
                    <p>This is a friendly reminder that your payment for <strong>Invoice #${invoiceNumber}</strong> is currently overdue.</p>
                    <p><strong>Total Amount Due:</strong> ₹${amount}</p>
                    ${paymentUrl ? `<p>You can easily and securely pay this invoice online by clicking the link below:</p>
                    <br>
                    <a href="${paymentUrl}" style="display: inline-block; background-color: #0275d8; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Pay Invoice Now</a>
                    <br><br>` : ''}
                    <p>If you have already made the payment recently, please disregard this email.</p>
                    <p>Thank you,<br/>NanoBill System</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Overdue Email successfully dispatched to ${clientEmail} for Invoice #${invoiceNumber}`);
    } catch (error) {
        console.error("Failed to send overdue email:", error);
    }
};
