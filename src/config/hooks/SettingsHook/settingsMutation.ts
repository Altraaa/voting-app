import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SETTINGS_QUERY_KEYS } from "./settingsQueryKey";
import { SettingsRoute } from "@/routes/settingsRoute";
import { SettingsUpdatePayload } from "@/config/types/settingsType";

export const useSettingsMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: SettingsUpdatePayload) => SettingsRoute.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
    },
  });

  return {
    updateMutation,
  };
};
