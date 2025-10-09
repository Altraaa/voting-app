import nodemailer from "nodemailer";

const SMTP_HOST = process.env.NEXT_PUBLIC_SMTP_HOST;
const SMTP_USER = process.env.NEXT_PUBLIC_EMAIL;
const SMTP_PASSWORD = process.env.EMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP gagal connect:", error);
  } else {
    console.log("✅ SMTP Hostinger siap jalan!");
  }
});
