import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { loginService } from "../services/loginService";

export async function loginController(req: Request) {
  try {
    const { email, password } = await req.json();
    const { user, token } = await loginService(email, password);

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    setAuthCookie(token, res);

    return res;
  } catch (err: any) {
    console.error("Login error:", err);

    if (err.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (err.message === "GOOGLE_ACCOUNT") {
      return NextResponse.json(
        {
          error:
            "This account is registered with Google. Please login with Google.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}