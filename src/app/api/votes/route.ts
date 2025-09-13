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

  const { candidateId, points } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user || user.points < points) {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 });
  }

  const vote = await prisma.vote.create({
    data: {
      userId: decoded.id,
      candidateId,
      pointsUsed: points,
    },
  });

  await prisma.user.update({
    where: { id: decoded.id },
    data: { points: { decrement: points } },
  });

  return NextResponse.json(vote);
}

export async function GET() {
  const votes = await prisma.vote.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, name: true } },
      candidate: { select: { id: true, name: true, category: true } },
    },
  });
  return NextResponse.json(votes);
}
