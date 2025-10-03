import { eventController } from "@/config/controllers/eventController";

export async function GET() {
  return eventController.getAll();
}

export async function POST(req: Request) {
  return eventController.create(req);
}

export async function PUT(req: Request) {
  return eventController.update(req);
}

export async function DELETE(req: Request) {
  return eventController.remove(req);
}