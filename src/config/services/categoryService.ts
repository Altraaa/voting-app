import { prisma } from "@/lib/prisma";

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({ include: { event: true } });
  },

  async create(data: { name: string; eventId: string }) {
    return prisma.category.create({ data });
  },

  async update(data: { id: string; name: string; eventId: string }) {
    return prisma.category.update({
      where: { id: data.id },
      data: { name: data.name, eventId: data.eventId },
    });
  },

  async remove(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};