import { DuitkuPaymentMethodResponse } from "@/config/types/dutikuType";
import { ApiRequest } from "@/lib/api";

export const PaymentRoute = {
  getPaymentMethods: (amount: number): Promise<DuitkuPaymentMethodResponse> =>
    ApiRequest({
      url: "payment/methods",
      method: "POST",
      body: { amount },
    }),
};
