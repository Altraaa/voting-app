import { categoryController } from "@/config/controllers/categoryController";

export async function GET() {
  return categoryController.getAll();
}

export async function GET_BY_ID(id: string) {
  return categoryController.getById(id);
}

export async function POST(req: Request) {
  return categoryController.create(req);
}

export async function PUT(req: Request) {
  return categoryController.update(req);
}

export async function DELETE(req: Request) {
  return categoryController.remove(req);
}
