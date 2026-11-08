import { cookies } from "next/headers";
import { pointVotesController } from "@/config/controllers/pointVotesController";

export async function GET() {
  return pointVotesController.getAll();
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return pointVotesController.create(req, token);
}
