import { prisma } from "@/lib/prisma";
import { UsersCreatePayload, UsersUpdatePayload } from "../types/usersType";

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, points: true, role: true },
    });
  },

  async create(data: UsersCreatePayload) {
    return prisma.user.create({ data });
  },

  async update(data: UsersUpdatePayload) {
    return prisma.user.update({
      where: { id: data.id },
      data: { name: data.name, role: data.role },
    });
  },

  async remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};