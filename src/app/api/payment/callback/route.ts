import { pointVotesService } from "@/config/services/pointVotesService";
import { DuitkuCallbackPayload } from "@/config/types/pointVotesType";
import { DuitkuService } from "@/lib/duitku";

export async function POST(req: Request) {
  try {
    console.log("=== DUITKU CALLBACK HIT ===");

    const rawBody = await req.text();
    console.log("Raw callback body:", rawBody);

    const params = new URLSearchParams(rawBody);
    const rawObject = Object.fromEntries(params.entries());

    // cast ke tipe partial, lalu refine manual
    const callbackData: DuitkuCallbackPayload = {
      merchantCode: rawObject.merchantCode,
      amount: Number(rawObject.amount), // convert string ke number
      merchantOrderId: rawObject.merchantOrderId,
      productDetail: rawObject.productDetail,
      additionalParam: rawObject.additionalParam,
      paymentCode: rawObject.paymentCode,
      resultCode: rawObject.resultCode,
      merchantUserId: rawObject.merchantUserId,
      reference: rawObject.reference,
      signature: rawObject.signature,
      paymentMethod: rawObject.paymentMethod,
      vaNumber: rawObject.vaNumber,
      issuer: rawObject.issuer,
    };

    const isValidSignature =
      DuitkuService.validateCallbackSignature(callbackData);
    if (!isValidSignature) {
      console.error("❌ Invalid signature from Duitku callback");
      return new Response("INVALID_SIGNATURE");
    }

    const result = await pointVotesService.handleDuitkuCallback(callbackData);
    console.log("✅ Callback processed successfully:", result);

    return new Response("SUCCESS");
  } catch (error) {
    console.error("=== DUITKU CALLBACK ERROR ===");
    console.error(error);
    return new Response("ERROR");
  }
}
