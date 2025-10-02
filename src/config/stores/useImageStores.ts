import { create } from "zustand";
import { ImageState } from "../types/StateType/imageStateType";

export const useImageStore = create<ImageState>((set) => ({
  selectedFile: null,
  imagePreview: "",

  setSelectedFile: (file) => set({ selectedFile: file }),
  setImagePreview: (preview) => set({ imagePreview: preview }),
  setImageForEdit: (preview) =>
    set({ imagePreview: preview, selectedFile: null }),

  resetImage: () => set({ selectedFile: null, imagePreview: "" }),
}));
