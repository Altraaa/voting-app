import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthResponse } from "@/config/types/authType";
import { authRoute } from "@/routes/authRoute";

// Server membatasi verifikasi Google 10 detik; beri margin untuk jaringan.
const GOOGLE_AUTH_CLIENT_TIMEOUT_MS = 20_000;

const NETWORK_ERROR_MESSAGE =
  "Tidak dapat terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.";
const TIMEOUT_ERROR_MESSAGE =
  "Server terlalu lama merespons. Silakan coba login dengan Google lagi.";
const GENERIC_ERROR_MESSAGE = "Login dengan Google gagal. Silakan coba lagi.";

class GoogleAuthTimeoutError extends Error {
  constructor() {
    super(TIMEOUT_ERROR_MESSAGE);
    this.name = "GoogleAuthTimeoutError";
  }
}

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new GoogleAuthTimeoutError()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

// fetch() melempar TypeError ("Failed to fetch" / "Load failed") saat koneksi
// gagal, dan ApiRequest melempar isi HTML bila proxy membalas halaman error.
const getFriendlyErrorMessage = (error: Error): string => {
  const message = error?.message?.trim() ?? "";

  if (error instanceof GoogleAuthTimeoutError) return TIMEOUT_ERROR_MESSAGE;
  if (
    error instanceof TypeError ||
    /failed to fetch|load failed|network ?error|timed out/i.test(message)
  ) {
    return NETWORK_ERROR_MESSAGE;
  }
  if (!message || message.startsWith("<") || message.length > 200) {
    return GENERIC_ERROR_MESSAGE;
  }
  return message;
};

export const useGoogleAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<AuthResponse, Error, string>({
    mutationFn: (credential) =>
      withTimeout(
        authRoute.googleAuth(credential),
        GOOGLE_AUTH_CLIENT_TIMEOUT_MS
      ),
    onSuccess: async (data: AuthResponse) => {
      toast.success("Login with Google successful!");

      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      await queryClient.refetchQueries({ queryKey: ["user-profile"] });

      queryClient.setQueryData(["user-profile"], data);

      const userRole = data.role;
      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
    onError: (error) => {
      console.error("Google auth error:", error);
      toast.error(getFriendlyErrorMessage(error));
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
