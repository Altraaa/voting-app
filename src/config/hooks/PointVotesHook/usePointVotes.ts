import { usePointVotesMutations } from "./pointVotesMutation";
import { usePointVotesQueries } from "./pointVotesQueries";

export const usePointVotes = () => {
  const queries = usePointVotesQueries;
  const mutations = usePointVotesMutations();

  return {
    queries,
    mutations,
  };
};
