import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { POINT_VOTES_QUERY_KEYS } from "./pointVotesQueryKey";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { PointVotesRoute } from "@/routes/pointVotesRoute";
import { toast } from "sonner";
import { getErrorMessage } from "@/config/utils/ErrorHandler";
import {
  PointVotesCreatePayload,
  DuitkuCallbackPayload,
  PointVotesCreateResponse,
} from "@/config/types/pointVotesType";
import { IPointVotes } from "@/config/models/PointVotesModel";
import { PaymentInitiate } from "@/config/types/dutikuType";

const invalidatePointVotesQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: POINT_VOTES_QUERY_KEYS.all,
  });
};

export const usePointVotesMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<
    PointVotesCreateResponse,
    PointVotesCreatePayload
  >((data) => PointVotesRoute.create(data), {
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(
          POINT_VOTES_QUERY_KEYS.detail(response.data.id),
          response.data
        );

        invalidatePointVotesQueries(queryClient);

        toast.success("Pembelian points berhasil diproses");
      }
    },
    onError: (error) => {
      toast.error("Gagal memproses pembelian points", {
        description:
          getErrorMessage(error) ||
          "Terjadi kesalahan saat memproses pembelian",
      });
    },
  });

  const paymentInitiateMutation = useApiMutation<
    PointVotesCreateResponse,
    PaymentInitiate
  >((data) => PointVotesRoute.paymentInitiate(data), {
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(
          POINT_VOTES_QUERY_KEYS.detail(response.data.id),
          response.data
        );

        invalidatePointVotesQueries(queryClient);

        toast.success("Payment initiated successfully", {
          description: "Redirecting to payment page...",
        });

        if (response.data.paymentUrl) {
          setTimeout(() => {
            window.open(response.data.paymentUrl, "_blank");
          }, 1000);
        }
      }
    },
    onError: (error) => {
      toast.error("Gagal memproses pembayaran", {
        description:
          getErrorMessage(error) ||
          "Terjadi kesalahan saat memproses pembayaran",
      });
    },
  });

  const paymentCallbackMutation = useApiMutation<
    IPointVotes,
    DuitkuCallbackPayload
  >((data) => PointVotesRoute.paymentCallback(data), {
    onSuccess: (updatedPointVote) => {
      queryClient.setQueryData(
        POINT_VOTES_QUERY_KEYS.detail(updatedPointVote.id),
        updatedPointVote
      );

      invalidatePointVotesQueries(queryClient);

      if (updatedPointVote.payment_status === "success") {
        toast.success("Pembayaran berhasil", {
          description: `Points telah ditambahkan ke akun Anda`,
        });
      } else if (updatedPointVote.payment_status === "failed") {
        toast.error("Pembayaran gagal", {
          description: "Silakan coba lagi atau hubungi customer service",
        });
      }
    },
    onError: (error) => {
      toast.error("Gagal memproses callback pembayaran", {
        description:
          getErrorMessage(error) ||
          "Terjadi kesalahan saat memverifikasi pembayaran",
      });
    },
  });

  return {
    createMutation,
    paymentInitiateMutation,
    paymentCallbackMutation,
  };
};
