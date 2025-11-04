import { prisma } from "@/lib/prisma";
import {
  PointVotesCreatePayload,
  PointVotesUpdatePayload,
  DuitkuCallbackPayload,
} from "../types/pointVotesType";
import { PaymentStatus } from "@/generated/prisma";

export const pointVotesService = {
  async getAll() {
    return prisma.pointVotes.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            points: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getById(id: string) {
    return prisma.pointVotes.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            points: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
    });
  },

  async getByMerchantOrderId(merchantOrderId: string) {
    return prisma.pointVotes.findUnique({
      where: { merchantOrderId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            points: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
    });
  },

  async create(data: PointVotesCreatePayload) {
    return prisma.pointVotes.create({
      data: {
        ...data,
        payment_status: PaymentStatus.pending,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            points: true,
          },
        },
        package: data.packageId
          ? {
              select: {
                id: true,
                name: true,
                points: true,
              },
            }
          : false,
      },
    });
  },

  async update(data: PointVotesUpdatePayload) {
    return prisma.pointVotes.update({
      where: { id: data.id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            points: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
    });
  },

  async updatePaymentStatus(
    merchantOrderId: string,
    payment_status: PaymentStatus
  ) {
    return prisma.pointVotes.update({
      where: { merchantOrderId },
      data: { payment_status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            points: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
    });
  },

  async handleDuitkuCallback(callbackData: DuitkuCallbackPayload) {
    try {
      const pointVote = await this.getByMerchantOrderId(
        callbackData.merchantOrderId
      );

      if (!pointVote) {
        throw new Error("Transaction not found");
      }

      let paymentStatus: PaymentStatus;
      switch (callbackData.resultCode) {
        case "00":
          paymentStatus = PaymentStatus.success;
          break;
        case "01":
          paymentStatus = PaymentStatus.pending;
          break;
        default:
          paymentStatus = PaymentStatus.failed;
      }

      const updatedPointVote = await this.updatePaymentStatus(
        callbackData.merchantOrderId,
        paymentStatus
      );

      if (paymentStatus === PaymentStatus.success) {
        await this.addPointsToUser(pointVote.userId, pointVote.points);

        await this.createPackageHistory(
          pointVote.userId,
          pointVote.packageId,
          pointVote.points
        );
      }

      return updatedPointVote;
    } catch (error) {
      console.error("Error handling duitku callback:", error);
      throw error;
    }
  },

  async addPointsToUser(userId: string, points: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  },

  async createPackageHistory(
    userId: string,
    packageId: string | null | undefined,
    pointsReceived: number
  ) {
    if (!packageId) {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      return prisma.packageHistory.create({
        data: {
          userId,
          packageId: "",
          pointsReceived,
          validUntil,
          isActive: true,
        },
      });
    }

    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      throw new Error("Package not found");
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + packageData.validityDays);

    return prisma.packageHistory.create({
      data: {
        userId,
        packageId,
        pointsReceived,
        validUntil,
        isActive: true,
      },
    });
  },

  async remove(id: string) {
    return prisma.pointVotes.delete({ where: { id } });
  },
};
