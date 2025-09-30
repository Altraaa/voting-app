export const PACKAGE_HISTORY_QUERY_KEYS = {
    all: ["package_histories"] as const,
    lists: () => [...PACKAGE_HISTORY_QUERY_KEYS.all, "list"] as const,
    list: (filters?: string) =>
        [
            ...PACKAGE_HISTORY_QUERY_KEYS.lists(),
            ...(filters ? [{ filters }] : []),
        ] as const,
    details: () => [...PACKAGE_HISTORY_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string) => [...PACKAGE_HISTORY_QUERY_KEYS.details(), id] as const,
};