import { create } from "zustand";
import { CandidatesCreatePayload } from "../types/candidatesType";
import { CandidateFormState } from "../types/StateType/candidateStateType";

const initialFormData: CandidatesCreatePayload = {
  name: "",
  description: "",
  photo_url: "",
  categoryId: "",
};

export const useCandidateFormStore = create<CandidateFormState>((set) => ({
  formData: initialFormData,
  selectedFile: null,
  imagePreview: "",
  selectedCandidate: null,

  setFormData: (formData) =>
    set((state) => ({
      formData: { ...state.formData, ...formData },
    })),

  setSelectedFile: (file) => set({ selectedFile: file }),

  setImagePreview: (preview) => set({ imagePreview: preview }),

  setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),

  resetForm: () =>
    set({
      formData: initialFormData,
      selectedFile: null,
      imagePreview: "",
      selectedCandidate: null,
    }),

  initializeEditForm: (candidate) =>
    set({
      selectedCandidate: candidate,
      formData: {
        name: candidate.name,
        description: candidate.description,
        photo_url: candidate.photo_url || "",
        categoryId: candidate.categoryId,
      },
      imagePreview: candidate.photo_url || "",
      selectedFile: null,
    }),
}));
