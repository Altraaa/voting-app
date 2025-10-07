import { useQuery } from "@tanstack/react-query";
import { PaymentRoute } from "@/routes/paymentRoute";
import { DuitkuPaymentMethodResponse } from "@/config/types/dutikuType";

export const usePaymentMethods = (amount: number, enabled: boolean = true) => {
  return useQuery<DuitkuPaymentMethodResponse>({
    queryKey: ["payment-methods", amount],
    queryFn: () => PaymentRoute.getPaymentMethods(amount),
    enabled: enabled && amount > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
