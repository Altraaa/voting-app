"use client";
import React from "react";
import { useRegister } from "@/config/hooks/useRegister";
import { useAuthStore } from "@/config/stores/useAuthStores";
import { usePasswordStore } from "@/config/stores/usePasswordStores";
import { RegisterForm } from "@/config/types/authType";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/Auth";
import RegistrationForm from "./Sections/RegisterFormSection";

const RegisterView = () => {
  const { registerForm, setRegisterForm } = useAuthStore();
  const {
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
  } = usePasswordStore();
  const { register, isLoading } = useRegister();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm({ [name]: type === "checkbox" ? checked : value });
  };

  const handleCheckboxChange = (name: keyof RegisterForm, checked: boolean) => {
    setRegisterForm({ [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (registerForm.password.length < 8) {
      return toast.error("Password must be at least 8 characters long!");
    }
    if (!registerForm.terms) {
      return toast.error("Please accept the Terms of Service!");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToRegister } = registerForm;

    const finalData = {
      ...dataToRegister,
      name: `${registerForm.firstName} ${registerForm.lastName}`,
    };

    register(finalData);
  };

  return (
    <AuthLayout
      title="Your Voice Matters"
      description="Join thousands of engaged citizens making their voices heard in the democratic process."
      showStats={true}
    >
      <RegistrationForm
        registerForm={registerForm}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        onTogglePassword={togglePassword}
        onToggleConfirmPassword={toggleConfirmPassword}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};

export default RegisterView;
