"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRegister } from "@/config/hooks/useRegister";
import { useAuthStore } from "@/config/stores/useAuthStores";
import { RegisterForm } from "@/config/types/authType";
import { usePasswordStore } from "@/config/stores/usePasswordStores";

interface StatItemProps {
  number: string;
  label: string;
}

const VoterRegistration = () => {
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
        {/* LEFT SECTION */}
        <div className="flex-1 bg-gradient-to-br from-black to-gray-800 p-4 sm:p-6 lg:p-10 flex flex-col justify-center items-center text-white relative order-1 lg:order-1 lg:min-h-0 min-h-[200px]">
          <div className="lg:absolute lg:top-10 lg:left-10 mb-2 lg:mb-0">
            <div className="flex items-center gap-3 text-base lg:text-xl font-semibold">
              <span>Exito</span>
            </div>
          </div>

          <div className="text-center max-w-xs sm:max-w-md w-full lg:block">
            <h1 className="text-lg lg:text-4xl md:text-3xl font-bold mb-2 lg:mb-4 leading-tight">
              Your Voice Matters
            </h1>
            <p className="text-xs md:text-sm lg:text-base opacity-80 lg:mb-10 leading-relaxed px-1 lg:px-0 lg:block">
              Join thousands of engaged citizens making their voices heard in
              the democratic process.
            </p>

            <div className="hidden lg:grid grid-cols-2 gap-5 w-full max-w-sm mx-auto sm:hidden">
              <StatItem number="25,847" label="Registered Voters" />
              <StatItem number="1,234" label="Active Polls" />
              <StatItem number="89%" label="Participation Rate" />
              <StatItem number="24/7" label="Platform Uptime" />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-sm">
                Register now to participate in upcoming votes and polls
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={registerForm.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={registerForm.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={registerForm.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={registerForm.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleInputChange}
                    placeholder="Create a secure password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePassword} // Menggunakan togglePassword
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleConfirmPassword} // Menggunakan toggleConfirmPassword
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={registerForm.terms}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("terms", checked as boolean)
                }
                required
                className="mt-1 flex-shrink-0"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-xs sm:text-sm font-normal leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="font-semibold hover:underline text-xs sm:text-sm leading-relaxed cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold hover:underline text-xs sm:text-sm leading-relaxed cursor-pointer">
                    Privacy Policy
                  </span>
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsLetter"
                checked={registerForm.newsLetter}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("newsLetter", checked as boolean)
                }
                className="mt-1 flex-shrink-0"
              />
              <div className="grid gap-1.5 leading-none min-w-0">
                <Label
                  htmlFor="newsLetter"
                  className="text-xs sm:text-sm font-normal leading-relaxed cursor-pointer"
                >
                  I want to receive updates about upcoming votes and platform
                  news
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 sm:py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 mt-6"
              size="lg"
            >
              {isLoading ? "Processing..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VoterRegistration;
