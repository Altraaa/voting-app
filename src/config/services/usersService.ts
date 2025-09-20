import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, points: true, role: true },
    });
  },

  async create(data: {
    email: string;
    name: string;
    password: string;
    role: Role;
  }) {
    return prisma.user.create({ data });
  },

  async update(data: { id: string; name: string; role: Role }) {
    return prisma.user.update({
      where: { id: data.id },
      data: { name: data.name, role: data.role },
    });
  },

  async remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};