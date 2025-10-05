import { useApiQuery } from "@/config/constants/useApiQuery";
import { PACKAGE_QUERY_KEYS } from "./packageQueryKey";
import { PackageRoute } from "@/routes/packageRoute";
import { PackageDetailResponse, PackageResponse } from "@/config/types/responseType";

export const usePackageQueries = {
  useGetAllPackages: (filters?: string) =>
    useApiQuery<PackageResponse>(PACKAGE_QUERY_KEYS.list(filters), () =>
      PackageRoute.getAll()
    ),

  useGetPackageById: (id: string) =>
    useApiQuery<PackageDetailResponse>(
      PACKAGE_QUERY_KEYS.detail(id),
      () => PackageRoute.getById(id),
      { enabled: !!id }
    ),
};