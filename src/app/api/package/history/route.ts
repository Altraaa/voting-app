import { packageHistoryController } from "@/config/controllers/packageHistoryController";

export async function GET() {
  return packageHistoryController.getAll();
}

export async function POST(req: Request) {
  return packageHistoryController.create(req);
}

export async function PUT(req: Request) {
  return packageHistoryController.update(req);
}