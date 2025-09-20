import { prisma } from "@/lib/prisma";
import { EventCreatePayload, EventUpdatePayload } from "../types/eventType";

export const eventService = {
  async getAll() {
    return prisma.event.findMany({
      include: { categories: true, users: true },
    });
  },

  async create(data: EventCreatePayload) {
    return prisma.event.create({ data });
  },

  async update(id: string, data: EventUpdatePayload) {
    return prisma.event.update({
      where: { id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.event.delete({ where: { id } });
  },
};
