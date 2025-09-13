"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon, MenuIcon } from "lucide-react";
import Image from "next/image";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Our Journey", href: "#journey" },
  { name: "Gallery", href: "#gallery" },
  { name: "Panelists", href: "#panelists" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const smoothScrollTo = (target: HTMLElement) => {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      smoothScrollTo(target);
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-[0_0_25px_2px_rgba(116,191,69,0.15)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Image
            src="/Logo.png"
            alt="ACCITC Logo"
            width={60}
            height={60}
            className="h-12 w-12 rounded-full drop-shadow-[0_0_8px_rgba(116,191,69,0.5)]"
          />
        </div>
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground hover:text-[#74bf45] hover:drop-shadow-[0_0_8px_rgba(116,191,69,0.7)] transition-all"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-sm font-semibold leading-6 text-foreground hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_rgba(116,191,69,0.6)] transition-all"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 bg-[#74bf45]/10 text-[#74bf45] hover:bg-[#74bf45]/20 hover:shadow-[0_0_15px_4px_rgba(116,191,69,0.4)] transition-all"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <div className="space-y-1 px-6 pb-3 pt-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-[#74bf45]/10 hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_rgba(116,191,69,0.6)] w-full text-left transition-all"
                >
                  {item.name}
                </button>
              ))}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-[#74bf45]/10 hover:text-[#74bf45] hover:drop-shadow-[0_0_6px_rgba(116,191,69,0.6)] w-full transition-all"
                >
                  {theme === "dark" ? (
                    <>
                      <SunIcon className="h-5 w-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
