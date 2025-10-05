import { userController } from "@/config/controllers/usersController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return userController.getProfileRoute(request);
}

export async function PUT(request: NextRequest) {
  return userController.updateProfileRoute(request);
}
