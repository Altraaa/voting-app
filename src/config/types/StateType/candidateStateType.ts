import { ICandidate } from "@/config/models/CandidateModel";
import { CandidatesCreatePayload } from "../candidatesType";

export interface CandidateFormState {
  formData: CandidatesCreatePayload;
  selectedFile: File | null;
  imagePreview: string;
  selectedCandidate: ICandidate | null;

  setFormData: (formData: Partial<CandidatesCreatePayload>) => void;
  setSelectedFile: (file: File | null) => void;
  setImagePreview: (preview: string) => void;
  setSelectedCandidate: (candidate: ICandidate | null) => void;
  resetForm: () => void;
  initializeEditForm: (candidate: ICandidate) => void;
}
