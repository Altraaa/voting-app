import { useUserMutations } from "./usersMutation";
import { useUserQueries } from "./usersQueries";


export const useUsers = () => {
  const queries = useUserQueries;
  const mutations = useUserMutations();

  return {
    queries,
    mutations,
  };
};
