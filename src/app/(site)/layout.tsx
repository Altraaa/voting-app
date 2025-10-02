"use client";

import MainLayout from "@/components/layouts/MainLayout";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}