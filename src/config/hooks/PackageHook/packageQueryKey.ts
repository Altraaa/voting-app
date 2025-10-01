export const PACKAGE_QUERY_KEYS = {
  all: ["packages"] as const,
  lists: () => [...PACKAGE_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [...PACKAGE_QUERY_KEYS.lists(), ...(filters ? [{ filters }] : [])] as const,
  details: () => [...PACKAGE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PACKAGE_QUERY_KEYS.details(), id] as const,
};