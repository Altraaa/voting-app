import { categoryController } from "@/config/controllers/categoryController";

export async function GET() {
  return categoryController.getAllSimple();
}
