import { NextResponse } from "next/server";
import { registerService } from "../services/registerService";

export async function registerController(req: Request) {
  try {
    const body = await req.json();
    const { user, token, message } = await registerService(body);

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      message,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    console.error("Register error:", err);

    switch (err.message) {
      case "EMAIL_PASSWORD_REQUIRED":
        return NextResponse.json(
          { error: "Email dan password harus diisi." },
          { status: 400 }
        );
      case "EMAIL_EXISTS":
        return NextResponse.json(
          { error: "Email sudah terdaftar dan terverifikasi." },
          { status: 400 }
        );
      case "UNVERIFIED_ACCOUNT_EXISTS":
        return NextResponse.json(
          {
            error:
              "Akun dengan email ini sudah terdaftar tapi belum diverifikasi. Silakan verifikasi OTP di email kamu atau kirim ulang OTP.",
          },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: err.message || "Internal Server Error" },
          { status: 500 }
        );
    }
  }
}