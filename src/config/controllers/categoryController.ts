import { NextResponse } from "next/server";
import { categoryService } from "../services/categoryService";

export const categoryController = {
  async getAll() {
    const categories = await categoryService.getAll();
    return NextResponse.json(categories);
  },

  async create(req: Request) {
    const { name } = await req.json();
    const category = await categoryService.create({ name });
    return NextResponse.json(category);
  },

  async update(req: Request) {
    const { id, name } = await req.json();
    const category = await categoryService.update({ id, name });
    return NextResponse.json(category);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await categoryService.remove(id);
    return NextResponse.json({ message: "Category deleted" });
  },
};
