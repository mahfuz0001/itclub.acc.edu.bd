"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ABOUT_DATA } from "@/constants/home-content";
import { Separator } from "../ui/separator";

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("about");
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsVisible(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check visibility on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <motion.section
        id="about"
        className="py-24 bg-gradient-to-b from-background to-background/5"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 relative order-2 lg:order-1"
              variants={itemVariants}
            >
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={
                    ABOUT_DATA.image || "/placeholder.svg?height=600&width=600"
                  }
                  alt="About our IT Club"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-primary/20 backdrop-blur-sm z-10" />
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-primary/10 backdrop-blur-sm z-10" />
            </motion.div>
            <motion.div
              className="lg:w-1/2 order-1 lg:order-2"
              variants={itemVariants}
            >
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                About Us
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {ABOUT_DATA.description}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {ABOUT_DATA.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Separator className="my-12" />
    </>
  );
}
