import { useApiQuery } from "@/config/constants/useApiQuery";
import { IPackage } from "@/config/models/PackageModel";
import { PACKAGE_QUERY_KEYS } from "./packageQueryKey";
import { PackageRoute } from "@/routes/packageRoute";

export const usePackageQueries = {
  useGetAllPackages: (filters?: string) =>
    useApiQuery<IPackage>(PACKAGE_QUERY_KEYS.list(filters), () =>
      PackageRoute.getAll()
    ),

  useGetPackageById: (id: string) =>
    useApiQuery<IPackage>(
      PACKAGE_QUERY_KEYS.detail(id),
      () => PackageRoute.getById(id),
      { enabled: !!id }
    ),
};