// lib/duitku.ts
import {
  DuitkuPaymentRequest,
  DuitkuPaymentResponse,
  PaymentData,
  DuitkuPaymentMethodRequest,
  DuitkuPaymentMethodResponse,
} from "@/config/types/dutikuType";
import crypto from "crypto";

export class DuitkuService {
  // Signature untuk get payment methods (MD5)
  static generatePaymentMethodSignature(
    merchantCode: string,
    amount: number,
    datetime: string,
    apiKey: string
  ): string {
    const plainText = `${merchantCode}${amount}${datetime}${apiKey}`;
    return crypto.createHash("sha256").update(plainText).digest("hex");
  }

  // Signature untuk create transaction (SHA256)
  static generateTransactionSignature(
    merchantCode: string,
    merchantOrderId: string,
    paymentAmount: number,
    apiKey: string
  ): string {
    const plainText = `${merchantCode}${merchantOrderId}${paymentAmount}${apiKey}`;
    return crypto.createHash("md5").update(plainText).digest("hex");
  }

  // Get available payment methods
  static async getPaymentMethods(
    amount: number
  ): Promise<DuitkuPaymentMethodResponse> {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

    // Format datetime: YYYY-MM-DD HH:mm:ss
    const datetime = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const signature = this.generatePaymentMethodSignature(
      merchantCode,
      amount,
      datetime,
      apiKey
    );

    const requestData: DuitkuPaymentMethodRequest = {
      merchantCode,
      amount,
      datetime,
      signature,
    };

    try {
      console.log("Requesting payment methods:", {
        url: `${baseUrl}/merchant/paymentmethod/getpaymentmethod`,
        data: requestData,
      });

      const response = await fetch(
        `${baseUrl}/merchant/paymentmethod/getpaymentmethod`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Duitku payment methods error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment methods response:", data);

      return data;
    } catch (error) {
      console.error("Failed to get payment methods:", error);
      throw new Error(
        `Failed to get payment methods: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Create payment transaction
  static async createPayment(
    paymentData: PaymentData
  ): Promise<DuitkuPaymentResponse> {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const callbackUrl = process.env.DUITKU_CALLBACK_URL!;
    const returnUrl = process.env.DUITKU_RETURN_URL!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

    const signature = this.generateTransactionSignature(
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
      console.log("Creating payment transaction:", {
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

  // Validate callback signature (MD5)
  static validateCallbackSignature(callbackData: any): boolean {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const { amount, merchantOrderId } = callbackData;
    const plainText = `${merchantCode}${amount}${merchantOrderId}${apiKey}`;
    const signature = crypto.createHash("md5").update(plainText).digest("hex");

    return signature === callbackData.signature;
  }
}
