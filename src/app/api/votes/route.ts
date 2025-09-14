import { cookies } from "next/headers";
import { voteController } from "@/config/controllers/voteController";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return voteController.create(req, token);
}

export async function GET() {
  return voteController.getAll();
}