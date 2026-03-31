import express from "express";
import { createClient, getClients, updateClient, deleteClient } from "../controllers/clientController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();
// Apply auth middleware to all client routes
router.use(authenticate);
router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
export default router;
//# sourceMappingURL=clientRoutes.js.map