import { PointVotes, PaymentStatus } from "@/generated/prisma";

export type PointVotesBasePayload = {
  userId: string;
  packageId: string;
  points: number;
  amount: number;
  payment_status: PaymentStatus;
  merchantOrderId: string;
  reference?: string;
  paymentMethod: string;
  phoneNumber?: string;
};

export type PointVotesCreatePayload = PointVotesBasePayload;

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

