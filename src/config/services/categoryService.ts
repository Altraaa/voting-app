import { prisma } from "@/lib/prisma";

export const categoryService = {
  async getAll() {
    return prisma.category.findMany();
  },

  async create(data: { name: string }) {
    return prisma.category.create({
      data,
    });
  },

  async update(data: { id: string; name: string }) {
    return prisma.category.update({
      where: { id: data.id },
      data: { name: data.name },
    });
  },

  async remove(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },
};