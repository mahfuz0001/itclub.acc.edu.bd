"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/firebase/auth-provider";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/constants/site";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "News", href: "/news" },
    { name: "Gallery", href: "/gallery" },
    { name: "Join", href: "/join" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#020817]/95 backdrop-blur supports-[backdrop-filter]:bg-[#020817]/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#3b82f6]",
                  pathname === item.href ? "text-[#f8fafc]" : "text-[#94a3b8]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-[#94a3b8]"
                )}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Admin
                </Link>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
