import { useState } from "react";
import { usePointVotes } from "./usePointVotes";
import { PointVotesCreatePayload } from "@/config/types/pointVotesType";

export const usePurchasePoints = () => {
  const { mutations } = usePointVotes();
  const [isProcessing, setIsProcessing] = useState(false);

  const purchasePoints = async (purchaseData: PointVotesCreatePayload) => {
    try {
      setIsProcessing(true);
      const result = await mutations.createMutation.mutateAsync(purchaseData);
      return result;
    } catch (error) {
      console.error("Purchase failed:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentCallback = async (callbackData: any) => {
    try {
      const result = await mutations.paymentCallbackMutation.mutateAsync(
        callbackData
      );
      return result;
    } catch (error) {
      console.error("Payment callback failed:", error);
      throw error;
    }
  };

  return {
    purchasePoints,
    handlePaymentCallback,
    isProcessing: isProcessing || mutations.createMutation.isPending,
    isProcessingCallback: mutations.paymentCallbackMutation.isPending,
    error:
      mutations.createMutation.error || mutations.paymentCallbackMutation.error,
  };
};
