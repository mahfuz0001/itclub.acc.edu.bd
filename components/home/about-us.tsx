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
    handleScroll();

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
        className="relative py-24 bg-gradient-to-b from-background to-background/5"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Soft Green Glow Background */}
        <motion.div
          className="absolute inset-0 mx-auto max-w-5xl blur-3xl rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle at center, #74bf45 0%, transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 0.2 : 0 }}
          transition={{ duration: 1.2 }}
        />

        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 relative order-2 lg:order-1"
              variants={itemVariants}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
                {/* Image Glow */}
                <div className="absolute -inset-4 rounded-3xl bg-[#74bf45]/30 blur-2xl" />
                <Image
                  src={
                    ABOUT_DATA.image || "/placeholder.svg?height=600&width=600"
                  }
                  alt="About our IT Club"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full relative rounded-2xl z-10 transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-primary/20 backdrop-blur-sm z-10" />
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-primary/10 backdrop-blur-sm z-10" />
            </motion.div>

            <motion.div
              className="lg:w-1/2 order-1 lg:order-2"
              variants={itemVariants}
            >
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#74bf45] to-[#a1d884] drop-shadow-[0_0_10px_#74bf45aa]">
                About Us
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {ABOUT_DATA.description}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {ABOUT_DATA.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-[0_0_15px_#74bf45aa] transition-shadow duration-300"
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
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-[0_0_20px_#74bf45aa] hover:shadow-[0_0_30px_#74bf45] transition-shadow"
              >
                <Link href="/#about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Separator className="my-12" />
    </>
  );
}
