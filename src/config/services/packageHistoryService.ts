import { prisma } from "@/lib/prisma";
import { PackageHistoryCreatePayload } from "../types/packageHistoryType";

export const packageHistoryService = {
  async getAll() {
    const histories = await prisma.packageHistory.findMany({
      include: {
        user: {
          select: { email: true, name: true },
        },
        package: {
          select: { name: true, price: true },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return histories.map(({ createdAt, updatedAt, ...rest }) => rest);
  },

  async getByUserId(userId: string) {
    return prisma.packageHistory.findMany({
      where: { userId },
      include: {
        package: true,
      },
    });
  },

  async create(data: PackageHistoryCreatePayload) {
    return prisma.packageHistory.create({
      data: {
        ...data,
        isActive: new Date() < new Date(data.validUntil),
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
