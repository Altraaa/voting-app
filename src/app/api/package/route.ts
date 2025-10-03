import { packageController } from "@/config/controllers/packageController";

export async function GET() {
  return packageController.getAll();
}

export async function POST(req: Request) {
  return packageController.create(req);
}

export async function PUT(req: Request) {
  return packageController.update(req);
}

export async function DELETE(req: Request) {
  return packageController.remove(req);
}