import { useApiMutation } from "@/config/constants/useApiMutate";
import { VoteCreatePayload } from "@/config/types/voteType";
import { IVotes } from "@/config/models/VotesModel";
import { VoteRoute } from "@/routes/voteRoute";
import { VOTE_QUERY_KEYS } from "./voteQueryKey";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const invalidateVoteQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: VOTE_QUERY_KEYS.all,
  });
};

export const useVoteMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<IVotes, VoteCreatePayload>(
    (data) => VoteRoute.create(data),
    {
      onSuccess: () => {
        invalidateVoteQueries(queryClient);
        toast.success("Voting berhasil!");
      },
      onError: () => {
        toast.error("Gagal voting");
      },
    }
  );

  return {
    createMutation,
  };
};
