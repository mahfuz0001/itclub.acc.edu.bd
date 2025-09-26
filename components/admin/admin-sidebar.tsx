"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/firebase/auth-provider";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  UserPlus,
  LayoutDashboard,
  UserCircle,
  Shield,
  ImageIcon,
  Activity,
} from "lucide-react";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["admin", "panel", "root"],
    },
    {
      title: "Applications",
      href: "/admin/applications",
      icon: <UserPlus className="h-5 w-5" />,
      roles: ["admin", "panel", "root"],
    },
    {
      title: "Members",
      href: "/admin/members",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin", "panel", "root"],
    },
    {
      title: "Panelists",
      href: "/admin/panelists",
      icon: <UserCircle className="h-5 w-5" />,
      roles: ["admin", "root"],
    },
    {
      title: "News",
      href: "/admin/news",
      icon: <FileText className="h-5 w-5" />,
      roles: ["admin", "root"],
    },
    {
      title: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon className="h-5 w-5" />,
      roles: ["admin", "root"],
    },
    {
      title: "Website",
      href: "/admin/website",
      icon: <Home className="h-5 w-5" />,
      roles: ["admin", "root"],
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: <Shield className="h-5 w-5" />,
      roles: ["root"],
    },
    {
      title: "Activity",
      href: "/admin/activity",
      icon: <Activity className="h-5 w-5" />,
      roles: ["admin", "root"],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin", "panel", "root"],
    },
  ];

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-muted/40 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            IT Club Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("absolute right-2 top-3", collapsed && "right-2")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map(
            (item, index) =>
              item.roles.includes(user?.role || "admin") && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-[#94a3b8]",
                    collapsed && "justify-center px-0"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )
          )}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t p-2">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium">
                {user?.email || "Admin User"}
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={() => signOut()}
            className={cn(
              "text-[#94a3b8] hover:text-[#f8fafc]",
              collapsed && "h-9 w-9"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
