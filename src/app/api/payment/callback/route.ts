import { pointVotesController } from "@/config/controllers/pointVotesController";

export async function POST(req: Request) {
  return pointVotesController.duitkuCallback(req);
}