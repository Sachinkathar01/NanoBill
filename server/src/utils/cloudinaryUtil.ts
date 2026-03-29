import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse } from "cloudinary";

/**
 * Uploads a file buffer directly to Cloudinary via stream.
 * Necessary because multer is using memory storage.
 */
export const uploadToCloudinary = (buffer: Buffer, folder: string = "nanobill/items", resourceType: "auto" | "image" | "video" | "raw" = "auto", publicId?: string): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const options: any = { folder, resource_type: resourceType };
        if (publicId) options.public_id = publicId;

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Unknown error uploading to Cloudinary"));
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Generates a cryptographically signed URL for restricted Cloudinary assets (like PDFs).
 */
export const getSignedCloudinaryUrl = (publicId: string, resourceType: "image" | "raw" = "image"): string => {
    return cloudinary.url(publicId, {
        secure: true,
        sign_url: true,
        resource_type: resourceType
    });
};
