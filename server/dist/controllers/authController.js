import { AuthServices } from "../services/authService.js";
import { sendVerificationEmail, sendResetEmail } from "../services/emailService.js";
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const userExists = await AuthServices.checkUserExists(email);
        if (userExists) {
            res.status(401).json({ message: "User already exists!" });
            return;
        }
        const { user, token } = await AuthServices.register(name, email, password);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        // Trigger email verification in background
        if (user.verification_token) {
            sendVerificationEmail(user.email, user.name, user.verification_token).catch((err) => {
                console.error("Verification email dispatch failed:", err.message);
            });
        }
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const loginResult = await AuthServices.login(email, password);
        if (!loginResult) {
            res.status(401).json({ message: "Password or Email is incorrect" });
            return;
        }
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", loginResult.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ user: { id: loginResult.user.id, name: loginResult.user.name, email: loginResult.user.email }, token: loginResult.token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const logoutUser = async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // expires immediately
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
};
export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await AuthServices.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ user });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error checking user" });
    }
};
export const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { razorpay_account_id, reminder_whatsapp_enabled, reminder_email_enabled, business_name, business_address, phone, bank_account_number, bank_ifsc, subscription_plan } = req.body;
        const updatedUser = await AuthServices.updateUserSettings(userId, razorpay_account_id === "" ? null : razorpay_account_id, reminder_whatsapp_enabled ?? true, reminder_email_enabled ?? true, business_name === "" ? null : business_name, business_address === "" ? null : business_address, phone === "" ? null : phone, bank_account_number === "" ? null : bank_account_number, bank_ifsc === "" ? null : bank_ifsc, subscription_plan);
        res.status(200).json({ user: updatedUser });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error saving settings" });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ message: "Verification token is required" });
            return;
        }
        const verifiedUser = await AuthServices.verifyEmailToken(token);
        if (!verifiedUser) {
            res.status(400).json({ message: "Invalid or expired verification token" });
            return;
        }
        res.status(200).json({ message: "Email verified successfully", user: verifiedUser });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        const result = await AuthServices.initiateForgotPassword(email);
        if (result) {
            const { user, resetToken } = result;
            sendResetEmail(user.email, user.name, resetToken).catch((mailErr) => {
                console.error("Failed to send reset email:", mailErr.message);
            });
        }
        res.status(200).json({ message: "If that email exists in our system, we've sent a password reset link." });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            res.status(400).json({ message: "Token and password are required" });
            return;
        }
        const user = await AuthServices.resetPasswordWithToken(token, password);
        if (!user) {
            res.status(400).json({ message: "Invalid or expired reset token" });
            return;
        }
        res.status(200).json({ message: "Password reset successfully. You can now login." });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
//# sourceMappingURL=authController.js.map