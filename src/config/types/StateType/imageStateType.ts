export interface ImageState {
  selectedFile: File | null;
  imagePreview: string;
  setSelectedFile: (file: File | null) => void;
  setImagePreview: (preview: string) => void;
  setImageForEdit: (preview: string) => void;
  resetImage: () => void;
}