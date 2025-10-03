import { prisma } from "@/lib/prisma";
import {
  CandidatesCreatePayload,
  CandidatesUpdatePayload,
} from "../types/candidatesType";

export const candidateService = {
  async getAll() {
    return prisma.candidate.findMany({
      include: { category: true, votes: true },
    });
  },

  async getById(id: string) {
    return prisma.candidate.findUnique({
      where: { id },
      include: { category: true, votes: true },
    });
  },

  async create(data: CandidatesCreatePayload) {
    return prisma.candidate.create({ data });
  },

  async update(data: CandidatesUpdatePayload) {
    return prisma.candidate.update({
      where: { id: data.id },
      data: { name: data.name, categoryId: data.categoryId },
    });
  },

  async remove(id: string) {
    return prisma.candidate.delete({ where: { id } });
  },
};
