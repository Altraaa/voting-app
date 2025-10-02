import { prisma } from "@/lib/prisma";
import { EventCreatePayload, EventUpdatePayload } from "../types/eventType";

export const eventService = {
  async getAll() {
    return prisma.event.findMany({
      include: { categories: true, users: true },
    });
  },

  async getAllSimple() {
    return prisma.event.findMany({
      select: { id: true, name: true },
    });
  },

  async getById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: { categories: true },
    });
  },

  async create(data: EventCreatePayload) {
    const eventData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
    return prisma.event.create({ data: eventData });
  },

  async update(data: EventUpdatePayload) {
    return prisma.event.update({
      where: { id: data.id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.event.delete({ where: { id } });
  },
};
