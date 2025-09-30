import { deleteImage, uploadImage } from "@/lib/upload";
import { UploadResult } from "../types/uploadType";

export class UploadService {
  static async uploadImage(file: File, folder?: string): Promise<UploadResult> {
    try {
      if (!file) {
        return {
          success: false,
          error: "No file provided",
        };
      }

      const result = await uploadImage(file, folder);

      return result;
    } catch (error) {
      console.error("[UploadService] Upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  static async deleteImage(path: string): Promise<boolean> {
    try {
      if (!path) {
        console.error("[UploadService] No path provided");
        return false;
      }

      const success = await deleteImage(path);
      return success;
    } catch (error) {
      console.error("[UploadService] Delete error:", error);
      return false;
    }
  }

  static async uploadMultipleImages(
    files: File[],
    folder?: string
  ): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, folder)
      );

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("[UploadService] Multiple upload error:", error);
      return files.map(() => ({
        success: false,
        error: "Upload failed",
      }));
    }
  }

  static async deleteMultipleImages(paths: string[]): Promise<boolean> {
    try {
      const deletePromises = paths.map((path) => this.deleteImage(path));
      const results = await Promise.all(deletePromises);

      return results.every((result) => result === true);
    } catch (error) {
      console.error("[UploadService] Multiple delete error:", error);
      return false;
    }
  }
}
