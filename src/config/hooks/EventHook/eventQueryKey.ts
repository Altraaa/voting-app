export const EVENT_QUERY_KEYS = {
  all: ["events"] as const,
  lists: () => [...EVENT_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) =>
    [...EVENT_QUERY_KEYS.lists(), ...(filters ? [{ filters }] : [])] as const,
  simpleList: (filters?: string) =>
    [
      ...EVENT_QUERY_KEYS.lists(),
      "simple",
      ...(filters ? [{ filters }] : []),
    ] as const,
  details: () => [...EVENT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EVENT_QUERY_KEYS.details(), id] as const,
};
