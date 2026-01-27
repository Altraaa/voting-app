import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authRoute } from "@/routes/authRoute";
import { RegisterPayload } from "@/config/types/registerType";
import { AuthResponse } from "@/config/types/authType";

export const useRegister = () => {

  const mutation = useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: authRoute.register,
    onSuccess: () => {
      toast.success("Registration successful!");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};
