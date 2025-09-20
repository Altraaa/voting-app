import { logoutController } from "@/config/controllers/logoutController";

export async function POST() {
  return logoutController();
}