import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { PACKAGE_HISTORY_QUERY_KEYS } from "./packageHistoryQueryKey";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { IPackagePurchase } from "@/config/models/PackageHistoryModel";
import { PackageHistoryRoute } from "@/routes/packageHistoryRoute";
import { toast } from "sonner";
import {
  PackageHistoryCreatePayload,
  PackageHistoryUpdatePayload,
} from "@/config/types/packageHistoryType";
import { getErrorMessage } from "@/config/utils/ErrorHandler";

const invalidatePackageHistoryQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: PACKAGE_HISTORY_QUERY_KEYS.all,
  });
};

export const usePackageHistoryMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<
    IPackagePurchase,
    PackageHistoryCreatePayload
  >((data) => PackageHistoryRoute.create(data), {
    onSuccess: () => {
      invalidatePackageHistoryQueries(queryClient);
      toast.success("Riwayat paket berhasil dibuat");
    },
    onError: (error) => {
      toast.error("Gagal membuat riwayat paket", {
        description:
          getErrorMessage(error) ||
          "Terjadi kesalahan saat membuat riwayat paket",
      });
    },
  });

  const updateMutation = useApiMutation<
    IPackagePurchase,
    PackageHistoryUpdatePayload
  >((data) => PackageHistoryRoute.update(data), {
    onSuccess: (updatedPackageHistory) => {
      queryClient.setQueryData(
        PACKAGE_HISTORY_QUERY_KEYS.detail(updatedPackageHistory.id),
        updatedPackageHistory
      );
      invalidatePackageHistoryQueries(queryClient);
      toast.success("Riwayat paket berhasil diperbarui");
    },
    onError: (error) => {
      toast.error("Gagal memperbarui riwayat paket", {
        description:
          getErrorMessage(error) ||
          "Terjadi kesalahan saat memperbarui riwayat paket",
      });
    },
  });

  const removeMutation = useApiMutation<IPackagePurchase, string>(
    (id) => PackageHistoryRoute.remove(id),
    {
      onSuccess: (_, id) => {
        queryClient.removeQueries({
          queryKey: PACKAGE_HISTORY_QUERY_KEYS.detail(id),
        });
        invalidatePackageHistoryQueries(queryClient);
        toast.success("Riwayat paket berhasil dihapus");
      },
      onError: (error) => {
        toast.error("Gagal menghapus riwayat paket", {
          description:
            getErrorMessage(error) ||
            "Terjadi kesalahan saat menghapus riwayat paket",
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
