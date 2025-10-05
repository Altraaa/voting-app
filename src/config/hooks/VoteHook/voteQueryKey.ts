export const VOTE_QUERY_KEYS = {
  all: ["votes"] as const,
  lists: () => [...VOTE_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [...VOTE_QUERY_KEYS.lists(), ...(filters ? [{ filters }] : [])] as const,
  details: () => [...VOTE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VOTE_QUERY_KEYS.details(), id] as const,
};
