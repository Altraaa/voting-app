import { prisma } from "@/lib/prisma";

export const voteService = {
  async createVote(userId: string, candidateId: string, points: number) {
    // 1. Dapatkan event melalui candidate dan category
    const candidateWithEvent = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        category: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!candidateWithEvent) {
      throw new Error("Candidate not found");
    }

    const event = candidateWithEvent.category.event;
    
    // 2. Validasi points harus kelipatan pointsPerVote
    if (points % event.pointsPerVote !== 0) {
      throw new Error(`Points must be a multiple of ${event.pointsPerVote}`);
    }

    // 3. Validasi event status
    const now = new Date();
    if (event.status === "ended") {
      throw new Error("Event has ended");
    }
    
    if (event.status === "upcoming") {
      throw new Error("Event has not started yet");
    }

    if (now < new Date(event.startDate)) {
      throw new Error("Event has not started yet");
    }

    if (now > new Date(event.endDate)) {
      throw new Error("Event has ended");
    }

    // 4. Validasi user points
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.points < points) {
      throw new Error("Insufficient points");
    }

    // 5. Create vote
    const vote = await prisma.vote.create({
      data: {
        userId,
        candidateId,
        pointsUsed: points, // Simpan jumlah poin yang digunakan
      },
    });

    // 6. Update user points
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
        candidate: { 
          select: { 
            id: true, 
            name: true, 
            category: {
              include: {
                event: true,
              },
            } 
          } 
        },
      },
    });
  },

  async getUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  async getCandidateWithEvent(candidateId: string) {
    return prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        category: {
          include: {
            event: true,
          },
        },
      },
    });
  },

  // Fungsi untuk menghitung suara berdasarkan poin
  async calculateVotesForCandidate(candidateId: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        votes: true,
        category: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!candidate) {
      return { totalPoints: 0, totalVotes: 0 };
    }

    const totalPoints = candidate.votes.reduce((sum, vote) => sum + vote.pointsUsed, 0);
    const pointsPerVote = candidate.category.event.pointsPerVote || 1;
    const totalVotes = Math.floor(totalPoints / pointsPerVote);

    return { totalPoints, totalVotes };
  },
};