import { useApiQuery } from "@/config/constants/useApiQuery";
import { SETTINGS_QUERY_KEYS } from "./settingsQueryKey";
import { SettingsRoute } from "@/routes/settingsRoute";
import { ISettings } from "@/config/types/settingsType";

export const useSettingsQueries = {
  useGetSettings: () =>
    useApiQuery<ISettings>(SETTINGS_QUERY_KEYS.detail(), () =>
      SettingsRoute.get()
    ),
};
