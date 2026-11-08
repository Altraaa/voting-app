import { prisma } from "@/lib/prisma";
import {
  PointVotesCreatePayload,
  PointVotesUpdatePayload,
  DuitkuCallbackPayload,
} from "../types/pointVotesType";
import { PaymentStatus, Prisma } from "@/generated/prisma";

// Client transaksi (`tx`) atau client global; keduanya punya delegate yang sama.
type DbClient = Prisma.TransactionClient;

const pointVoteInclude = {
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
} satisfies Prisma.PointVotesInclude;

/** Error callback yang membawa HTTP status untuk dikembalikan ke Duitku. */
export class PaymentCallbackError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "PaymentCallbackError";
  }
}

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
        userId: data.userId,
        packageId: data.packageId ?? null,
        points: data.points,
        amount: data.amount,
        payment_status: PaymentStatus.pending,
        merchantOrderId: data.merchantOrderId,
        reference: data.reference,
        paymentMethod: data.paymentMethod,
        phoneNumber: data.phoneNumber,
      },
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

  /**
   * Idempotent: callback yang sama boleh datang berkali-kali (retry Duitku,
   * replay manual), tetapi poin hanya ditambahkan sekali. Update status
   * dilakukan secara kondisional (`payment_status != success`) di dalam
   * transaksi, sehingga dua callback yang datang bersamaan pun hanya satu
   * yang mendapat `count === 1`.
   */
  async handleDuitkuCallback(callbackData: DuitkuCallbackPayload) {
    const { merchantOrderId } = callbackData;

    try {
      return await prisma.$transaction(async (tx) => {
        const pointVote = await tx.pointVotes.findUnique({
          where: { merchantOrderId },
          include: pointVoteInclude,
        });

        if (!pointVote) {
          throw new PaymentCallbackError("Transaction not found", 404);
        }

        if (pointVote.payment_status === PaymentStatus.success) {
          console.log(
            `[Duitku callback] ${merchantOrderId} sudah success, diabaikan`
          );
          return pointVote;
        }

        if (Number(callbackData.amount) !== pointVote.amount) {
          console.error(
            `[Duitku callback] Amount tidak cocok untuk ${merchantOrderId}: ` +
              `callback=${callbackData.amount}, db=${pointVote.amount}`
          );
          throw new PaymentCallbackError("Amount mismatch", 400);
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

        const { count } = await tx.pointVotes.updateMany({
          where: {
            merchantOrderId,
            payment_status: { not: PaymentStatus.success },
          },
          data: { payment_status: paymentStatus },
        });

        if (count === 1 && paymentStatus === PaymentStatus.success) {
          await this.addPointsToUser(pointVote.userId, pointVote.points, tx);

          await this.createPackageHistory(
            pointVote.userId,
            pointVote.packageId,
            pointVote.points,
            tx
          );
        }

        return tx.pointVotes.findUnique({
          where: { merchantOrderId },
          include: pointVoteInclude,
        });
      });
    } catch (error) {
      console.error("Error handling duitku callback:", error);
      throw error;
    }
  },

  async addPointsToUser(userId: string, points: number, db: DbClient = prisma) {
    return db.user.update({
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
    pointsReceived: number,
    db: DbClient = prisma
  ) {
    if (!packageId) {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      return db.packageHistory.create({
        data: {
          userId,
          packageId: null,
          pointsReceived,
          validUntil,
          isActive: true,
        },
      });
    }

    const packageData = await db.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      throw new Error("Package not found");
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + packageData.validityDays);

    return db.packageHistory.create({
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
