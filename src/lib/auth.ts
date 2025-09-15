import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

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

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as JWTPayload & {
      id?: string;
      email?: string;
      role?: string;
    };
  } catch (err: any) {
    if (err.name === "JWTExpired") {
      console.error("JWT expired:", err.message);
    } else {
      console.error("JWT verification error:", err);
    }
    return null;
  }
}

export function setAuthCookie(token: string, res: NextResponse) {
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
  return res;
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.delete("session");
  return res;
}

export function requireAdmin(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET as string) as {
    id: string;
    email: string;
    role: string;
  };

  if (!decoded || decoded.role !== "ADMIN") {
    throw new Error("Forbidden: Admin only");
  }
  return decoded;
}
