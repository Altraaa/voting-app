import { userController } from "@/config/controllers/usersController";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return userController.getById(id);
}
