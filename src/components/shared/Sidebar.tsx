"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "../props/RouteSidebarProps";
import { Route } from "next";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 
          h-[calc(100vh-4rem)] border-r border-sidebar-border
          transition-all duration-300 ease-in-out z-40
          flex flex-col
          ${isOpen ? "w-60 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0"}
          overflow-hidden
        `}
      >
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href as Route}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`
                    flex items-center w-full justify-start rounded-md text-sm font-medium transition-colors relative
                    group
                    ${isActive
                      ? "text-sidebar-primary bg-sidebar-accent"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                    px-3 py-2
                  `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
                  )}
                  
                  <item.icon className="w-4 h-4 mr-2" />
                  
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 border-t border-sidebar-border mt-auto shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-xs text-sidebar-foreground/70">
              © 2024 VoteHub
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}