import { pointVotesController } from "@/config/controllers/pointVotesController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return pointVotesController.initiatePayment(req);
}