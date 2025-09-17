"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useLogin } from "@/config/hooks/useLogin";
import { useAuthStore } from "@/config/stores/useAuthStores";
import Link from "next/link";

interface StatItemProps {
  number: string;
  label: string;
}

const VoterLogin = () => {
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

  const StatItem: React.FC<StatItemProps> = ({ number, label }) => (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-4">
        <div className="text-xl sm:text-2xl font-bold mb-1 text-white">
          {number}
        </div>
        <div className="text-xs opacity-70 uppercase tracking-wider text-white">
          {label}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-5">
      <div className="flex max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-[600px] lg:min-h-[700px] flex-col lg:flex-row">
        {/* Hero section */}
        <div className="flex-1 bg-gradient-to-br from-black to-gray-800 p-4 sm:p-6 lg:p-10 flex flex-col justify-center items-center text-white relative order-1 lg:order-1 lg:min-h-0 min-h-[200px]">
          <div className="lg:absolute lg:top-10 lg:left-10 mb-2 lg:mb-0">
            <div className="flex items-center gap-3 text-base lg:text-xl font-semibold">
              <span>Exito</span>
            </div>
          </div>

          <div className="text-center max-w-xs sm:max-w-md w-full lg:block">
            <h1 className="text-lg lg:text-4xl md:text-3xl font-bold mb-2 lg:mb-4 leading-tight">
              Welcome Back
            </h1>
            <p className="text-xs md:text-sm lg:text-base opacity-80 lg:mb-10 leading-relaxed px-1 lg:px-0 lg:block">
              Secure access to your democratic participation platform.
            </p>

            <div className="hidden lg:grid grid-cols-2 gap-5 w-full max-w-sm mx-auto sm:hidden">
              <StatItem number="25,847" label="Registered Voters" />
              <StatItem number="1,234" label="Active Polls" />
              <StatItem number="89%" label="Participation Rate" />
              <StatItem number="24/7" label="Platform Uptime" />
            </div>
          </div>
        </div>

        {/* Login form section */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-2">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={loginForm.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={loginForm.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <span className="text-sm text-gray-600 hover:text-black cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 sm:py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 mt-6"
              size="lg"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mb-4 relative text-gray-400 text-sm mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="bg-white px-3 relative">Or sign in with</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="transition-all duration-300 ease-in-out hover:-translate-y-0.5"
              size="lg"
            >
              <span className="text-blue-500 font-bold text-base mr-2">G</span>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="transition-all duration-300 ease-in-out hover:-translate-y-0.5"
              size="lg"
            >
              <span className="text-blue-600 font-bold text-base mr-2">f</span>
              Facebook
            </Button>
          </div>

          <div className="text-center text-gray-600 text-sm pt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register">
              <span className="text-black font-semibold hover:underline cursor-pointer">
                Create Account
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;
