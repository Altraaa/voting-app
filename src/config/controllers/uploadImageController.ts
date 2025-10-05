import { NextRequest, NextResponse } from "next/server";
import { deleteImage, uploadImage } from "../services/uploadImageService";

export class UploadController {
  static async uploadImage(request: NextRequest): Promise<NextResponse> {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const folder = formData.get("folder") as string | undefined;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }

      const result = await uploadImage(file, folder);

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        path: result.path,
      });
    } catch (error) {
      console.error("[UploadController] Upload error:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  static async deleteImage(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { path } = body;

      if (!path) {
        return NextResponse.json(
          { success: false, error: "No path provided" },
          { status: 400 }
        );
      }

      const decodedPath = decodeURIComponent(path);

      const success = await deleteImage(decodedPath);

      if (!success) {
        return NextResponse.json(
          { success: false, error: "Failed to delete image or file not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("[UploadController] Delete error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
      );
    }
  }

  static async uploadMultipleImages(
    request: NextRequest
  ): Promise<NextResponse> {
    try {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      const folder = formData.get("folder") as string | undefined;

      if (!files || files.length === 0) {
        return NextResponse.json(
          { success: false, error: "No files provided" },
          { status: 400 }
        );
      }

      const uploadPromises = files.map((file) => uploadImage(file, folder));
      const results = await Promise.all(uploadPromises);

      return NextResponse.json({
        success: results.every((r) => r.success),
        results,
      });
    } catch (error) {
      console.error("[UploadController] Multiple upload error:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  static async deleteMultipleImages(
    request: NextRequest
  ): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { paths } = body;

      if (!paths || !Array.isArray(paths) || paths.length === 0) {
        return NextResponse.json(
          { success: false, error: "No paths provided" },
          { status: 400 }
        );
      }

      const deletePromises = paths.map((path) => deleteImage(path));
      const results = await Promise.all(deletePromises);
      const success = results.every((r) => r === true);

      return NextResponse.json({ success });
    } catch (error) {
      console.error("[UploadController] Multiple delete error:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}