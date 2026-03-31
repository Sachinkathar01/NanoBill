import { Router } from "express";
import { getDashboardOverview } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", authenticate, getDashboardOverview);

export default router;
