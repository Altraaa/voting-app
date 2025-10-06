import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/admin")
  ) {
    const token =
      req.cookies.get("session")?.value

    if (!token) {
      return NextResponse.json(
        {
          error: "Forbidden: no token",
          debug: "No cookie or Authorization header",
        },
        { status: 403 }
      );
    }

    const decoded = await verifyToken(token); 


    if (!decoded) {
      return NextResponse.json(
        { error: "Forbidden: invalid token" },
        { status: 403 }
      );
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: not admin" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
