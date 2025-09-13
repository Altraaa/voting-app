import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  const cookie = cookies();
  const token = (cookie as any).get("session")?.value;
  const decoded = verifyToken(token || "");
  if (!decoded)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { points } = await req.json();

  const user = await prisma.user.update({
    where: { id: decoded.id },
    data: { points: { increment: points } },
  });

  return NextResponse.json({ message: "Points added", points: user.points });
}
