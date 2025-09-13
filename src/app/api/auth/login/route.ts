import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { comparePassword, createToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createToken({ id: user.id, email: user.email, role: user.role });
  setAuthCookie(token);

  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}
