import { prisma } from "@/lib/prisma";
import { otpPayload } from "../types/otpType";
import { transporter } from "@/lib/mailer";
import crypto from "crypto";

export async function verifyOtpService(data: otpPayload) {
  const { email, otpCode } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const otp = await prisma.oTPVerification.findFirst({
    where: { userId: user.id, otpCode, verified: false },
  });
  if (!otp) throw new Error("INVALID_OTP");

  if (otp.expiresAt < new Date()) {
    throw new Error("OTP_EXPIRED");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  await prisma.oTPVerification.update({
    where: { id: otp.id },
    data: { verified: true },
  });

  return { success: true, message: "OTP_VERIFIED" };
}

export async function resendOtpService(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (user.isVerified) {
    throw new Error("USER_ALREADY_VERIFIED");
  }

  await prisma.oTPVerification.deleteMany({
    where: { userId: user.id, verified: false },
  });

  const otpCode = crypto.randomInt(100000, 999999).toString();

  await prisma.oTPVerification.create({
    data: {
      userId: user.id,
      otpCode,
      expiresAt: new Date(Date.now() + 60 * 1000), // 1 menit
    },
  });

  await transporter.sendMail({
    from: `"Voting App" <${process.env.NEXT_PUBLIC_EMAIL}>`,
    to: email,
    subject: "Kode OTP Baru - Voting App",
    html: `
      <h2>Hai ${user.name || "User"} 👋</h2>
      <p>Kode OTP baru kamu adalah: <b>${otpCode}</b></p>
      <p><i>Kode ini berlaku selama 1 menit.</i></p>
    `,
  });

  return { success: true, message: "OTP_RESENT" };
}