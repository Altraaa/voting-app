import { useVoteMutation } from "./voteMutation";
import { useVoteQueries } from "./voteQueries";

export const useVotes = () => {
    const queries = useVoteQueries;
    const mutations = useVoteMutation();

    return {
        queries,
        mutations,
    };
};
