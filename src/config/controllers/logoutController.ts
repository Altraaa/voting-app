import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function logoutController() {
  const res = NextResponse.json({ message: "Logged out" });
  clearAuthCookie(res);
  return res;
}