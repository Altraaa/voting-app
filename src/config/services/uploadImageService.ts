import { UploadResult } from "@/config/types/uploadType";
import { supabase } from "@/lib/supabase/client";

/**
 * Upload file to local filesystem
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadResult> {
  try {
    if (!file) return { success: false, error: "No file provided" };

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

    const filePath = `${folder ? `${folder}/` : ""}${fileName}`;

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicData.publicUrl,
      path: filePath,
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
    const { error } = await supabase.storage.from("photos").remove([filePath]);

    if (error) throw error;
    return true;
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
    const match = url.match(/\/object\/public\/photos\/(.+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}