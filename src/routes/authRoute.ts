import { AuthResponse, LoginPayload } from "@/config/types/authType";
import { RegisterPayload } from "@/config/types/registerType";
import { ApiRequest } from "@/lib/api";

export const authRoute = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    ApiRequest({
      url: "auth/register",
      method: "POST",
      body: payload,
    }),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    ApiRequest({
      url: "auth/login",
      method: "POST",
      body: payload,
    }),

  logout: () =>
    ApiRequest({
      url: "/auth/logout",
      method: "DELETE",
    }),
};
