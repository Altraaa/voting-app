import { pointVotesController } from "@/config/controllers/pointVotesController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return pointVotesController.getById(id);
}
