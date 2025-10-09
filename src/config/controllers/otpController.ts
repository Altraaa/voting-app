import { NextResponse } from "next/server";
import { resendOtpService, verifyOtpService } from "../services/otpService";

export async function verifyOtpController(req: Request) {
  try {
    const body = await req.json();
    const { email, otpCode } = body;

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: "Email dan kode OTP wajib diisi." },
        { status: 400 }
      );
    }

    const result = await verifyOtpService({ email, otpCode });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Verify OTP error:", err);

    switch (err.message) {
      case "USER_NOT_FOUND":
        return NextResponse.json(
          { error: "User tidak ditemukan." },
          { status: 404 }
        );
      case "INVALID_OTP":
        return NextResponse.json(
          { error: "Kode OTP tidak valid." },
          { status: 400 }
        );
      case "OTP_EXPIRED":
        return NextResponse.json(
          { error: "Kode OTP sudah kedaluwarsa." },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: "Terjadi kesalahan pada server." },
          { status: 500 }
        );
    }
  }
}

export async function resendOtpController(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email harus diisi." },
        { status: 400 }
      );
    }

    const result = await resendOtpService(email);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Resend OTP error:", err);

    if (err.message === "USER_NOT_FOUND") {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    if (err.message === "USER_ALREADY_VERIFIED") {
      return NextResponse.json(
        { error: "Akun sudah terverifikasi." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}