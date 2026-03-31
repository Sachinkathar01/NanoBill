import multer, {} from "multer";
// Use memory storage so we don't save files locally before uploading to Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    }
});
//# sourceMappingURL=uploadMiddleware.js.map