import { prisma } from "@/lib/prisma";
import { CategoriesCreatePayload, CategoriesUpdatePayload } from "../types/categoriesType";

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({ include: { candidates: true } });
  },

  async getAllSimple() {
    return prisma.category.findMany({ select: { id: true, name: true } });
  },

  async getById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { candidates: true },
    });
  },

  async create(data: CategoriesCreatePayload) {
    return prisma.category.create({ data });
  },

  async update(data: CategoriesUpdatePayload) {
    return prisma.category.update({
      where: { id: data.id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
