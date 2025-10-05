import { IUploadImage } from "../models/UploadImageModel";

export type UploadImageBase = Pick<IUploadImage, "folder">;

export type UploadImagePayload = UploadImageBase & Pick<IUploadImage, "file">;

export type UploadMultipleImagesPayload = UploadImageBase & Pick<IUploadImage, "files">;