import { candidateController } from "@/config/controllers/candidateController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return candidateController.getById(id);
}
