import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    await prisma.candidate.findMany({ include: { category: true } })
  );
}

export async function POST(req: Request) {
  const { name, categoryId } = await req.json();
  const candidate = await prisma.candidate.create({
    data: { name, categoryId },
  });
  return NextResponse.json(candidate);
}

export async function PUT(req: Request) {
  const { id, name, categoryId } = await req.json();
  const candidate = await prisma.candidate.update({
    where: { id },
    data: { name, categoryId },
  });
  return NextResponse.json(candidate);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.candidate.delete({ where: { id } });
  return NextResponse.json({ message: "Candidate deleted" });
}
