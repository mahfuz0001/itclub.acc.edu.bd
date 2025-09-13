"use client";

import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Footer from "@/components/layout/footer";
import {
  Zap,
  Command,
  Scale,
  Bot,
  Shield,
  Sparkles,
  Check,
} from "lucide-react";
import Hero from "@/components/home/hero";
import RecentNews from "@/components/home/recent-news";
import Journey from "@/components/home/journey";
import AboutUs from "@/components/home/about-us";
import CurrentPanelists from "@/components/home/current-panelists";
import CurrentMembers from "@/components/home/current-members";
import Gallery from "@/components/home/gallery";
import JoinCTA from "@/components/home/join-cta";
import { FloatingDock } from "@/components/ui/floating-dock";
import Marquee from "@/components/home/Marquee";
import {
  IconHome,
  IconInfoCircle,
  IconMap,
  IconPhoto,
  IconUsers,
  IconNews,
} from "@tabler/icons-react";

export default function Home() {
  const dockItems = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-300" />,
      href: "#home",
    },
    {
      title: "About",
      icon: <IconInfoCircle className="h-full w-full text-neutral-300" />,
      href: "#about",
    },
    {
      title: "Our Journey",
      icon: <IconMap className="h-full w-full text-neutral-300" />,
      href: "#journey",
    },
    {
      title: "Gallery",
      icon: <IconPhoto className="h-full w-full text-neutral-300" />,
      href: "#gallery",
    },

    {
      title: "Panelists",
      icon: <IconUsers className="h-full w-full text-neutral-300" />,
      href: "#panelists",
    },
    {
      title: "News",
      icon: <IconNews className="h-full w-full text-neutral-300" />,
      href: "#news",
    },
  ];
  return (
    <div className="relative flex min-h-screen flex-col px-7">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Journey />
        <Marquee />
        <CurrentPanelists />
        <Gallery />
        {/* <RecentNews /> */}
        {/* <CurrentMembers /> */}
        <JoinCTA />
        <Footer />
        <FloatingDock items={dockItems} />
      </main>
      {/* <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 md:p-8 transform transition-transform duration-300 ease-in-out hover:scale-105">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-200 mb-2 font-sans uppercase flex flex-col items-center sm:flex-row sm:justify-center">
              ACADEMIC
              <span className="text-red-500 text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] mt-2 sm:mt-0 sm:ml-4 font-mono">
                1
              </span>
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-200 font-sans uppercase flex flex-col items-center sm:flex-row sm:justify-center">
              TALENT
              <span className="text-blue-500 text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] mt-2 sm:mt-0 sm:ml-4 font-mono">
                0
              </span>
            </h1>
          </div>
        </div>
      </div> */}
    </div>
  );
}
