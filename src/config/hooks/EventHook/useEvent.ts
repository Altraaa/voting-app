import { useEventMutations } from "./eventMutation";
import { useEventQueries } from "./eventQueries";

export const useEvent = () => {
  const queries = useEventQueries;
  const mutations = useEventMutations();

  return {
    queries,
    mutations,
  };
};