import { IUploadImage } from "@/config/models/UploadImageModel";
import { UploadImagePayload, UploadMultipleImagesPayload } from "@/config/types/uploadImageType";
import { UploadResult } from "@/config/types/uploadType";
import { ApiRequest } from "@/lib/api";

export const UploadRoute = {
  uploadSingle: ({
    file,
    folder,
  }: UploadImagePayload): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    return ApiRequest<UploadResult>({
      url: "upload/image/single",
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  uploadMultiple: ({
    files,
    folder,
  }: UploadMultipleImagesPayload): Promise<{
    success: boolean;
    results: UploadResult[];
  }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) formData.append("folder", folder);

    return ApiRequest<{ success: boolean; results: UploadResult[] }>({
      url: "upload/image/multiple",
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  deleteSingle: ({
    path,
  }: Pick<IUploadImage, "path">): Promise<{ success: boolean }> =>
    ApiRequest({
      url: "upload/image/single",
      method: "DELETE",
      body: { path },
    }),

  deleteMultiple: ({
    paths,
  }: Pick<IUploadImage, "paths">): Promise<{ success: boolean }> =>
    ApiRequest({
      url: "upload/image/multiple",
      method: "DELETE",
      body: { paths },
    }),
};
