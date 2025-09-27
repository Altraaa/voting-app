import { useCategoryMutations } from "./categoryMutation";
import { useCategoryQueries } from "./categoryQueries"

export const useCategories = () => {
    const queries = useCategoryQueries;
    const mutations = useCategoryMutations();

    return {
        queries,
        mutations,
    };
};