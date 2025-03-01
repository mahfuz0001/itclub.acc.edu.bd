"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/gallery?limit=6");
        if (!response.ok) {
          throw new Error("Failed to fetch gallery images");
        }
        const data = await response.json();

        console.log("Fetched gallery data:", data);

        setImages(
          Array.isArray(data)
            ? data.map((item) => ({
                id: item.id,
                url: item.imageUrl,
                caption: item.caption,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        toast({
          title: "Error",
          description: "Failed to load gallery images. Please try again later.",
          variant: "destructive",
        });
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [toast]);

  return (
    <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container px-4 md:px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-white bg-gradient-to-r from-primary to-secondary">
            Gallery
          </h2>
          <p className="mx-auto max-w-2xl mt-4 text-xl text-[#94a3b8]">
            Moments captured from our events and activities
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {loading
            ? Array(6)
                .fill(null)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    className="aspect-square w-full rounded-lg"
                  />
                ))
            : (images || []).map((image, index) => (
                <motion.div
                  key={image.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img
                    src={image.url || "/placeholder.svg?height=400&width=400"}
                    alt={image.caption || "Gallery image"}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm font-medium">{image.caption}</p>
                  </div>
                </motion.div>
              ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            asChild
            className="rounded-full px-8 py-6 text-lg font-semibold bg-[#3b82f6] text-[#0f172a] hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/gallery">View Full Gallery</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
