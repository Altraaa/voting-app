"use client";
import React, { useState, useEffect } from "react";
import { useRegister } from "@/config/hooks/useRegister";
import { useVerifyOtp } from "@/config/hooks/useVerifyOtp";
import { useResendOtp } from "@/config/hooks/useResendOtp";
import { useGoogleAuth } from "@/config/hooks/useGoogleAuth";
import { useAuthStore } from "@/config/stores/useAuthStores";
import { usePasswordStore } from "@/config/stores/usePasswordStores";
import { RegisterForm } from "@/config/types/authType";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/Auth";
import RegistrationForm from "./Sections/RegisterFormSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";

const RegisterView = () => {
  const { registerForm, setRegisterForm } = useAuthStore();
  const {
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
  } = usePasswordStore();

  const { register, isLoading: isRegistering } = useRegister();
  const { verifyOtp, isLoading: isVerifying } = useVerifyOtp();
  const { resendOtp, isLoading: isResending } = useResendOtp();
  const { googleLogin, isLoading: isGoogleLoading } = useGoogleAuth();

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isUnverifiedAccount, setIsUnverifiedAccount] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  // Check for unverified account in localStorage on component mount
  useEffect(() => {
    const savedUnverifiedEmail = localStorage.getItem("unverifiedEmail");
    if (savedUnverifiedEmail) {
      setUnverifiedEmail(savedUnverifiedEmail);
      setShowVerificationBanner(true);
      setIsUnverifiedAccount(true);
    }
  }, []);

  // Save unverified email to localStorage when detected
  useEffect(() => {
    if (isUnverifiedAccount && registerForm.email) {
      localStorage.setItem("unverifiedEmail", registerForm.email);
      setUnverifiedEmail(registerForm.email);
    }
  }, [isUnverifiedAccount, registerForm.email]);

  // Clear localStorage when verification is successful
  useEffect(() => {
    if (!isUnverifiedAccount) {
      localStorage.removeItem("unverifiedEmail");
    }
  }, [isUnverifiedAccount]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

    register(finalData, {
      onSuccess: () => {
        toast.success("Registration successful! Please verify your OTP.");
        setIsUnverifiedAccount(false);
        setShowVerificationBanner(false);
        setOtpDialogOpen(true);
        setCountdown(60);
      },
      onError: (err: any) => {
        if (
          err?.response?.data?.error?.includes("belum diverifikasi") ||
          err?.message?.includes("UNVERIFIED_ACCOUNT_EXISTS")
        ) {
          setIsUnverifiedAccount(true);
          setShowVerificationBanner(true);
          setOtpDialogOpen(true);
          setCountdown(60);
          toast.info("Akun ini sudah terdaftar, tapi belum diverifikasi.");
        } else {
          toast.error(err.response?.data?.error || "Gagal melakukan register.");
        }
      },
    });
  };

  const handleVerifyOtp = () => {
    if (!otpCode) return toast.error("Please enter OTP code!");
    if (otpCode.length !== 6) return toast.error("OTP must be 6 digits!");

    verifyOtp(
      { email: registerForm.email, otpCode },
      {
        onSuccess: () => {
          toast.success("OTP verified! You can now login 🎉");
          setOtpDialogOpen(false);
          setIsUnverifiedAccount(false);
          setShowVerificationBanner(false);
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;

    resendOtp(registerForm.email, {
      onSuccess: () => {
        setCountdown(60);
        toast.success("New OTP code has been sent to your email ✉️");
      },
    });
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      googleLogin(credentialResponse.credential);
    }
  };

  const handleOpenOtpDialog = () => {
    // If we have an unverified email in localStorage, use it
    if (unverifiedEmail && unverifiedEmail !== registerForm.email) {
      setRegisterForm({ ...registerForm, email: unverifiedEmail });
    }
    setOtpDialogOpen(true);
    setCountdown(60);
  };

  return (
    <>
      <AuthLayout
        title="Your Voice Matters"
        description="Join thousands of engaged citizens making their voices heard in the democratic process."
        showStats={true}
      >
        {/* Verification Banner */}
        {showVerificationBanner && (
          <div className="mb-6">
            <Alert className="border-blue-200 bg-blue-50">
              <MailCheck className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>
                    You have an unverified account with{" "}
                    <span className="font-semibold">{unverifiedEmail}</span>
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleOpenOtpDialog}
                      className="text-blue-700 border-blue-300 hover:bg-blue-100"
                    >
                      Verify Now
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || isResending}
                      className="text-blue-700 hover:bg-blue-100"
                    >
                      {isResending
                        ? "Sending..."
                        : countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Resend OTP"}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <RegistrationForm
          registerForm={registerForm}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          isLoading={isRegistering}
          isGoogleLoading={isGoogleLoading}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onTogglePassword={togglePassword}
          onToggleConfirmPassword={toggleConfirmPassword}
          onSubmit={handleSubmit}
          onGoogleLoginSuccess={handleGoogleLoginSuccess}
        />
      </AuthLayout>

      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="max-w-sm p-6 space-y-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              {isUnverifiedAccount
                ? "Continue Verification"
                : "Verify Your Email"}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {isUnverifiedAccount
                ? "Akun kamu sudah terdaftar tapi belum diverifikasi. Silakan masukkan OTP dari email kamu."
                : "We sent a 6-digit verification code to your email."}
            </p>
            <p className="font-medium text-gray-900">{registerForm.email}</p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="text-center text-lg font-semibold tracking-widest h-12"
                maxLength={6}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpCode.length !== 6}
                className="w-full h-11"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>

              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isResending}
                className="text-sm"
              >
                {isResending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend Code"}
              </Button>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500">
            Didn&apos;t receive the code? Check your spam folder or resend a new
            one.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterView;