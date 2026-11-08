import { PointVotes, PaymentStatus } from "@/generated/prisma";

export type PointVotesBasePayload = {
  userId: string;
  packageId?: string;
  points: number;
  amount: number;
  payment_status: PaymentStatus;
  merchantOrderId: string;
  reference?: string;
  paymentMethod: string;
  phoneNumber?: string;
};

// Dipakai server untuk menyimpan transaksi. points, amount, userId dan
// merchantOrderId dihitung/di-generate di server, status selalu "pending".
export type PointVotesCreatePayload = Omit<
  PointVotesBasePayload,
  "payment_status"
>;

// Payload yang dikirim client ke POST /api/points/votes.
// Harga TIDAK dikirim: server menghitungnya dari packageId (tabel Package)
// atau dari points (custom, Rp 1.000/poin). userId diambil dari session.
export type PointVotesPurchasePayload = {
  packageId?: string;
  points?: number;
  paymentMethod: string;
  phoneNumber: string;
};

export type PointVotesUpdatePayload = Partial<PointVotesBasePayload> & {
  id: string;
};

export type DuitkuCallbackPayload = {
  merchantCode: string;
  amount: number;
  merchantOrderId: string;
  productDetail: string;
  additionalParam: string;
  paymentCode: string;
  resultCode: string;
  merchantUserId: string;
  reference: string;
  signature: string;
  paymentMethod?: string;
  vaNumber?: string;
  issuer?: string;
};

export interface IPointVotes extends PointVotes {
  user: {
    id: string;
    email: string;
    points: number;
  };
  package: {
    id: string;
    name: string;
    points: number;
  };
}

export interface PointVotesCreateResponse {
  success: boolean;
  data: IPointVotes & { paymentUrl?: string };
  message: string;
}

