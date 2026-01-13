import { useSettingsMutations } from "./settingsMutation";
import { useSettingsQueries } from "./settingsQueries";

export const useSettings = () => {
  const queries = useSettingsQueries;
  const mutations = useSettingsMutations();

  return {
    queries,
    mutations,
  };
};
