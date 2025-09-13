import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/users") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/candidates")
  ) {
    const token = req.cookies.get("session")?.value;
    const decoded = verifyToken(token || "");
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
