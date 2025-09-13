import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await prisma.category.findMany());
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const category = await prisma.category.create({ data: { name } });
  return NextResponse.json(category);
}

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const category = await prisma.category.update({ where: { id }, data: { name } });
  return NextResponse.json(category);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ message: "Category deleted" });
}
