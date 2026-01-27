import { settingsController } from "@/config/controllers/settingsController";
import { NextRequest } from "next/server";

export async function GET() {
  return settingsController.getSettings();
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  return settingsController.updateSettings(data);
}
