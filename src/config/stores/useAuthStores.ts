import { create } from "zustand";
import { LoginForm, RegisterForm } from "../types/authType";

const defaultRegisterForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  terms: false,
  newsLetter: false,
  name: "",
};

const defaultLoginForm: LoginForm = {
  email: "",
  password: "",
  rememberMe: false,
};

interface AuthState {
  registerForm: RegisterForm;
  loginForm: typeof defaultLoginForm;

  setRegisterForm: (data: Partial<RegisterForm>) => void;
  resetRegisterForm: () => void;

  setLoginForm: (data: Partial<typeof defaultLoginForm>) => void;
  resetLoginForm: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  registerForm: defaultRegisterForm,
  loginForm: defaultLoginForm,

  setRegisterForm: (data) =>
    set((state) => ({
      registerForm: { ...state.registerForm, ...data },
    })),
  resetRegisterForm: () => set({ registerForm: defaultRegisterForm }),

  setLoginForm: (data) =>
    set((state) => ({
      loginForm: { ...state.loginForm, ...data },
    })),
  resetLoginForm: () => set({ loginForm: defaultLoginForm }),
}));
