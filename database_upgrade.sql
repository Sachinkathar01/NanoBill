-- NanoBill SaaS Database Upgrade Script (Updated)
-- Run this in your database terminal or pgAdmin to upgrade the schema for SaaS features.

-- 1. Add subscription, payment gateway routing, and onboarding details to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free', -- 'free', 'premium'
ADD COLUMN IF NOT EXISTS razorpay_account_id VARCHAR(100) DEFAULT NULL, -- Connected Merchant ID for Route
ADD COLUMN IF NOT EXISTS reminder_whatsapp_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS reminder_email_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS business_address TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(100) DEFAULT NULL;

-- 2. Add automated reminder tracking fields to invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMP DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reminders_sent_count INT DEFAULT 0;

-- 3. Create a table to log reminders sent (for audit trail)
CREATE TABLE IF NOT EXISTS invoice_reminders_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    medium VARCHAR(50) NOT NULL, -- 'Email', 'WhatsApp'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL -- 'Success', 'Failed'
);
