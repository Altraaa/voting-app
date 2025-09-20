import { PaymentStatus } from "@/generated/prisma";

export interface IPointVotes {
  id: string;
  user_id: string;
  points: number;
  ammount: number;
  payment_status: PaymentStatus;
  created_at: string;
}