import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { jwtGenerator } from "../utils/jwtGenerator.js";
// The service layer handles all raw SQL and business logic so the controller stays clean
export const AuthServices = {
    async checkUserExists(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows.length > 0;
    },
    async register(name, email, passwordString) {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(passwordString, salt);
        const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const newUser = await pool.query("INSERT INTO users (name, email, password_hash, verification_token) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, bcryptPassword, verificationToken]);
        const token = jwtGenerator(newUser.rows[0].id);
        return { user: newUser.rows[0], token };
    },
    async login(email, passwordString) {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return null; // User not found
        }
        const userRow = userResult.rows[0];
        const validPassword = await bcrypt.compare(passwordString, userRow.password_hash);
        if (!validPassword) {
            return null; // Invalid credentials
        }
        const token = jwtGenerator(userRow.id);
        return { user: userRow, token };
    },
    async getUserById(userId) {
        const result = await pool.query("SELECT id, name, email, created_at, subscription_plan, razorpay_account_id, reminder_whatsapp_enabled, reminder_email_enabled, business_name, business_address, phone, bank_account_number, bank_ifsc FROM users WHERE id = $1", [userId]);
        return result.rows[0] || null;
    },
    async updateUserSettings(userId, razorpayAccountId, reminderWhatsappEnabled, reminderEmailEnabled, businessName, businessAddress, phone, bankAccountNumber, bankIfsc, subscriptionPlan) {
        const query = subscriptionPlan
            ? `UPDATE users SET razorpay_account_id = $1, reminder_whatsapp_enabled = $2, reminder_email_enabled = $3, business_name = $4, business_address = $5, phone = $6, bank_account_number = $7, bank_ifsc = $8, subscription_plan = $9 WHERE id = $10 RETURNING id, name, email, subscription_plan, razorpay_account_id, reminder_whatsapp_enabled, reminder_email_enabled, business_name, business_address, phone, bank_account_number, bank_ifsc`
            : `UPDATE users SET razorpay_account_id = $1, reminder_whatsapp_enabled = $2, reminder_email_enabled = $3, business_name = $4, business_address = $5, phone = $6, bank_account_number = $7, bank_ifsc = $8 WHERE id = $9 RETURNING id, name, email, subscription_plan, razorpay_account_id, reminder_whatsapp_enabled, reminder_email_enabled, business_name, business_address, phone, bank_account_number, bank_ifsc`;
        const params = subscriptionPlan
            ? [razorpayAccountId, reminderWhatsappEnabled, reminderEmailEnabled, businessName, businessAddress, phone, bankAccountNumber, bankIfsc, subscriptionPlan, userId]
            : [razorpayAccountId, reminderWhatsappEnabled, reminderEmailEnabled, businessName, businessAddress, phone, bankAccountNumber, bankIfsc, userId];
        const result = await pool.query(query, params);
        return result.rows[0];
    },
    async verifyEmailToken(token) {
        const result = await pool.query("UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING id, name, email", [token]);
        return result.rows[0] || null;
    },
    async initiateForgotPassword(email) {
        const userRes = await pool.query("SELECT id, name, email FROM users WHERE email = $1", [email]);
        if (userRes.rows.length === 0)
            return null;
        const user = userRes.rows[0];
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await pool.query("UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL '1 hour' WHERE id = $2", [resetToken, user.id]);
        return { user, resetToken };
    },
    async resetPasswordWithToken(token, passwordString) {
        const userRes = await pool.query("SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()", [token]);
        if (userRes.rows.length === 0)
            return null;
        const user = userRes.rows[0];
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(passwordString, salt);
        await pool.query("UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2", [bcryptPassword, user.id]);
        return user;
    }
};
//# sourceMappingURL=authService.js.map