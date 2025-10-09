import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthResponse } from "@/config/types/authType";
import { authRoute } from "@/routes/authRoute";
import { otpPayload } from "../types/otpType";

export const useVerifyOtp = () => {
  const router = useRouter();

  const mutation = useMutation<AuthResponse, Error, otpPayload>({
    mutationFn: authRoute.verifyOtp,
    onSuccess: () => {
      toast.success("Kode OTP berhasil diverifikasi ✅");
      router.push("/login");
    },
    onError: (error) => {
      console.error("Verify OTP error:", error);
      toast.error(error.message || "Gagal memverifikasi OTP");
    },
  });

  return {
    verifyOtp: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};
