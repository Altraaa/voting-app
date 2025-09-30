export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    if ("digest" in error && "message" in error) {
      return String(error.message);
    }
    if ("message" in error) {
      return String(error.message);
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Terjadi kesalahan yang tidak diketahui";
};