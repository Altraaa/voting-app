"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        toast.success("You have been logged out");

        router.push("/login");
      } catch (error) {
        toast.error("Logout failed");
        console.error("Logout error:", error);
      }
    };

    doLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}
