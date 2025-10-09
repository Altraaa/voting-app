import { verifyOtpController } from "@/config/controllers/otpController";

export async function POST(req: Request) {
  return verifyOtpController(req);
}
