import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

// Use memory storage so we don't save files locally before uploading to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req: Request, file: any, cb: FileFilterCallback) => {
        // Accept only image files
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});
