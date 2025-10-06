import { DuitkuPaymentRequest, DuitkuPaymentResponse } from "@/config/types/dutikuType";
import crypto from "crypto";

export class DuitkuService {
  static generateSignature(
    merchantCode: string,
    merchantOrderId: string,
    paymentAmount: number,
    apiKey: string
  ): string {
    const plainText = merchantCode + merchantOrderId + paymentAmount + apiKey;
    return crypto.createHash("md5").update(plainText).digest("hex");
  }

  static async createPayment(paymentData: {
    merchantOrderId: string;
    paymentAmount: number;
    productDetails: string;
    email: string;
    customerName: string;
    paymentMethod: string;
  }): Promise<DuitkuPaymentResponse> {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const callbackUrl = process.env.DUITKU_CALLBACK_URL!;
    const returnUrl = process.env.DUITKU_RETURN_URL!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

    const signature = this.generateSignature(
      merchantCode,
      paymentData.merchantOrderId,
      paymentData.paymentAmount,
      apiKey
    );

    const paymentRequest: DuitkuPaymentRequest = {
      merchantCode,
      paymentAmount: paymentData.paymentAmount,
      merchantOrderId: paymentData.merchantOrderId,
      productDetails: paymentData.productDetails,
      email: paymentData.email,
      customerVaName: paymentData.customerName,
      callbackUrl,
      returnUrl,
      paymentMethod: paymentData.paymentMethod,
      signature,
      expiryPeriod: 60, // 60 menit
      itemDetails: [
        {
          name: paymentData.productDetails,
          price: paymentData.paymentAmount,
          quantity: 1,
        },
      ],
    };

    try {
      console.log("Sending payment request to Duitku:", {
        url: `${baseUrl}/merchant/v2/inquiry`,
        data: paymentRequest,
      });

      const response = await fetch(`${baseUrl}/merchant/v2/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": JSON.stringify(paymentRequest).length.toString(),
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Duitku API Response:", data);

      if (data.statusCode !== "00") {
        throw new Error(
          `Duitku API Error: ${data.statusCode} - ${data.statusMessage}`
        );
      }

      return data;
    } catch (error) {
      console.error("Duitku payment creation error:", error);
      throw new Error(
        `Failed to create payment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static validateCallbackSignature(callbackData: any): boolean {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const { amount, merchantOrderId } = callbackData;
    const plainText = merchantCode + amount + merchantOrderId + apiKey;
    const signature = crypto.createHash("md5").update(plainText).digest("hex");

    return signature === callbackData.signature;
  }
}
