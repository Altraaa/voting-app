import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthResponse } from "@/config/types/authType";
import { authRoute } from "@/routes/authRoute";

export const useGoogleAuth = () => {
  const router = useRouter();

  const mutation = useMutation<AuthResponse, Error, string>({
    mutationFn: authRoute.googleAuth,
    onSuccess: (data: AuthResponse) => {
      toast.success("Login with Google successful!");

      const userRole = data.role;
      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      console.error("Google auth error:", error);
      toast.error(error.message || "Google authentication failed");
    },
  });

  return {
    googleLogin: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};
