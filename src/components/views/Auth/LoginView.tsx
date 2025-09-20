// views/LoginView.tsx
"use client";
import React, { useState } from "react";
import { useLogin } from "@/config/hooks/useLogin";
import { useAuthStore } from "@/config/stores/useAuthStores";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/Auth";
import LoginForm from "./Sections/LoginFormSection";

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
    <AuthLayout
      title="Welcome Back"
      description="Secure access to your democratic participation platform."
      showStats={true}
    >
      <LoginForm
        loginForm={loginForm}
        showPassword={showPassword}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
};

export default LoginView;
