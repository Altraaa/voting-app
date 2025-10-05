import { eventMemberController } from "@/config/controllers/eventMemberController";

export async function GET() {
  return eventMemberController.getAll();
}

export async function POST(req: Request) {
  return eventMemberController.create(req);
}

export async function DELETE(req: Request) {
  return eventMemberController.remove(req);
}