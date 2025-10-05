export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [...USER_QUERY_KEYS.lists(), ...(filters ? [{ filters }] : [])] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
  profile: () => [...USER_QUERY_KEYS.all, "profile"] as const,
  voteHistory: (userId: string) =>
    [...USER_QUERY_KEYS.all, "vote-history", userId] as const,
};
