import { cookies } from "next/headers";
import { pointsController } from "@/config/controllers/pointsController";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return pointsController.add(req, token);
}