import { useCandidateMutations } from "./candidateMutation";
import { useCandidateQueries } from "./candidateQueries";

export const useCandidates = () => {
  const queries = useCandidateQueries;
  const mutations = useCandidateMutations();

  return {
    queries,
    mutations,
  };
};
