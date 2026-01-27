import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthResponse } from "@/config/types/authType";
import { authRoute } from "@/routes/authRoute";

export const useResendOtp = () => {
  const mutation = useMutation<AuthResponse, Error, string>({
    mutationFn: authRoute.resendOtp,
    onSuccess: () => {
      toast.success("Kode OTP baru telah dikirim ke email kamu ✉️");
    },
    onError: (error) => {
      console.error("Resend OTP error:", error);
      toast.error(error.message || "Gagal mengirim ulang OTP");
    },
  });

  return {
    resendOtp: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};