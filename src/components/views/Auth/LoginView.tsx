"use client";
import React, { useState } from "react";
import { useLogin } from "@/config/hooks/useLogin";
import { useAuthStore } from "@/config/stores/useAuthStores";
import { toast } from "sonner";
import LeftSection from "./Section/LeftSection";
import LoginForm from "./Section/LoginFormSection";

const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginForm, setLoginForm } = useAuthStore();
  const { login, isLoading } = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm({ [name]: type === "checkbox" ? checked : value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setLoginForm({
      rememberMe: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    login(loginForm);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-5">
      <div className="flex max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-[700px] flex-col lg:flex-row">
        <LeftSection
          title="Welcome Back"
          description="Secure access to your democratic participation platform."
        />

        <LoginForm
          loginForm={loginForm}
          showPassword={showPassword}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default LoginView;
