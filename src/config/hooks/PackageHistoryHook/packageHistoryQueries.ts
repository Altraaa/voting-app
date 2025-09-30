import { useApiQuery } from "@/config/constants/useApiQuery";
import { PackageHistoryDetailResponse, PackageHistoryResponse } from "@/config/types/responseType";
import { PACKAGE_HISTORY_QUERY_KEYS } from "./packageHistoryQueryKey";
import { PackageHistoryRoute } from "@/routes/packageHistoryRoute";

export const usePackageHistoryQueries = {
    useGetAllPackageHistories: (filters?: string) =>
        useApiQuery<PackageHistoryResponse>(PACKAGE_HISTORY_QUERY_KEYS.list(filters), () =>
            PackageHistoryRoute.getAll()
        ),

    useGetPackageHistoryByUser: (userId: string) =>
        useApiQuery<PackageHistoryDetailResponse> (
            PACKAGE_HISTORY_QUERY_KEYS.detail(userId),
            () => PackageHistoryRoute.getByUser(userId),
            { enabled: !!userId }
        ),
};