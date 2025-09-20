import { RegisterForm } from "@/config/types/authType";

export interface StatItemProps {
  number: string;
  label: string;
}

export interface LeftSectionProps {
  title: string;
  description: string;
}

export interface RegistrationFormProps {
  registerForm: RegisterForm;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: keyof RegisterForm, checked: boolean) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface LoginFormProps {
  loginForm: { email: string; password: string; rememberMe: boolean };
  showPassword: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}