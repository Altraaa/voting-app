import { NextResponse } from "next/server";
import { candidateService } from "../service/candidateService";

export const candidateController = {
  async getAll() {
    const candidates = await candidateService.getAll();
    return NextResponse.json(candidates);
  },

  async create(req: Request) {
    const { name, categoryId } = await req.json();
    const candidate = await candidateService.create({ name, categoryId });
    return NextResponse.json(candidate);
  },

  async update(req: Request) {
    const { id, name, categoryId } = await req.json();
    const candidate = await candidateService.update({ id, name, categoryId });
    return NextResponse.json(candidate);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await candidateService.remove(id);
    return NextResponse.json({ message: "Candidate deleted" });
  },
};