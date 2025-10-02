import { eventController } from "@/config/controllers/eventController";

export async function GET() {
  return eventController.getAllSimple();
}
