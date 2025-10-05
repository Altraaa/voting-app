"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vote, CreditCard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthUser } from "@/config/hooks/useAuthUser";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthUser();
  const userPoints = user?.points || 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-primary" />
            <Link href="/" className="text-2xl font-bold text-primary">
              Seraphic
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/event"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
            >
              All Events
            </Link>
            <Link
              href="/points"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
            >
              Buy Points
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <CreditCard className="h-4 w-4" />
              <span>Points: {userPoints}</span>
            </div>

            <Button
              asChild
              className="hidden md:flex rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link href="/points">Get Points</Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden rounded-full transition-all duration-300 hover:bg-accent/50"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-300 rotate-0" />
              )}
            </Button>
          </div>
        </div>

        <div
          className={`
            md:hidden transition-all duration-500 ease-in-out overflow-hidden
            ${
              isMenuOpen
                ? "max-h-96 opacity-100 mt-4 pt-4 border-t border-border/50"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div className="flex flex-col space-y-4 pb-2">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-300 transform hover:translate-x-2 py-2"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/event"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-300 transform hover:translate-x-2 py-2"
              onClick={closeMenu}
            >
              All Events
            </Link>
            <Link
              href="/points"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-300 transform hover:translate-x-2 py-2"
              onClick={closeMenu}
            >
              Buy Points
            </Link>

            <div className="pt-2 space-y-3">
              <Button
                asChild
                className="w-full rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Link href="/points" onClick={closeMenu}>
                  Get Points
                </Link>
              </Button>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground py-2 bg-muted/30 rounded-full transition-all duration-300 hover:bg-muted/50">
                <CreditCard className="h-4 w-4" />
                <span>Points: {userPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
