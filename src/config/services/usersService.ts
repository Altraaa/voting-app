import { prisma } from "@/lib/prisma";
import { UsersCreatePayload, UsersUpdatePayload } from "../types/usersType";

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, name: true, points: true, role: true },
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: {id},
      select: { id: true, email: true, name: true, points: true, role: true }
    })
  },

  async create(data: UsersCreatePayload) {
    return prisma.user.create({ data });
  },

  async update(data: UsersUpdatePayload) {
    return prisma.user.update({
      where: { id: data.id },
      data: { firstName: data.firstName, lastName: data.lastName, email: data.email, name: data.name, terms: data.terms, newsLetter: data.newsLetter, role: data.role },
    });
  },

  async remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
