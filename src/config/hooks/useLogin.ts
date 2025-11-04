import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthResponse, LoginPayload } from "@/config/types/authType";
import { toast } from "sonner";
import { authRoute } from "@/routes/authRoute";

export const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: authRoute.login,
    onSuccess: (data: AuthResponse) => {
      toast.success("Login successful!");

      const userRole = data.role;
      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.message || "Something went wrong");
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};
