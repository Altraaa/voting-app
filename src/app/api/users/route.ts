import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, points: true, role: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const cookie = cookies();
  const token = (cookie as any).get("session")?.value;
  const decoded = verifyToken(token || "");
  if (!decoded || decoded.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, name, password, role } = await req.json();
  const hashed = await prisma.user.create({
    data: { email, name, password, role },
  });
  return NextResponse.json(hashed);
}

export async function PUT(req: Request) {
  const { id, name, role } = await req.json();
  const user = await prisma.user.update({
    where: { id },
    data: { name, role },
  });
  return NextResponse.json(user);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "User deleted" });
}
