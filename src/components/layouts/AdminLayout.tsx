"use client";

import type React from "react";
import Sidebar from "../shared/Sidebar";
import DashboardHeader from "../shared/AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50">
        <DashboardHeader />
      </div>

      <div className="flex">
        <div className="sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          <Sidebar />
        </div>

        <main className="flex-1 p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
