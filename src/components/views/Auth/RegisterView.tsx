"use client";
import React from "react";
import { useRegister } from "@/config/hooks/useRegister";
import { useAuthStore } from "@/config/stores/useAuthStores";
import { usePasswordStore } from "@/config/stores/usePasswordStores";
import { RegisterForm } from "@/config/types/authType";
import { toast } from "sonner";
import RegistrationForm from "./Sections/RegisterFormSection";
import LeftSection from "./Sections/LeftSection";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-5">
      <div className="flex max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-[700px] flex-col lg:flex-row">
        <LeftSection
          title="Your Voice Matters"
          description=" Join thousands of engaged citizens making their voices heard in the
          democratic process."
        />

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
      </div>
    </div>
  );
};

export default RegisterView;
