// controllers/paymentController.ts
import { NextResponse } from "next/server";
import { DuitkuService } from "@/lib/duitku";

export const paymentController = {
  // Get available payment methods
  async getPaymentMethods(req: Request) {
    try {
      const { amount } = await req.json();

      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

      const paymentMethods = await DuitkuService.getPaymentMethods(amount);

      return NextResponse.json({
        success: true,
        data: paymentMethods,
      });
    } catch (error) {
      console.error("Get payment methods error:", error);
      return NextResponse.json(
        {
          error: "Failed to get payment methods",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },
};
