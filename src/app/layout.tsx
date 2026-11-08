import type { Metadata } from "next";
import ClientLayout from "./layout.client";

export const metadata: Metadata = {
  title: "Pilih.in - Make Your Voice Heard",
  description:
    "Participate in exciting voting competitions and support your favorite candidates",
  // Cegah Google Translate (Chrome Android) mengubah DOM yang dikelola React,
  // yang memicu crash removeChild/insertBefore.
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" translate="no">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
