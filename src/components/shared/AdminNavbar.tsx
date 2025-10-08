import { Search, Bell, Vote, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export default function DashboardHeader({
  onMenuToggle,
}: DashboardHeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleSearchClose = () => {
    setShowMobileSearch(false);
  };

  return (
    <header className="h-16 border-b border-border bg-background px-4 md:px-6 flex items-center justify-between relative">
      {showMobileSearch && isMobile && (
        <div className="absolute inset-0 bg-background z-50 flex items-center px-4 space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events, candidates..."
              className="pl-10 w-full bg-muted border-border focus:bg-background"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchClose}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {!showMobileSearch && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Vote className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline-block">
              VoteHub
            </span>
          </div>
        )}
      </div>

      {!showMobileSearch && (
        <div className="flex items-center gap-4">
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events, candidates..."
              className="pl-10 w-80 bg-muted border-border focus:bg-background"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-card border-border"
            >
              <DropdownMenuLabel className="text-card-foreground">
                Admin User
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}