import { candidateController } from "@/config/controllers/candidateController";

export async function GET() {
  return candidateController.getAll();
}

export async function POST(req: Request) {
  return candidateController.create(req);
}

export async function PUT(req: Request) {
  return candidateController.update(req);
}

export async function DELETE(req: Request) {
  return candidateController.remove(req);
}