import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: {
  id: string;
  email: string;
  role: string;
}) {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as string) as any;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string, res: NextResponse) {
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.delete("session");
}

export function requireAdmin(token: string) {
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") {
    throw new Error("Forbidden: Admin only");
  }
  return decoded;
}