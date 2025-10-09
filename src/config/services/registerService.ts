import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { transporter } from "@/lib/mailer";
import crypto from "crypto";
import { RegisterPayload } from "../types/authType";

export async function registerService(data: RegisterPayload) {
  const { email, password, ...rest } = data;

  if (!email || !password) {
    throw new Error("EMAIL_PASSWORD_REQUIRED");
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.isVerified) {
      throw new Error("EMAIL_EXISTS");
    }

    const createdAt = existing.createdAt.getTime();
    const now = Date.now();

    if (now - createdAt > 60 * 60 * 1000) {
      await prisma.oTPVerification.deleteMany({
        where: { userId: existing.id },
      });
      await prisma.user.delete({ where: { id: existing.id } });
    } else {
      throw new Error("UNVERIFIED_ACCOUNT_EXISTS");
    }
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

  const otpCode = crypto.randomInt(100000, 999999).toString();

  await prisma.oTPVerification.create({
    data: {
      userId: user.id,
      otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000),
    },
  });

  await transporter.sendMail({
    from: `"Seraphic (No Reply)" <${process.env.NEXT_PUBLIC_EMAIL}>`,
    to: email,
    subject: "Verifikasi Akun Kamu",
    html: `
      <h2>Hai ${user.name || "User"} 👋</h2>
      <p>Kode OTP kamu adalah: <b>${otpCode}</b></p>
      <p><i>Kode ini hanya berlaku selama 1 menit.</i></p>
    `,
  });

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token, message: "OTP_SENT" };
}