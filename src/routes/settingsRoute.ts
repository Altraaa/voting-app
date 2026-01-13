import { ISettings, SettingsUpdatePayload } from "@/config/types/settingsType";
import { ApiRequest } from "@/lib/api";

export const SettingsRoute = {
  get: (): Promise<ISettings> =>
    ApiRequest({
      url: "settings",
      method: "GET",
    }),

  update: (data: SettingsUpdatePayload): Promise<ISettings> =>
    ApiRequest({
      url: "settings",
      method: "PUT",
      body: data,
    }),
};
