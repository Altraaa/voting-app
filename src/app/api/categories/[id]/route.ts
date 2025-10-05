import { categoryController } from "@/config/controllers/categoryController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return categoryController.getById(id);
}
