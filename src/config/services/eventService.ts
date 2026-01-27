import { prisma } from "@/lib/prisma";
import { EventCreatePayload, EventUpdatePayload } from "../types/eventType";

export const eventService = {
  async getAll() {
    // First, automatically update any expired events
    await this.checkAndUpdateExpiredEvents();
    
    return prisma.event.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        status: true,
        startDate: true,
        endDate: true,
        isActive: true,
        categories: {
          select: {
            id: true,
            name: true,
            photo_url: true,
            _count: {
              select: {
                candidates: true,
              },
            },
          },
        },
        users: true,
      },
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
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        status: true,
        startDate: true,
        endDate: true,
        isActive: true,
        categories: {
          select: {
            id: true,
            name: true,
            photo_url: true,
            _count: {
              select: {
                candidates: true,
              },
            },
          },
        },
      },
    });
  },

  async create(data: EventCreatePayload) {
    const eventData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      pointsPerVote: Math.max(1, data.pointsPerVote || 1), // Pastikan minimal 1
    };
    return prisma.event.create({ data: eventData });
  },

  async update(data: EventUpdatePayload) {
    const updateData: Record<string, unknown> = { ...data };
    
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }
    if (data.pointsPerVote !== undefined) {
      updateData.pointsPerVote = Math.max(1, data.pointsPerVote); // Validasi minimal 1
    }

    return prisma.event.update({
      where: { id: data.id },
      data: updateData,
    });
  },

  // Check and update events that have passed their end date
  async checkAndUpdateExpiredEvents() {
    const now = new Date();
    
    // Get all non-ended events to debug
    const activeEvents = await prisma.event.findMany({
      where: {
        status: {
          in: ['live', 'upcoming'],
        },
      },
      select: {
        id: true,
        name: true,
        endDate: true,
        status: true,
      },
    });
    
    const debugInfo = {
      currentTime: now.toISOString(),
      currentTimeLocal: now.toString(),
      activeEvents: activeEvents.map(e => ({
        name: e.name,
        endDate: e.endDate.toISOString(),
        status: e.status,
        isExpired: e.endDate <= now,
      })),
    };
    
    const result = await prisma.event.updateMany({
      where: {
        endDate: {
          lte: now,
        },
        status: {
          in: ['live', 'upcoming'],
        },
      },
      data: {
        status: 'ended',
      },
    });
    
    return { count: result.count, debug: debugInfo };
  },

  async remove(id: string) {
    return prisma.event.delete({ where: { id } });
  },
};
