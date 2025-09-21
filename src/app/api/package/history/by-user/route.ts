import { packageHistoryController } from "@/config/controllers/packageHistoryController";

export async function GET(req: Request) {
  return packageHistoryController.getByUser(req);
}