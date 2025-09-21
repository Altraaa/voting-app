import { userController } from "@/config/controllers/usersController";
import { cookies } from "next/headers";

export async function GET() {
  return userController.getAll();
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return userController.create(req, token);
}

export async function PUT(req: Request) {
  return userController.update(req);
}

export async function DELETE(req: Request) {
  return userController.remove(req);
}  