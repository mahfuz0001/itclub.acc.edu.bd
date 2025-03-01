"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20 min-h-[80vh] flex items-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-white bg-gradient-to-r from-primary to-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ACC IT Club Official Website
          </motion.h1>
          <motion.p
            className="max-w-[600px] text-[#94a3b8] mt-6 text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hehe, its the best club website lol
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/join">
              <Button
                size="lg"
                className="bg-[#3b82f6] text-[#0f172a] hover:bg-primary/90 rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
    </section>
  );
}
