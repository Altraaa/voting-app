import { prisma } from "@/lib/prisma";
import { UsersCreatePayload, UsersUpdatePayload, UsersUpdateProfilePayload } from "../types/usersType";

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, points: true, role: true },
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, points: true, role: true },
    });
  },

  async create(data: UsersCreatePayload) {
    return prisma.user.create({ data });
  },

  async update(data: UsersUpdatePayload) {
    const { id, ...updateData } = data;
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  },

  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        points: true,
        avatar_url: true,
        phone: true,
        _count: {
          select: {
            votes: true,
            packages: true,
          },
        },
      },
    });
  },

  async updateProfile(userId: string, data: UsersUpdateProfilePayload) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        points: true,
        role: true,
        avatar_url: true,
        phone: true,
      },
    });
  },

  async getUserVoteHistory(userId: string) {
    return prisma.vote.findMany({
      where: { userId },
      orderBy: { created: "desc" },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            photo_url: true,
            category: {
              select: {
                id: true,
                name: true,
                event: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async remove(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
