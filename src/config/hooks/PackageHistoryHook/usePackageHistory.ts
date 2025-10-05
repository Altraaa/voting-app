import { usePackageHistoryMutations } from "./packageHistoryMutation";
import { usePackageHistoryQueries } from "./packageHistoryQueries";

export const usePackageHistory = () => {
  const queries = usePackageHistoryQueries;
  const mutations = usePackageHistoryMutations();

  return {
    queries,
    mutations,
  };
};