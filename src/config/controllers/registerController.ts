import { NextResponse } from "next/server";
import { registerService } from "../services/registerService";

export async function registerController(req: Request) {
  try {
    const body = await req.json();
    const { user, token } = await registerService(body);

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
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

    if (err.message === "EMAIL_PASSWORD_REQUIRED") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (err.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
