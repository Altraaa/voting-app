import { resendOtpController } from "@/config/controllers/otpController";

export async function POST(req: Request) {
  return resendOtpController(req);
}