import { NextResponse } from "next/server";
import { packageService } from "../services/packageService";

export const packageController = {
  async getAll() {
    const packages = await packageService.getAll();
    return NextResponse.json(packages);
  },

  async getById(id: string) {
    const pkg = await packageService.getById(id);
    return NextResponse.json(pkg)
  },

  async create(req: Request) {
    const data = await req.json();
    const pkg = await packageService.create(data);
    return NextResponse.json(pkg);
  },

  async update(req: Request) {
    const { id, ...data } = await req.json();
    const pkg = await packageService.update(id, data);
    return NextResponse.json(pkg);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await packageService.remove(id);
    return NextResponse.json({ message: "Package deleted" });
  },
};
