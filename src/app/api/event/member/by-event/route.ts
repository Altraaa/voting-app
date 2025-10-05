import { eventMemberController } from "@/config/controllers/eventMemberController";

export async function GET(req: Request) {
  return eventMemberController.getByEvent(req);
}