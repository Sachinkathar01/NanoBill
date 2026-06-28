import express from "express";
import { registerUser, loginUser, logoutUser, getMe, updateSettings, verifyEmail, forgotPassword, resetPassword } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticate, getMe);
router.put("/settings", authenticate, updateSettings);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
//# sourceMappingURL=authRoutes.js.map