import {
  DuitkuPaymentRequest,
  DuitkuPaymentResponse,
  PaymentData,
  DuitkuPaymentMethodRequest,
  DuitkuPaymentMethodResponse,
} from "@/config/types/dutikuType";
import { DuitkuCallbackPayload } from "@/config/types/pointVotesType";
import crypto from "crypto";

export class DuitkuService {
  static generatePaymentMethodSignature(
    merchantCode: string,
    amount: number,
    datetime: string,
    apiKey: string
  ): string {
    const plainText = `${merchantCode}${amount}${datetime}${apiKey}`;
    return crypto.createHash("sha256").update(plainText).digest("hex");
  }

  static generateTransactionSignature(
    merchantCode: string,
    merchantOrderId: string,
    paymentAmount: number,
    apiKey: string
  ): string {
    const plainText = `${merchantCode}${merchantOrderId}${paymentAmount}${apiKey}`;
    return crypto.createHash("md5").update(plainText).digest("hex");
  }

  static async getPaymentMethods(
    amount: number
  ): Promise<DuitkuPaymentMethodResponse> {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

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

  static async createPayment(
    paymentData: PaymentData
  ): Promise<DuitkuPaymentResponse> {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const callbackUrl = process.env.DUITKU_CALLBACK_URL!;
    const baseUrl = process.env.DUITKU_BASE_URL!;

    // Duitku me-redirect user ke returnUrl dengan query
    // ?merchantOrderId=...&resultCode=...&reference=..., jadi harus mengarah
    // ke halaman sukses, bukan ke halaman checkout (/payment).
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
    const returnUrl =
      process.env.DUITKU_RETURN_URL ||
      (appUrl ? `${appUrl}/payment/success` : "");

    if (!merchantCode || !apiKey || !callbackUrl || !returnUrl || !baseUrl) {
      throw new Error("Missing required environment variables for Duitku");
    }

    if (!returnUrl.replace(/\/+$/, "").endsWith("/payment/success")) {
      console.warn(
        `[Duitku] returnUrl "${returnUrl}" tidak berakhiran /payment/success. ` +
          "User akan diarahkan ke halaman yang salah setelah membayar. " +
          "Periksa DUITKU_RETURN_URL di .env."
      );
    }

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
      console.log("=== DUITKU CREATE PAYMENT DEBUG ===");
      console.log("Environment Variables:");
      console.log("- merchantCode:", merchantCode);
      console.log("- baseUrl:", baseUrl);
      console.log("- callbackUrl:", callbackUrl);
      console.log("- returnUrl:", returnUrl);

      console.log("\nPayment Data:");
      console.log("- merchantOrderId:", paymentData.merchantOrderId);
      console.log("- paymentAmount:", paymentData.paymentAmount);
      console.log("- paymentMethod:", paymentData.paymentMethod);
      console.log("- email:", paymentData.email);
      console.log("- customerName:", paymentData.customerName);
      console.log("- phoneNumber:", paymentData.phoneNumber);

      console.log("\nSignature Generation:");
      console.log(
        "- Plain text:",
        `${merchantCode}${paymentData.merchantOrderId}${paymentData.paymentAmount}${apiKey}`
      );
      console.log("- Generated signature:", signature);

      console.log("\nFull Request Body:");
      console.log(JSON.stringify(paymentRequest, null, 2));

      const response = await fetch(`${baseUrl}/merchant/v2/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      const responseText = await response.text();
      console.log("\nDuitku Response Status:", response.status);
      console.log("Duitku Response Body:", responseText);

      if (!response.ok) {
        console.error("=== DUITKU API ERROR ===");
        console.error("Status:", response.status);
        console.error("Response:", responseText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${responseText}`
        );
      }

      const data = JSON.parse(responseText);

      if (data.statusCode !== "00") {
        throw new Error(
          `Duitku API Error: ${data.statusCode} - ${data.statusMessage}`
        );
      }

      console.log("=== PAYMENT SUCCESS ===");
      return data;
    } catch (error) {
      console.error("=== DUITKU PAYMENT ERROR ===");
      console.error(error);
      throw new Error(
        `Failed to create payment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static validateCallbackSignature(
    callbackData: Pick<
      DuitkuCallbackPayload,
      "amount" | "merchantOrderId" | "signature"
    >
  ): boolean {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
    const apiKey = process.env.DUITKU_API_KEY!;
    const { amount, merchantOrderId } = callbackData;
    const plainText = `${merchantCode}${amount}${merchantOrderId}${apiKey}`;
    const signature = crypto.createHash("md5").update(plainText).digest("hex");

    return signature === callbackData.signature;
  }
}