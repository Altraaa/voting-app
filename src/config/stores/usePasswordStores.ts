import { create } from "zustand";

interface PasswordState {
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePassword: () => void;
  toggleConfirmPassword: () => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

export const usePasswordStore = create<PasswordState>((set) => ({
  showPassword: false,
  showConfirmPassword: false,

  togglePassword: () =>
    set((state) => ({
      showPassword: !state.showPassword,
    })),

  toggleConfirmPassword: () =>
    set((state) => ({
      showConfirmPassword: !state.showConfirmPassword,
    })),

  setShowPassword: (show) => set({ showPassword: show }),

  setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
}));
