import { candidateController } from "@/config/controllers/candidateController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  return candidateController.getByCategorId(categoryId);
}
