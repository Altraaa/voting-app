import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, name, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, name, password: hashed, role: "USER" },
  });

  const token = createToken({ id: user.id, email: user.email, role: user.role });
  setAuthCookie(token);

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
