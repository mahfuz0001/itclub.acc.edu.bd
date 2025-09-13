"use client";

import { motion } from "framer-motion";
import { Separator } from "../ui/separator";

export default function Marquee() {
  return (
    <>
      <div
        className="relative w-full overflow-hidden bg-background py-16"
        id="marquee"
      >
        {/* Gradient overlay for fading edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />

        {/* Glowing marquee text */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 12,
          }}
        >
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center mx-4">
              <span
                className="text-7xl sm:text-8xl md:text-9xl font-bold text-transparent px-4 drop-shadow-[0_0_8px_#74bf45aa] hover:drop-shadow-[0_0_15px_#74bf45]"
                style={{
                  WebkitTextStroke: "1px rgb(156 163 175)", // Tailwind gray-400 stroke
                }}
              >
                EDUCATION DISCIPLINE MORALITY
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      <Separator className="my-12" />
    </>
  );
}
