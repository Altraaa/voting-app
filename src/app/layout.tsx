import type { Metadata } from "next";
import ClientLayout from "./layout.client";

export const metadata: Metadata = {
  title: "Seraphic - Make Your Voice Heard",
  description:
    "Participate in exciting voting competitions and support your favorite candidates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
