import { AuthResponse, LoginPayload } from "@/config/types/authType";
import { otpPayload } from "@/config/types/otpType";
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

  verifyOtp: (payload: otpPayload): Promise<AuthResponse> =>
    ApiRequest({
      url: "auth/verify-otp",
      method: "POST",
      body: payload,
    }),

  resendOtp: (email: string): Promise<AuthResponse> =>
    ApiRequest({
      url: "auth/resend-otp",
      method: "POST",
      body: { email },
    }),

  logout: () =>
    ApiRequest({
      url: "/auth/logout",
      method: "DELETE",
    }),
};
