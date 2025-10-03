import { packageController } from "@/config/controllers/packageController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return packageController.getById(id);
}
