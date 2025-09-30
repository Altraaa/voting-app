import { NextRequest, NextResponse } from "next/server";
import { UploadService } from "../services/uploadImageService";

export class UploadController {
  static async uploadImage(request: NextRequest): Promise<NextResponse> {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const folder = formData.get("folder") as string | undefined;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      const result = await UploadService.uploadImage(file, folder);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Upload failed" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          url: result.url,
          path: result.path,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("[UploadController] Upload error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  static async deleteImage(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const path = searchParams.get("path");

      if (!path) {
        return NextResponse.json(
          { error: "No path provided" },
          { status: 400 }
        );
      }

      const success = await UploadService.deleteImage(path);

      if (!success) {
        return NextResponse.json(
          { error: "Failed to delete image" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("[UploadController] Delete error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
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
          { error: "No files provided" },
          { status: 400 }
        );
      }

      const results = await UploadService.uploadMultipleImages(files, folder);

      const failedUploads = results.filter((r) => !r.success);
      if (failedUploads.length > 0) {
        return NextResponse.json(
          {
            error: "Some uploads failed",
            results,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          results: results.map((r) => ({
            url: r.url,
            path: r.path,
          })),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("[UploadController] Multiple upload error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
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
          { error: "No paths provided" },
          { status: 400 }
        );
      }

      const success = await UploadService.deleteMultipleImages(paths);

      if (!success) {
        return NextResponse.json(
          { error: "Failed to delete some images" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("[UploadController] Multiple delete error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
