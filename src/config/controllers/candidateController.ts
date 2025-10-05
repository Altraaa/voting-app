import { NextResponse } from "next/server";
import { candidateService } from "../services/candidateService";

export const candidateController = {
  async getAll() {
    const candidates = await candidateService.getAll();
    return NextResponse.json(candidates);
  },

  async getById(id: string) {
    const candidate = await candidateService.getById(id);
    return NextResponse.json(candidate);
  },

  async getByCategorId(categoryId: string) {
    const candidates = await candidateService.getByCategorId(categoryId);
    return NextResponse.json(candidates);
  },

  async create(req: Request) {
    const { name, categoryId, description, photo_url } = await req.json();
    const candidate = await candidateService.create({ name, categoryId, description, photo_url });
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
