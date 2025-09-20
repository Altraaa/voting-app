import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";

export async function registerService(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  terms?: boolean;
  newsLetter?: boolean;
  password: string;
}) {
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
