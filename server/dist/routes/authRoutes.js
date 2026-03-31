import express from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticate, getMe);
export default router;
//# sourceMappingURL=authRoutes.js.map