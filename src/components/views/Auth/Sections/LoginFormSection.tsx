import React from "react";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { LoginFormProps } from "@/components/props/AuthProps";

const LoginForm: React.FC<LoginFormProps> = ({
  loginForm,
  showPassword,
  isLoading,
  onInputChange,
  onCheckboxChange,
  onTogglePassword,
  onSubmit,
}) => {
  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-2">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Login
        </h2>
        <p className="text-gray-600 text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 lg:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={loginForm.email}
            onChange={onInputChange}
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
              onChange={onInputChange}
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={loginForm.rememberMe}
              onCheckedChange={(checked) =>
                onCheckboxChange(checked as boolean)
              }
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <span className="text-sm text-gray-600 hover:text-primary cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full hover:bg-foreground text-white py-3 sm:py-3.5 text-sm font-semibold tracking-wider transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 mt-6"
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
          <FcGoogle className="h-5 w-5" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="transition-all duration-300 ease-in-out hover:-translate-y-0.5"
          size="lg"
        >
          <Facebook />
          Facebook
        </Button>
      </div>

      <div className="text-center text-gray-600 text-sm pt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register">
          <span className="text-primary font-semibold hover:underline cursor-pointer">
            Create Account
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
