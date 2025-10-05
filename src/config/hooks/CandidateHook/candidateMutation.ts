import {
  CandidatesCreatePayload,
  CandidatesUpdatePayload,
} from "@/config/types/candidatesType";
import { ICandidate } from "@/config/models/CandidateModel";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { CANDIDATE_QUERY_KEYS } from "./candidateQueryKey";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { CandidateRoute } from "@/routes/candidateRoute";
import { toast } from "sonner";
import { getErrorMessage } from "@/config/utils/ErrorHandler";

const invalidateCandidateQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: CANDIDATE_QUERY_KEYS.all,
  });
};

export const useCandidateMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<ICandidate, CandidatesCreatePayload>(
    (data) => CandidateRoute.create(data),
    {
      onSuccess: () => {
        invalidateCandidateQueries(queryClient);
        toast.success("Kandidat berhasil dibuat");
      },
      onError: (error) => {
        toast.error("Gagal membuat kandidat", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat membuat kandidat",
        });
      },
    }
  );

  const updateMutation = useApiMutation<ICandidate, CandidatesUpdatePayload>(
    (data) => CandidateRoute.update(data),
    {
      onSuccess: (updatedCandidate) => {
        queryClient.setQueryData(
          CANDIDATE_QUERY_KEYS.detail(updatedCandidate.id),
          updatedCandidate
        );
        invalidateCandidateQueries(queryClient);
        toast.success("Kandidat berhasil diperbarui");
      },
      onError: (error) => {
        toast.error("Gagal memperbarui kandidat", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat memperbarui kandidat",
        });
      },
    }
  );

  const removeMutation = useApiMutation<ICandidate, string>(
    (id) => CandidateRoute.remove(id),
    {
      onSuccess: (_, id) => {
        queryClient.removeQueries({
          queryKey: CANDIDATE_QUERY_KEYS.detail(id),
        });
        invalidateCandidateQueries(queryClient);
        toast.success("Kandidat berhasil dihapus");
      },
      onError: (error) => {
        toast.error("Gagal menghapus kandidat", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat menghapus kandidat",
        });
      },
    }
  );

  return {
    createMutation,
    updateMutation,
    removeMutation,
  };
};
