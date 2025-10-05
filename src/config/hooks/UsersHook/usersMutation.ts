import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { IUsers } from "@/config/models/UsersModel";
import { UsersRoute } from "@/routes/usersRoute";
import { toast } from "sonner";
import {
  UsersCreatePayload,
  UsersUpdatePayload,
  UsersUpdateProfilePayload,
} from "@/config/types/usersType";
import { getErrorMessage } from "@/config/utils/ErrorHandler";
import { USER_QUERY_KEYS } from "./usersQueryKey";

const invalidateUserQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: USER_QUERY_KEYS.all,
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<IUsers, UsersCreatePayload>(
    (data) => UsersRoute.create(data),
    {
      onSuccess: () => {
        invalidateUserQueries(queryClient);
        toast.success("User berhasil dibuat");
      },
      onError: (error) => {
        toast.error("Gagal membuat user", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat membuat user",
        });
      },
    }
  );

  const updateMutation = useApiMutation<IUsers, UsersUpdatePayload>(
    (data) => UsersRoute.update(data),
    {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData(
          USER_QUERY_KEYS.detail(updatedUser.id),
          updatedUser
        );
        invalidateUserQueries(queryClient);
        toast.success("User berhasil diperbarui");
      },
      onError: (error) => {
        toast.error("Gagal memperbarui user", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat memperbarui user",
        });
      },
    }
  );

  const updateProfileMutation = useApiMutation<
    IUsers,
    { data: UsersUpdateProfilePayload }
  >(({ data }) => UsersRoute.updateProfile( data), {
    onSuccess: () => {
      // Invalidate profile query to refetch
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.profile(),
      });
      toast.success("Profile berhasil diperbarui");
    },
    onError: (error) => {
      toast.error("Gagal memperbarui profile", {
        description:
          getErrorMessage(error) ||
          "Terjadi kesalahan saat memperbarui profile",
      });
    },
  });

  const removeMutation = useApiMutation<IUsers, string>(
    (id) => UsersRoute.remove(id),
    {
      onSuccess: (_, id) => {
        queryClient.removeQueries({
          queryKey: USER_QUERY_KEYS.detail(id),
        });
        invalidateUserQueries(queryClient);
        toast.success("User berhasil dihapus");
      },
      onError: (error) => {
        toast.error("Gagal menghapus user", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat menghapus user",
        });
      },
    }
  );

  return {
    createMutation,
    updateMutation,
    updateProfileMutation,
    removeMutation,
  };
};
