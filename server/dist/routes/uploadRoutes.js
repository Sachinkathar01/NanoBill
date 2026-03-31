import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();
// Apply auth middleware to make sure only logged in users can upload
router.use(authenticate);
// "image" matches the form-data key the frontend will use
router.post("/image", upload.single("image"), uploadImage);
export default router;
//# sourceMappingURL=uploadRoutes.js.map