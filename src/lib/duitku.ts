import {
  DuitkuPaymentRequest,
  DuitkuPaymentResponse,
  PaymentData,
} from "@/config/types/dutikuType";
import crypto from "crypto";

export class DuitkuService {
  static generateSignature(
    merchantCode: string,
    paymentAmount: number,
    merchantOrderId: string,
    apiKey: string
  ): string {
    const plainText = merchantCode + paymentAmount + merchantOrderId + apiKey;
    return crypto.createHash("md5").update(plainText).digest("hex");
  }

  static async createPayment(paymentData: PaymentData): Promise<DuitkuPaymentResponse> {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const callbackUrl = process.env.DUITKU_CALLBACK_URL!;
    const returnUrl = process.env.DUITKU_RETURN_URL!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

    const signature = this.generateSignature(
      merchantCode,
      paymentData.paymentAmount,
      paymentData.merchantOrderId,
      apiKey
    );

    const paymentRequest: DuitkuPaymentRequest = {
      merchantCode,
      paymentAmount: paymentData.paymentAmount,
      merchantOrderId: paymentData.merchantOrderId,
      productDetails: paymentData.productDetails,
      email: paymentData.email,
      customerVaName: paymentData.customerName,
      phoneNumber: paymentData.phoneNumber,
      callbackUrl,
      returnUrl,
      signature,
      expiryPeriod: 60,
      paymentMethod: paymentData.paymentMethod,
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
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Duitku API error response:", errorText);
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
