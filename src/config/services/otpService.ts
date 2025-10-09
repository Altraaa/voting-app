import { prisma } from "@/lib/prisma";

export async function verifyOtpService(email: string, otpCode: string) {
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
