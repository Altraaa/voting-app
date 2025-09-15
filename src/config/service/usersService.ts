import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, name: true, points: true, role: true },
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

  async update(data: { id: string; firstName: string; lastName: string; email: string; name: string; terms: boolean; newsLetter: boolean; role: Role }) {
    return prisma.user.update({
      where: { id: data.id },
      data: { firstName: data.firstName, lastName: data.lastName, email: data.email, name: data.name, terms: data.terms, newsLetter: data.newsLetter, role: data.role },
    });
  },

  async remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};