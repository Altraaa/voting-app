import { prisma } from "@/lib/prisma";

export const voteService = {
  async createVote(userId: string, candidateId: string, points: number) {
    const vote = await prisma.vote.create({
      data: {
        userId,
        candidateId,
        pointsUsed: points,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: points } },
    });

    return vote;
  },

  async getVotes() {
    return prisma.vote.findMany({
      orderBy: { created: "desc" },
      include: {
        user: { select: { id: true, email: true, name: true } },
        candidate: { select: { id: true, name: true, category: true } },
      },
    });
  },

  async getUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },
};