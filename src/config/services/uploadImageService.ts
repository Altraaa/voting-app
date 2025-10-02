import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { UploadResult } from "@/config/types/uploadType";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Upload file to local filesystem
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPG, PNG, and WEBP allowed.",
      };
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "File size too large. Max 2MB." };
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    const targetDir = folder ? path.join(UPLOAD_DIR, folder) : UPLOAD_DIR;

    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder ? `${folder}/` : ""}${fileName}`;
    const storagePath = `${folder ? `${folder}/` : ""}${fileName}`;

    return {
      success: true,
      url: publicUrl,
      path: storagePath,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete file from local filesystem
 */
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const cleanPath = filePath.trim();
    const fullPath = path.join(UPLOAD_DIR, cleanPath);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return true;
    }

    console.warn(`File not found: ${fullPath}`);
    
    const alternativePath = path.join(process.cwd(), 'public', cleanPath);
    if (existsSync(alternativePath)) {
      await unlink(alternativePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

/**
 * Extract path from URL
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    if (url.startsWith("/uploads/")) {
      return url.replace("/uploads/", "");
    }

    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/uploads\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    if (url.startsWith("/uploads/")) {
      return url.replace("/uploads/", "");
    }
    return null;
  }
}