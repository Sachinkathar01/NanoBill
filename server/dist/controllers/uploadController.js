import cloudinary from "../config/cloudinary.js";
export const uploadImage = async (req, res) => {
    try {
        const multerReq = req;
        if (!multerReq.file) {
            res.status(400).json({ message: "No image file provided" });
            return;
        }
        // Upload the memory buffer to Cloudinary via stream
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "nanobill_logos", // creates a folder in your Cloudinary account
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ message: "Cloudinary upload failed", error });
            }
            // Return the secure URL to the frontend so they can attach it to the Invoice body
            res.status(200).json({ url: result?.secure_url });
        });
        // Pipe the multer memory buffer into Cloudinary
        uploadStream.end(multerReq.file.buffer);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error during upload" });
    }
};
//# sourceMappingURL=uploadController.js.map