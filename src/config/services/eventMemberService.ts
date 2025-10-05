import { prisma } from "@/lib/prisma";
import { EventMemberCreatePayload } from "../types/eventMemberType";

export const eventMemberService = {
  async getAll() {
    return prisma.eventMember.findMany({
      include: {
        user: true,
        event: true,
      },
    });
  },

  async getByEventId(eventId: string) {
    return prisma.eventMember.findMany({
      where: { eventId },
      include: {
        user: true,
      },
    });
  },

  async create(data: EventMemberCreatePayload) {
    return prisma.eventMember.create({ data });
  },

  async remove(id: string) {
    return prisma.eventMember.delete({ where: { id } });
  },

  async removeByUserAndEvent(userId: string, eventId: string) {
    return prisma.eventMember.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  },
};