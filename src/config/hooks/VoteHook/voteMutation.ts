import { useApiMutation } from "@/config/constants/useApiMutate";
import { VoteCreatePayload } from "@/config/types/voteType";
import { IVotes } from "@/config/models/VotesModel";
import { VoteRoute } from "@/routes/voteRoute";
import { VOTE_QUERY_KEYS } from "./voteQueryKey";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { USER_QUERY_KEYS } from "../UsersHook/usersQueryKey";
import { CATEGORY_QUERY_KEYS } from "../CategoryHook/categoryQueryKey";

const invalidateVoteQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: VOTE_QUERY_KEYS.all,
  });
  queryClient.invalidateQueries({
    queryKey: CATEGORY_QUERY_KEYS.all,
  });
  queryClient.invalidateQueries({
    queryKey: USER_QUERY_KEYS.profile(),
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
