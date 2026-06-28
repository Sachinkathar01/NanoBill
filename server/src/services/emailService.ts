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

export const sendReminderEmail = async (
    clientEmail: string,
    clientName: string,
    invoiceNumber: string,
    amount: string,
    dueDate: string,
    paymentUrl: string | null,
    type: "new_invoice" | "upcoming" | "due_today" | "overdue"
) => {
    try {
        if (!clientEmail) {
             console.log(`Skipping email for Invoice #${invoiceNumber}. No client email provided.`);
             return;
        }

        let subject = "";
        let headline = "";
        let bodyText = "";

        if (type === "new_invoice") {
            subject = `New Invoice #${invoiceNumber}`;
            headline = "Invoice Received";
            bodyText = `A new invoice **Invoice #${invoiceNumber}** has been generated for you, due on ${dueDate}.`;
        } else if (type === "upcoming") {
            subject = `Reminder: Invoice #${invoiceNumber} is due tomorrow`;
            headline = "Invoice Due Tomorrow";
            bodyText = `This is a friendly notice that payment for **Invoice #${invoiceNumber}** is due tomorrow (${dueDate}).`;
        } else if (type === "due_today") {
            subject = `Notice: Invoice #${invoiceNumber} is due today`;
            headline = "Invoice Due Today";
            bodyText = `Please note that payment for **Invoice #${invoiceNumber}** is due today.`;
        } else {
            subject = `URGENT: Invoice #${invoiceNumber} is Overdue`;
            headline = "Invoice Overdue Notice";
            bodyText = `This is a reminder that payment for **Invoice #${invoiceNumber}** is currently overdue (due on ${dueDate}).`;
        }

        const mailOptions = {
            from: `"NanoBill Alerts" <${process.env.SMTP_USER}>`,
            to: clientEmail,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: ${type === 'overdue' ? '#d9534f' : '#0275d8'};">${headline}</h2>
                    <p>Dear <strong>${clientName}</strong>,</p>
                    <p>${bodyText}</p>
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
        console.log(`Reminder Email (${type}) successfully dispatched to ${clientEmail} for Invoice #${invoiceNumber}`);
    } catch (error) {
        console.error(`Failed to send reminder email (${type}):`, error);
    }
};

export const sendVerificationEmail = async (clientEmail: string, name: string, token: string) => {
    try {
        const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;
        const mailOptions = {
            from: `"NanoBill Alerts" <${process.env.SMTP_USER}>`,
            to: clientEmail,
            subject: `Verify Your NanoBill Account`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #F97316;">Welcome to NanoBill!</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Thank you for deploying your workspace. Please click the button below to verify your email address:</p>
                    <br>
                    <a href="${verifyUrl}" style="display: inline-block; background-color: #F97316; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
                    <br><br>
                    <p>If the button doesn't work, you can copy-paste the URL below into your browser:</p>
                    <p>${verifyUrl}</p>
                    <p>Thank you,<br/>NanoBill Onboarding Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Verification Email successfully dispatched to ${clientEmail}`);
    } catch (error) {
        console.error("Failed to send verification email:", error);
    }
};

export const sendResetEmail = async (clientEmail: string, name: string, token: string) => {
    try {
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
        const mailOptions = {
            from: `"NanoBill Support" <${process.env.SMTP_USER}>`,
            to: clientEmail,
            subject: `Reset Your NanoBill Password`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #F97316;">Password Reset Request</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>We received a request to reset your password. Click the button below to configure a new password:</p>
                    <br>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #F97316; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    <br><br>
                    <p>This password reset link will expire in 1 hour.</p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Thank you,<br/>NanoBill Security Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Reset Password Email successfully dispatched to ${clientEmail}`);
    } catch (error) {
        console.error("Failed to send password reset email:", error);
    }
};
