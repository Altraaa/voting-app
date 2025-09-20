import { prisma } from "@/lib/prisma";

export const candidateService = {
  async getAll() {
    return prisma.candidate.findMany({ include: { category: true } });
  },

  async create(data: { name: string; categoryId: string, description: string, photo_url: string }) {
    return prisma.candidate.create({ data });
  },

  async update(data: { id: string; name: string; categoryId: string }) {
    return prisma.candidate.update({
      where: { id: data.id },
      data: { name: data.name, categoryId: data.categoryId },
    });
  },

  async remove(id: string) {
    return prisma.candidate.delete({ where: { id } });
  },
};