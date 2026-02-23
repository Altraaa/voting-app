// services/candidateService.ts
import { prisma } from "@/lib/prisma";
import {
  CandidatesCreatePayload,
  CandidatesUpdatePayload,
} from "../types/candidatesType";

export const candidateService = {
  async getAll() {
    return prisma.candidate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        video_url: true, // tambahkan
        categoryId: true,
        votes: {
          select: {
            userId: true,
            pointsUsed: true,
          },
        },
      },
    });
  },

  async getById(id: string) {
    return prisma.candidate.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        video_url: true, // tambahkan
        categoryId: true,
        votes: {
          select: {
            userId: true,
            pointsUsed: true,
          },
        },
      },
    });
  },

  async getByCategorId(categoryId: string) {
    return prisma.candidate.findMany({
      where: { categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        video_url: true, // tambahkan
        votes: {
          select: {
            userId: true,
            pointsUsed: true,
          },
        },
      },
    });
  },

  async create(data: CandidatesCreatePayload) {
    return prisma.candidate.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        photo_url: data.photo_url,
        video_url: data.video_url, // tambahkan (akan undefined jika tidak dikirim)
      },
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        video_url: true, // tambahkan
        categoryId: true,
      },
    });
  },

  async update(data: CandidatesUpdatePayload) {
    return prisma.candidate.update({
      where: { id: data.id },
      data: {
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        photo_url: data.photo_url,
        video_url: data.video_url, // tambahkan
      },
      select: {
        id: true,
        name: true,
        description: true,
        photo_url: true,
        video_url: true, // tambahkan
        categoryId: true,
      },
    });
  },

  async remove(id: string) {
    return prisma.candidate.delete({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  },
};
