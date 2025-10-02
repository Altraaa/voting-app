import { useUploadMutations } from "./uploadImageMutation";

export const useUploadImage = () => {
  const mutations = useUploadMutations();

  return {
    mutations,
  };
};
