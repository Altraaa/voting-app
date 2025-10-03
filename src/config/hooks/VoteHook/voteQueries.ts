import { useApiQuery } from "@/config/constants/useApiQuery";
import { IVotes } from "@/config/models/VotesModel";
import { VoteRoute } from "@/routes/voteRoute";
import { VOTE_QUERY_KEYS } from "./voteQueryKey";

export const useVoteQueries = {
  useGetAllVotes: (filters?: string) =>
    useApiQuery<IVotes[]>(VOTE_QUERY_KEYS.list(filters), () =>
      VoteRoute.getAll()
    ),
};
