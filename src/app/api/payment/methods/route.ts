import { paymentController } from "@/config/controllers/paymentController";

export async function POST(req: Request) {
  return paymentController.getPaymentMethods(req);
}