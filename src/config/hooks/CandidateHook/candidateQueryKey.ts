export const CANDIDATE_QUERY_KEYS = {
  all: ["candidates"] as const,
  lists: () => [...CANDIDATE_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [
      ...CANDIDATE_QUERY_KEYS.lists(),
      ...(filters ? [{ filters }] : []),
    ] as const,
  details: () => [...CANDIDATE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CANDIDATE_QUERY_KEYS.details(), id] as const,
  byCategory: (categoryId: string) =>
    [...CANDIDATE_QUERY_KEYS.all, "by-category", categoryId] as const,
};