export const UPLOAD_QUERY_KEYS = {
  all: ["uploads"] as const,
  uploads: () => [...UPLOAD_QUERY_KEYS.all, "upload"] as const,
  upload: (folder?: string) =>
    [...UPLOAD_QUERY_KEYS.uploads(), ...(folder ? [{ folder }] : [])] as const,
};
