import { useState } from "react";
import { usePointVotes } from "./usePointVotes";
import { PointVotesCreatePayload } from "@/config/types/pointVotesType";
import { PaymentInitiate } from "@/config/types/dutikuType";

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

  const initiatePayment = async (paymentData: PaymentInitiate) => {
    try {
      const result = await mutations.paymentInitiateMutation.mutateAsync(
        paymentData
      );
      return result;
    } catch (error) {
      console.error("Payment initiation failed:", error);
      throw error;
    }
  };

  const purchaseAndPay = async (
    purchaseData: PointVotesCreatePayload,
    paymentMethod: string
  ) => {
    try {
      setIsProcessing(true);

      const purchaseResult = await purchasePoints(purchaseData);

      const paymentResult = await initiatePayment({
        pointVoteId: purchaseResult.data.id,
        paymentMethod: paymentMethod,
      });

      return paymentResult;
    } catch (error) {
      console.error("Purchase and pay failed:", error);
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
    initiatePayment,
    purchaseAndPay,
    handlePaymentCallback,
    isProcessing:
      isProcessing ||
      mutations.createMutation.isPending ||
      mutations.paymentInitiateMutation.isPending,
    isProcessingCallback: mutations.paymentCallbackMutation.isPending,
    error:
      mutations.createMutation.error ||
      mutations.paymentInitiateMutation.error ||
      mutations.paymentCallbackMutation.error,
  };
};
