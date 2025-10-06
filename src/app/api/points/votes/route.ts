import { pointVotesController } from "@/config/controllers/pointVotesController";

export async function GET() {
  return pointVotesController.getAll();
}

export async function POST(req: Request) {
  return pointVotesController.create(req);
}
