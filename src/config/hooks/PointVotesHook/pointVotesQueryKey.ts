export const POINT_VOTES_QUERY_KEYS = {
  all: ["point-votes"] as const,
  lists: () => [...POINT_VOTES_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [
      ...POINT_VOTES_QUERY_KEYS.lists(),
      ...(filters ? [{ filters }] : []),
    ] as const,
  details: () => [...POINT_VOTES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...POINT_VOTES_QUERY_KEYS.details(), id] as const,
  byUser: (userId: string) =>
    [...POINT_VOTES_QUERY_KEYS.all, "by-user", userId] as const,
  byPackage: (packageId: string) =>
    [...POINT_VOTES_QUERY_KEYS.all, "by-package", packageId] as const,
};
