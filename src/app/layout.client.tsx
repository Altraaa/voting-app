"use client";

import { Inter } from "next/font/google";
import QueryProvider from "@/providers/queryProvider";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={inter.className}>
      <QueryProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
        </GoogleOAuthProvider>
        <Toaster richColors position="bottom-right" />
      </QueryProvider>
    </body>
  );
}
