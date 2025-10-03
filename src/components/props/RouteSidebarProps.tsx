import { NavigationType } from "@/config/types/navigationType";
import {
  Home,
  Calendar,
  FolderOpen,
  Users,
  Package,
  History,
  Settings,
  UserCheck,
} from "lucide-react";

export const navigation: NavigationType[] = [
  { name: "Overview", href: "/admin", icon: Home },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Candidates", href: "/admin/candidates", icon: UserCheck },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Package History", href: "/admin/packages/history", icon: History },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];
