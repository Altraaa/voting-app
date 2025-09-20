import { prisma } from "@/lib/prisma";

export const packageHistoryService = {
  async getAll() {
    return prisma.packageHistory.findMany({
      include: {
        user: true,
        package: true,
      },
    });
  },

  async getByUserId(userId: string) {
    return prisma.packageHistory.findMany({
      where: { userId },
      include: {
        package: true,
      },
    });
  },

  async create(data: {
    userId: string;
    packageId: string;
    pointsReceived: number;
    validUntil: Date;
  }) {
    return prisma.packageHistory.create({
      data: {
        ...data,
        isActive: new Date() < data.validUntil,
      },
    });
  },

  async update(id: string, data: Partial<{ isActive: boolean }>) {
    return prisma.packageHistory.update({
      where: { id },
      data,
    });
  },
};
