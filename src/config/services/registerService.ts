import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { RegisterPayload } from "../types/authType";

export async function registerService(data: RegisterPayload) {
  const { email, password, ...rest } = data;

  if (!email || !password) {
    throw new Error("EMAIL_PASSWORD_REQUIRED");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: "USER",
      ...rest,
    },
  });

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}
