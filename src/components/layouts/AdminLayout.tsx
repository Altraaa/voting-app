"use client";

import type React from "react";
import Sidebar from "../shared/Sidebar";
import DashboardHeader from "../shared/AdminNavbar";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main
          className={`
            flex-1 p-8 bg-muted/30 min-h-[calc(100vh-4rem)] 
            transition-all duration-300
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
