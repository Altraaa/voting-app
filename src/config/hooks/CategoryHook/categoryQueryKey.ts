export const CATEGORY_QUERY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [
      ...CATEGORY_QUERY_KEYS.lists(),
      ...(filters ? [{ filters }] : []),
    ] as const,
  simpleList: (filters?: string) =>
    [
      ...CATEGORY_QUERY_KEYS.lists(),
      "simple",
      ...(filters ? [{ filters }] : []),
    ] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_QUERY_KEYS.details(), id] as const,
};