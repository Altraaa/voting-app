import { userController } from "@/config/controllers/usersController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return userController.getUserVoteHistoryRoute(request);
}
