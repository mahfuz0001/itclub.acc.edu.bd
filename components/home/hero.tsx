"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "../ui/separator";
import Image from "next/image";

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  return (
    <div className="relative" id="home">
      <section className="relative py-10 sm:py-16 lg:py-24">
        {/* ✅ Background Glow */}
        <div
          className="absolute -inset-x-20 top-0 bottom-0 mx-auto max-w-5xl rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(116,191,69,0.25), rgba(116,191,69,0))",
            boxShadow: "0 0 80px 30px rgba(116,191,69,0.2)",
          }}
        />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="relative z-10">
              <p className="text-base font-semibold tracking-wider text-[#74bf45] uppercase">
                🔥 Bangladesh&apos;s #1 Student Tech Community
              </p>
              <h1 className="mt-4 text-4xl font-bold lg:mt-8 sm:text-6xl xl:text-8xl">
                Adamjee Cantonment College
                <span className="block text-[#74bf45] drop-shadow-[0_0_12px_rgba(116,191,69,0.6)]">
                  IT Club
                </span>
              </h1>
              <p className="mt-4 text-base lg:mt-8 sm:text-xl text-[#94a3b8]">
                🚀 Join 200+ Tech Innovators • 🏆 50+ Events Annually • 💼 Industry Connections
              </p>
              <p className="mt-2 text-base sm:text-lg text-white">
                Transform your passion into expertise. Learn cutting-edge tech, build real projects, 
                and connect with Bangladesh&apos;s brightest minds.
              </p>

              {/* Enhanced CTA Button */}
              <div className="mt-8 lg:mt-12 space-y-4">
                <Link
                  href="/join"
                  title="Join Our Elite Community"
                  className="inline-flex items-center px-8 py-5 font-bold text-black transition-all duration-200 bg-[#74bf45] rounded-full hover:bg-[#75c445] focus:outline-none focus:ring-2 focus:ring-[#74bf45] focus:ring-offset-2 focus:ring-offset-white shadow-[0_0_25px_6px_rgba(116,191,69,0.5)] hover:shadow-[0_0_35px_10px_rgba(116,191,69,0.6)] transform hover:scale-105"
                  role="button"
                >
                  🎯 Join Elite Community Now
                  <svg
                    className="w-6 h-6 ml-3 -mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Link>
                
                {/* Social Proof */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-[#74bf45] rounded-full border-2 border-white flex items-center justify-center text-black text-xs font-bold">👤</div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">👤</div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">👤</div>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center text-black text-xs font-bold">+</div>
                  </div>
                  <p className="text-sm text-[#94a3b8]">
                    <span className="text-[#74bf45] font-semibold">200+ students</span> already building the future
                  </p>
                </div>

                {/* Quick Social Links */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                  <span className="text-sm text-[#94a3b8]">Follow us:</span>
                  <Link 
                    href="https://www.facebook.com/accitc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#74bf45] hover:text-[#75c445] transition-colors"
                  >
                    📘 Facebook
                  </Link>
                  <Link 
                    href="https://instagram.com/accitc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#74bf45] hover:text-[#75c445] transition-colors"
                  >
                    📸 Instagram
                  </Link>
                </div>
              </div>
            </div>

            {/* Image with slight glow */}
            <div className="relative z-10">
              <div className="absolute inset-0 rounded-lg blur-2xl opacity-30 pointer-events-none shadow-[0_0_60px_10px_rgba(116,191,69,0.3)]" />
              <Image
                className="relative w-full h-[500px] object-cover object-bottom rounded-lg"
                width={500}
                height={500}
                src="/assets/green_acc.jpg"
                alt="ACC IT Club"
              />
            </div>
          </div>
        </div>
      </section>
      <Separator className="my-12" />
    </div>
  );
}
