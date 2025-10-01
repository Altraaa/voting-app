import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { PACKAGE_QUERY_KEYS } from "./packageQueryKey";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { IPackage } from "@/config/models/PackageModel";
import { PackageRoute } from "@/routes/packageRoute";
import { toast } from "sonner";
import {
  PackageCreatePayload,
  PackageUpdatePayload,
} from "@/config/types/packageType";
import { getErrorMessage } from "@/config/utils/ErrorHandler";

const invalidatePackageQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: PACKAGE_QUERY_KEYS.all,
  });
};

export const usePackageMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<IPackage, PackageCreatePayload>(
    (data) => PackageRoute.create(data),
    {
      onSuccess: () => {
        invalidatePackageQueries(queryClient);
        toast.success("Paket berhasil dibuat");
      },
      onError: (error) => {
        toast.error("Gagal membuat paket", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat membuat paket",
        });
      },
    }
  );

  const updateMutation = useApiMutation<IPackage, PackageUpdatePayload>(
    (data) => PackageRoute.update(data),
    {
      onSuccess: (updatedPackage) => {
        queryClient.setQueryData(
          PACKAGE_QUERY_KEYS.detail(updatedPackage.id),
          updatedPackage
        );
        invalidatePackageQueries(queryClient);
        toast.success("Paket berhasil diperbarui");
      },
      onError: (error) => {
        toast.error("Gagal memperbarui paket", {
          description:
            getErrorMessage(error) ||
            "Terjadi kesalahan saat memperbarui paket",
        });
      },
    }
  );

  const removeMutation = useApiMutation<IPackage, string>(
    (id) => PackageRoute.remove(id),
    {
      onSuccess: (_, id) => {
        queryClient.removeQueries({
          queryKey: PACKAGE_QUERY_KEYS.detail(id),
        });
        invalidatePackageQueries(queryClient);
        toast.success("Paket berhasil dihapus");
      },
      onError: (error) => {
        toast.error("Gagal menghapus paket", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat menghapus paket",
        });
      },
    }
  );

  return {
    createMutation,
    updateMutation,
    removeMutation,
  };
};