import { eventController } from "@/config/controllers/eventController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return eventController.getById(id);
}
