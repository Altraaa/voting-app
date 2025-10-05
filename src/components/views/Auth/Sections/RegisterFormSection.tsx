import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RegistrationFormProps } from "@/components/props/AuthProps";

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  registerForm,
  showPassword,
  showConfirmPassword,
  isLoading,
  onInputChange,
  onCheckboxChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}) => {
  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-2">
      <form onSubmit={onSubmit} className="space-y-4 lg:space-y-5">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
                onChange={onInputChange}
                placeholder="Create a secure password"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={onTogglePassword}
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
                onChange={onInputChange}
                placeholder="Confirm your password"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={onToggleConfirmPassword}
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
              onCheckboxChange("terms", checked as boolean)
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
              onCheckboxChange("newsLetter", checked as boolean)
            }
            className="mt-1 flex-shrink-0"
          />
          <div className="grid gap-1.5 leading-none min-w-0">
            <Label
              htmlFor="newsLetter"
              className="text-xs sm:text-sm font-normal leading-relaxed cursor-pointer"
            >
              I want to receive updates about upcoming votes and platform news
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full hover:bg-foreground text-white py-3 sm:py-3.5 text-sm font-semibold tracking-wider transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 mt-6"
          size="lg"
        >
          {isLoading ? "Processing..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;