import { registerController } from "@/config/controllers/registerController";

export async function POST(req: Request) {
  return registerController(req);
}