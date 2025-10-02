import { NextResponse } from "next/server";
import { categoryService } from "../services/categoryService";

export const categoryController = {
  async getAll() {
    const categories = await categoryService.getAll();
    return NextResponse.json(categories);
  },

  async getAllSimple() {
    const categories = await categoryService.getAllSimple();
    return NextResponse.json(categories);
  },

  async getById(id: string) {
    const category = await categoryService.getById(id);
    return NextResponse.json(category);
  },

  async create(req: Request) {
    const data = await req.json();
    const category = await categoryService.create(data);
    return NextResponse.json(category);
  },

  async update(req: Request) {
    const data = await req.json();
    const category = await categoryService.update(data);
    return NextResponse.json(category);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await categoryService.remove(id);
    return NextResponse.json({ message: "Category deleted" });
  },
};
