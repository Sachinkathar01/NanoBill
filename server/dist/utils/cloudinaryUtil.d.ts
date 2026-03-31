import type { UploadApiResponse } from "cloudinary";
/**
 * Uploads a file buffer directly to Cloudinary via stream.
 * Necessary because multer is using memory storage.
 */
export declare const uploadToCloudinary: (buffer: Buffer, folder?: string, resourceType?: "auto" | "image" | "video" | "raw", publicId?: string) => Promise<UploadApiResponse>;
/**
 * Generates a cryptographically signed URL for restricted Cloudinary assets (like PDFs).
 */
export declare const getSignedCloudinaryUrl: (publicId: string, resourceType?: "image" | "raw") => string;
//# sourceMappingURL=cloudinaryUtil.d.ts.map