import express from "express";
import { createItem, getItems, updateItem, deleteItem } from "../controllers/itemController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();
router.use(authenticate);
router.post("/", upload.single("image"), createItem);
router.get("/", getItems);
router.put("/:id", upload.single("image"), updateItem);
router.delete("/:id", deleteItem);
export default router;
//# sourceMappingURL=itemRoutes.js.map