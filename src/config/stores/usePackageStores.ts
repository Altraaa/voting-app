import { create } from "zustand";
import { SupportType } from "@/generated/prisma";
import { PackageCreatePayload } from "@/config/types/packageType";

const defaultFormData: PackageCreatePayload = {
  name: "",
  description: "",
  points: 0,
  price: 0,
  originalPrice: 0,
  validityDays: 30,
  supportType: SupportType.BASIC,
  bonusPercentage: 0,
  earlyAccess: false,
};

interface PackageFormState {
  formData: PackageCreatePayload;
  searchQuery: string;

  setFormData: (data: Partial<PackageCreatePayload>) => void;
  resetForm: () => void;
  setSearchQuery: (query: string) => void;
}

export const usePackageFormStore = create<PackageFormState>((set) => ({
  formData: defaultFormData,
  searchQuery: "",

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () => set({ formData: defaultFormData }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
