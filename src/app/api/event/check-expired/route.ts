import { eventController } from "@/config/controllers/eventController";

export async function POST() {
  return eventController.checkExpiredEvents();
}
