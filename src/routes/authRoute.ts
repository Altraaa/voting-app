import { LoginPayload } from "@/config/types/loginType";
import { RegisterPayload } from "@/config/types/registerType";
import { ApiRequest } from "@/lib/api";

export const registerRoute = (payload: RegisterPayload) =>
  ApiRequest({
    url: "auth/register",
    method: "POST",
    body: payload,
  });

export const loginRoute = (payload: LoginPayload) =>
  ApiRequest({
    url: "auth/login",
    method: "POST",
    body: payload,
  });

export const logout = () =>
  ApiRequest({
    url: "/auth/logout",
    method: "DELETE",
  });