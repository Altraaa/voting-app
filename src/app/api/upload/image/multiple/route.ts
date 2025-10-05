import { UploadController } from "@/config/controllers/uploadImageController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return UploadController.uploadMultipleImages(request);
}

export async function DELETE(request: NextRequest) {
  return UploadController.deleteMultipleImages(request);
}