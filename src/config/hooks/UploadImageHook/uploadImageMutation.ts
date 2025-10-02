import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { IUploadImage } from "@/config/models/UploadImageModel";
import {
  UploadImagePayload,
  UploadMultipleImagesPayload,
} from "@/config/types/uploadImageType";
import { UploadResult } from "@/config/types/uploadType";
import { toast } from "sonner";
import { getErrorMessage } from "@/config/utils/ErrorHandler";
import { UploadRoute } from "@/routes/uploadImageRoute";
import { UPLOAD_QUERY_KEYS } from "./uploadImageQueryKey";

export const useUploadMutations = () => {
  const queryClient = useQueryClient();

  const uploadSingleMutation = useApiMutation<UploadResult, UploadImagePayload>(
    (data) => UploadRoute.uploadSingle(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: UPLOAD_QUERY_KEYS.all });
        toast.success("Upload berhasil");
      },
      onError: (error) => {
        toast.error("Upload gagal", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan upload file",
        });
      },
    }
  );

  const uploadMultipleMutation = useApiMutation<
    { success: boolean; results: UploadResult[] },
    UploadMultipleImagesPayload
  >((data) => UploadRoute.uploadMultiple(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPLOAD_QUERY_KEYS.all });
      toast.success("Upload multiple berhasil");
    },
    onError: (error) => {
      toast.error("Upload multiple gagal", {
        description: getErrorMessage(error) || "Terjadi kesalahan upload file",
      });
    },
  });

  const deleteSingleMutation = useApiMutation<
    { success: boolean },
    Pick<IUploadImage, "path">
  >((data) => UploadRoute.deleteSingle(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPLOAD_QUERY_KEYS.all });
      toast.success("File berhasil dihapus");
    },
    onError: (error) => {
      toast.error("Gagal menghapus file", {
        description:
          getErrorMessage(error) || "Terjadi kesalahan saat hapus file",
      });
    },
  });

  const deleteMultipleMutation = useApiMutation<
    { success: boolean },
    Pick<IUploadImage, "paths">
  >((data) => UploadRoute.deleteMultiple(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPLOAD_QUERY_KEYS.all });
      toast.success("Beberapa file berhasil dihapus");
    },
    onError: (error) => {
      toast.error("Gagal menghapus file", {
        description:
          getErrorMessage(error) || "Terjadi kesalahan saat hapus file",
      });
    },
  });

  return {
    uploadSingleMutation,
    uploadMultipleMutation,
    deleteSingleMutation,
    deleteMultipleMutation,
  };
};
