import { usePackageMutations } from "./packageMutation";
import { usePackageQueries } from "./packageQueries";

export const usePackage = () => {
  const queries = usePackageQueries;
  const mutations = usePackageMutations();

  return {
    queries,
    mutations,
  };
};