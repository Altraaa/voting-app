import { prisma } from "@/lib/prisma";

export const pointsService = {
  async addPoints(userId: string, points: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });
  },
};
