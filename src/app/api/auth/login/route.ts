import { loginController } from "@/config/controllers/loginController";

export async function POST(req: Request) {
  return loginController(req);
}