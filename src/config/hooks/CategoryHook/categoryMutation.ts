import { useApiMutation } from "@/config/constants/useApiMutate";
import { ICategories } from "@/config/models/CategoriesModel";
import { CategoriesCreatePayload, CategoriesUpdatePayload } from "@/config/types/categoriesType";
import { CategoriesRoute } from "@/routes/categoriesRoute";
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { CATEGORY_QUERY_KEYS } from "./categoryQueryKey";
import { toast } from "sonner";
import { getErrorMessage } from "@/config/utils/ErrorHandler";

const invalidateCategoryQueries = (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
    });
}

export const useCategoryMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useApiMutation<ICategories, CategoriesCreatePayload>(
        (data) => CategoriesRoute.create(data),
        {
            onSuccess: () => {
                invalidateCategoryQueries(queryClient);
                toast.success("Kategori berhasil dibuat");
            },
            onError: (error) => {
                toast.error("Gagal membuat kategori", {
                    description:
                        getErrorMessage(error) || "Terjadi kesalahan saat membuat kategori",
                });
            },
        }
    );

    const updateMutation = useApiMutation<ICategories, CategoriesUpdatePayload>(
        (data) => CategoriesRoute.update(data),
        {
            onSuccess: (updatedCategory) => {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.detail(updatedCategory.id), updatedCategory
                );
                invalidateCategoryQueries(queryClient);
                toast.success("Kategori berhasil diperbarui");
            },
            onError: (error) => {
                toast.error("Gagal memperbarui kategori", {
                    description:
                        getErrorMessage(error) || "Terjadi kesalahan saat memperbarui kategori"
                });
            },
        }
    );

    const removeMutation = useApiMutation<ICategories, string>(
        (id) => CategoriesRoute.remove(id),
        {
            onSuccess: (_, id) => {
                queryClient.removeQueries({
                    queryKey: CATEGORY_QUERY_KEYS.detail(id),
                });
                invalidateCategoryQueries(queryClient);
                toast.success("Kategori berhasil dihapus");
            },
            onError: (error) => {
                toast.error("Gagal menghapus kategori", {
                    description:
                        getErrorMessage(error) || "Terjadi kesalahan saat menghapus kategori",
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