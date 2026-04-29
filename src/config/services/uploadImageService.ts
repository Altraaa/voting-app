import { UploadResult } from "@/config/types/uploadType";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryUploadResult } from "../models/CloudinaryModel";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function uploadToCloudinary(
  buffer: Buffer,
  options: Record<string, unknown>,
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Upload failed"));
        resolve(result as CloudinaryUploadResult);
      },
    );
    stream.end(buffer);
  });
}

export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadResult> {
  try {
    if (!file) return { success: false, error: "No file provided" };

    // ── Validasi tipe file ──
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPG, PNG, and WEBP allowed.",
      };
    }

    // ── Validasi ukuran (5 MB) ──
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "File size too large. Max 5MB." };
    }

    const buffer = await fileToBuffer(file);
    const uploadOptions = {
      folder: folder ?? "uploads",
      resource_type: "image" as const,

      // Simpan original (eager = generate transformed version sekaligus saat upload)
      eager: [
        {
          quality: "auto:good",
          fetch_format: "auto",
          width: 1920,
          crop: "limit",
          flags: "progressive",
        },
      ],
      eager_async: false, // generate eager sekarang, bukan lazy

      // Transformation default yang diterapkan ke URL yang dikembalikan
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
        { width: 1920, crop: "limit" },
        { flags: "progressive" },
      ],
    };

    const result = await uploadToCloudinary(buffer, uploadOptions);

    /**
     * URL yang dikembalikan sudah include transformasi (compressed + resized + CDN).
     * `path` = public_id Cloudinary, dipakai untuk delete.
     */
    return {
      success: true,
      url: result.secure_url,
      path: result.public_id, // ← ini yang dipakai deleteImage
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(filePath, {
      resource_type: "image",
    });
 
    // result.result === "ok" berarti sukses, "not found" berarti file tidak ada
    return result.result === "ok";
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }  
}