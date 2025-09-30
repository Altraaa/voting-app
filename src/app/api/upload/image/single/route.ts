import { UploadController } from "@/config/controllers/uploadImageController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return UploadController.uploadImage(request);
}

export async function DELETE(request: NextRequest) {
  return UploadController.deleteImage(request);
}