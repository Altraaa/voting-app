"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Vote, CreditCard, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              href="/category"
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:scale-105"
            >
              Categories
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
              <span>Points: 0</span>
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
              className="md:hidden rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/50">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/category"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/points"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy Points
              </Link>
              <Button
                asChild
                className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 mt-2"
              >
                <Link href="/points" onClick={() => setIsMenuOpen(false)}>
                  Get Points
                </Link>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
                <CreditCard className="h-4 w-4" />
                <span>Points: 0</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
