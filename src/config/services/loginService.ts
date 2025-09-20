import { prisma } from "@/lib/prisma";
import { comparePassword, createToken } from "@/lib/auth";

export async function loginService(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}
