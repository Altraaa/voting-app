import { prisma } from "@/lib/prisma";
import { PackageCreatePayload, PackageUpdatePayload } from "../types/packageType";

export const packageService = {
  async getAll() {
    return prisma.package.findMany();
  },

  async getById(id: string) {
    return prisma.package.findUnique({
      where: {id}
    });
  },

  async create(data: PackageCreatePayload) {
    return prisma.package.create({ data });
  },

  async update(id: string, data: PackageUpdatePayload) {
    return prisma.package.update({
      where: { id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.package.delete({ where: { id } });
  },
};
