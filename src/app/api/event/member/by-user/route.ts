import { eventMemberController } from "@/config/controllers/eventMemberController";

export async function DELETE(req: Request) {
  return eventMemberController.removeByUserAndEvent(req);
}